
import { decodeHtmlEntities, resolveUrl, detectMediaType } from '../utils';
import { PreviewData } from '../types';
import { PLACEHOLDERS } from '@/lib/constants';

const DEFAULT_PLACEHOLDER = PLACEHOLDERS.IMAGE;

export const isFacebookUrl = (url: string) => /facebook\.com|fb\.watch|fb\.com|messenger\.com|instagram\.com/.test(url);

export function getFacebookUserAgent(isFacebook: boolean) {
    return isFacebook
        ? 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
}

export function cleanFacebookTitle(title: string, tags: Record<string, string>): string {
    if (!title) return '';

    // Remove engagement metrics and " | Facebook" suffix
    // Pattern: "1.2K likes . 45 comments | Title | Author"
    // Strategy: Split by | and filter out metrics
    const parts = title.split('|').map(p => p.trim());
    const cleanerParts = parts.filter(p => {
        // Filter out metrics (e.g., "3.7K likes", "84 shares", "reaksyon")
        // Also handles the "na reaksyon" case reported by user (Tagalog)
        if (/^\d+.*(like|share|comment|reaction|reaksyon|view)/i.test(p)) return false;
        // Filter out "Facebook" or "Instagram" branding
        if (/^(Facebook|Instagram)$/i.test(p)) return false;
        return true;
    });

    // If we have parts left, take the longest one as it's likely the content
    let cleanTitle = title;
    if (cleanerParts.length > 0) {
        cleanTitle = cleanerParts.sort((a, b) => b.length - a.length)[0];
    }

    // Remove author prefix if it exists (common in FB titles: "Author Name - Post Content")
    // Heuristic: If title starts with "Author - ", remove it.
    // We can check if the title starts with the og:title (which is often just the author)
    const author = tags['og:title'];
    if (author && cleanTitle.startsWith(author) && cleanTitle.length > author.length) {
        const potentialTitle = cleanTitle.substring(author.length).replace(/^[\s\-\–\—]+/, '');
        // Only use the shortened title if it's not empty or generic
        if (potentialTitle && !/^(Home|Timeline|Log In|Sign Up)$/i.test(potentialTitle)) {
            cleanTitle = potentialTitle;
        }
    }

    // Remove trailing hashtags and dot separators
    // Example: "Title . . . #tag #tag" -> "Title"
    // Remove hashtags at the end (match space + # + non-space chars)
    cleanTitle = cleanTitle.replace(/(\s*#[^\s]+)+$/, '');
    // Remove trailing dots/punctuation
    cleanTitle = cleanTitle.replace(/[\s\.]+$/, '');

    return cleanTitle;
}

export function processFacebookMetadata(
    url: string,
    resolvedUrl: string,
    tags: Record<string, string>,
    hostname: string
): PreviewData {
    let title = tags['og:title'] || tags['twitter:title'] || tags['title'] || hostname;

    // For Facebook/Instagram, if the title is very short or just the author, try the <title> tag
    // which often contains "Author - Post Content"
    // We check if title matches og:title (which is often just the author) or is very short
    if (tags['title'] && (!title || title.length < 20 || title === tags['og:site_name'] || title === tags['og:title'])) {
        title = tags['title'];
    }

    // Clean up title
    if (title) {
        title = cleanFacebookTitle(title, tags);
    }

    const image = tags['og:image'] || tags['twitter:image'] || '';
    const resolvedImage = image ? resolveUrl(url, image) : DEFAULT_PLACEHOLDER;
    const favicon = tags['favicon'] ? resolveUrl(url, tags['favicon']) : `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

    // REWRITE IMAGE URL TO USE PROXY for Facebook/Instagram
    // Because Facebook blocks direct image loading without bot UA
    let finalImage = resolvedImage;
    if (resolvedImage && resolvedImage !== DEFAULT_PLACEHOLDER) {
        finalImage = `/api/proxy-image?url=${encodeURIComponent(resolvedImage)}`;
    }

    return {
        url: resolvedUrl,
        title: title,
        description: tags['og:description'] || tags['twitter:description'] || tags['description'] || '',
        image: finalImage,
        siteName: tags['og:site_name'] || hostname,
        favicon,
        mediaType: detectMediaType(resolvedUrl),
    };
}
