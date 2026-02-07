
import { decodeHtmlEntities } from './utils';

/**
 * Parse meta tags from HTML
 */
export function parseMetaTags(html: string): Record<string, string> {
    const tags: Record<string, string> = {};

    // OG tags
    const ogPattern = /<meta\s+(?:property|name)=["']og:(\w+)["']\s+content=["']([^"']+)["']/gi;
    let match;
    while ((match = ogPattern.exec(html)) !== null) {
        tags[`og:${match[1]}`] = match[2];
    }

    // Alternative format: content before property
    const ogPatternAlt = /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:(\w+)["']/gi;
    while ((match = ogPatternAlt.exec(html)) !== null) {
        tags[`og:${match[2]}`] = match[1];
    }

    // Twitter tags
    const twitterPattern = /<meta\s+(?:property|name)=["']twitter:(\w+)["']\s+content=["']([^"']+)["']/gi;
    while ((match = twitterPattern.exec(html)) !== null) {
        tags[`twitter:${match[1]}`] = match[2];
    }

    // Twitter alt format
    const twitterPatternAlt = /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']twitter:(\w+)["']/gi;
    while ((match = twitterPatternAlt.exec(html)) !== null) {
        tags[`twitter:${match[2]}`] = match[1];
    }

    // Title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
        tags['title'] = decodeHtmlEntities(titleMatch[1].trim());
    }

    // Description meta
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) {
        tags['description'] = decodeHtmlEntities(descMatch[1]);
    }

    // Favicon
    const faviconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i);
    if (faviconMatch) {
        tags['favicon'] = faviconMatch[1];
    }

    // Decode OG/Twitter values
    Object.keys(tags).forEach(key => {
        // Decode title, description, and image URLs
        if (key.startsWith('og:') || key.startsWith('twitter:') || key === 'title' || key === 'description' || key === 'image') {
            tags[key] = decodeHtmlEntities(tags[key]);
        }
    });

    return tags;
}
