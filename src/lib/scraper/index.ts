
import { PreviewData } from './types';
import { TIMEOUTS, PLACEHOLDERS } from '@/lib/constants';
import { resolveUrl, detectMediaType } from './utils';
import { parseMetaTags } from './parsers';
import { parseYouTubeId, fetchYouTubeMetadata } from './strategies/youtube';
import { isFacebookUrl, getFacebookUserAgent, processFacebookMetadata } from './strategies/facebook';
import { isPinterestUrl } from './strategies/pinterest';

// Re-export specific functions that might be used elsewhere
export { parseYouTubeId };
export type { PreviewData };

const DEFAULT_PLACEHOLDER = PLACEHOLDERS.IMAGE;

/**
 * Fetch and parse metadata from a URL
 */
export async function fetchMetadata(url: string): Promise<PreviewData> {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '');

    // 1. Check for YouTube - use oEmbed API for reliable metadata
    const youtubeId = parseYouTubeId(url);
    if (youtubeId) {
        return fetchYouTubeMetadata(youtubeId, url);
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        // Use Googlebot UA for Facebook to bypass 400 errors/login walls
        // We check valid FB url first to set UA
        const isFacebook = isFacebookUrl(url);
        const userAgent = getFacebookUserAgent(isFacebook);

        let response;
        try {
            response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml',
                },
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (
            !contentType.includes('text/html') && 
            !contentType.includes('application/xhtml+xml') && 
            !contentType.includes('text/xml')
        ) {
            // Not a web page, abort early before downloading to prevent OOM
            return {
                url: response.url,
                title: hostname,
                description: '',
                image: DEFAULT_PLACEHOLDER,
                siteName: hostname,
                favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
                mediaType: detectMediaType(response.url),
            };
        }

        const resolvedUrl = response.url;

        // 2. Check for Pinterest after redirect
        if (isPinterestUrl(resolvedUrl)) {
            // Lazy import to avoid circular dependencies if any
            const { fetchPinterestMetadata } = await import('./strategies/pinterest');

            // Pass a clone so we don't consume the main response stream if this strategy "fails" (returns null)
            // but we want to fall back to generic parsing with the original response.
            const pinterestData = await fetchPinterestMetadata(response.clone(), url);
            if (pinterestData) {
                return pinterestData;
            }
        }

        // 3. Generic Parsing
        // If not Pinterest (or Pinterest logic wasn't entered), read the text
        const html = await response.text();
        const tags = parseMetaTags(html);

        // Check if resolved URL is Facebook (e.g. short links)
        if (isFacebook || isFacebookUrl(resolvedUrl)) {
            return processFacebookMetadata(url, resolvedUrl, tags, hostname);
        }

        // Standard Fallback
        const image = tags['og:image'] || tags['twitter:image'] || '';
        const resolvedImage = image ? resolveUrl(url, image) : DEFAULT_PLACEHOLDER;
        const favicon = tags['favicon'] ? resolveUrl(url, tags['favicon']) : `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

        return {
            url: resolvedUrl, // Use resolved URL
            title: tags['og:title'] || tags['twitter:title'] || tags['title'] || hostname,
            description: tags['og:description'] || tags['twitter:description'] || tags['description'] || '',
            image: resolvedImage,
            siteName: tags['og:site_name'] || hostname,
            favicon,
            mediaType: detectMediaType(resolvedUrl),
        };

    } catch (error) {
        // Return minimal data on error
        return {
            url,
            title: hostname,
            description: 'Could not fetch preview',
            image: DEFAULT_PLACEHOLDER,
            siteName: hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            mediaType: detectMediaType(url),
        };
    }
}
