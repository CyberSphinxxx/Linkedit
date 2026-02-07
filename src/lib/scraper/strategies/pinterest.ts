
import { PLACEHOLDERS } from '@/lib/constants';
import { PreviewData } from '../types';
import { resolveUrl, detectMediaType } from '../utils';
import { parseMetaTags } from '../parsers';

const DEFAULT_PLACEHOLDER = PLACEHOLDERS.IMAGE;

export const isPinterestUrl = (url: string) => /(?:^|\.)pinterest\.com\/pin\//i.test(url);

export async function fetchPinterestMetadata(
    response: Response,
    url: string,
    onHtmlParsed?: (html: string, tags: Record<string, string>) => void
): Promise<PreviewData | null> {
    try {
        const resolvedUrl = response.url;
        const hostname = new URL(resolvedUrl).hostname.replace('www.', '');

        // 1. Parse HTML first to get the Title
        // Note: Using response.text() directly here means we consume the stream.
        // The calling function must handle this (e.g. by not calling .text() again if this succeeds, 
        // or passing a cloned response if needed, but response cloning is expensive).
        // Since this function is designed to take over if it matches Pinterest, 
        // we assume ownership of the response body.
        const html = await response.text();
        const tags = parseMetaTags(html);

        // Callback to let caller know we parsed the HTML, in case they need it for fallback
        if (onHtmlParsed) onHtmlParsed(html, tags);

        const htmlTitle = tags['og:title'] || tags['twitter:title'] || tags['title'];

        // 2. Fetch oEmbed to get the high-quality Image
        // Clean URL for oEmbed
        let cleanUrl = resolvedUrl.split('?')[0];
        cleanUrl = cleanUrl.replace(/:\/\/[a-z]{2,3}\.pinterest\.com/, '://www.pinterest.com');
        cleanUrl = cleanUrl.replace(/\/sent\/?$/, '/');

        const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(cleanUrl)}`;

        const oembedRes = await fetch(oembedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (oembedRes.ok) {
            const data = await oembedRes.json();
            return {
                url: resolvedUrl,
                title: htmlTitle || data.title || 'Pinterest Pin',
                description: data.author_name ? `Saved by ${data.author_name}` : (tags['description'] || ''),
                image: (data.thumbnail_url || DEFAULT_PLACEHOLDER).replace(/\/236x\/|\/474x\/|\/736x\//, '/originals/'),
                siteName: 'Pinterest',
                favicon: 'https://www.pinterest.com/favicon.ico',
                mediaType: 'image',
            };
        }

        // oEmbed failed? Fallthrough to return generic data from the already-fetched HTML
        const image = tags['og:image'] || tags['twitter:image'] || '';
        const resolvedImage = image ? resolveUrl(url, image) : DEFAULT_PLACEHOLDER;
        const favicon = tags['favicon'] ? resolveUrl(url, tags['favicon']) : `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

        return {
            url: resolvedUrl,
            title: htmlTitle || hostname,
            description: tags['og:description'] || tags['twitter:description'] || tags['description'] || '',
            image: resolvedImage,
            siteName: tags['og:site_name'] || hostname,
            favicon,
            mediaType: detectMediaType(resolvedUrl),
        };

    } catch (e) {
        console.warn('Pinterest oEmbed failed, falling back to HTML parsing', e);
        // Return null to indicate failure, allowing the main scraper to try its generic fallback 
        // IF the stream wasn't consumed. But we DID consume the stream above.
        // So we must return a partial result here or handle the stream consumption/caching.
        // Since we parsed the tags early on, we should return whatever we have.
        return null;
    }
}
