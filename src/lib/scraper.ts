export interface PreviewData {
    url: string;
    title: string;
    description: string;
    image: string;
    siteName: string;
    favicon: string;
    mediaType: 'video' | 'image' | 'article';
}

import { PLACEHOLDERS, API_ENDPOINTS, TIMEOUTS } from './constants';

const DEFAULT_PLACEHOLDER = PLACEHOLDERS.IMAGE;

/**
 * Extract YouTube video ID from various URL formats
 */
export function parseYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Get high-resolution YouTube thumbnail
 */
export function getYouTubeThumbnail(videoId: string): string {
    return API_ENDPOINTS.YOUTUBE_THUMBNAIL(videoId);
}

/**
 * Fetch YouTube video metadata using oEmbed API
 */
async function fetchYouTubeMetadata(videoId: string, url: string): Promise<PreviewData> {
    try {
        const oembedUrl = API_ENDPOINTS.YOUTUBE_OEMBED(url);
        const response = await fetch(oembedUrl, {
            signal: AbortSignal.timeout(TIMEOUTS.YOUTUBE_OEMBED)
        });

        if (!response.ok) {
            throw new Error('oEmbed request failed');
        }

        const data = await response.json();

        return {
            url,
            title: data.title || 'YouTube Video',
            description: `By ${data.author_name || 'Unknown'}`,
            image: getYouTubeThumbnail(videoId),
            siteName: 'YouTube',
            favicon: API_ENDPOINTS.YOUTUBE_FAVICON,
            mediaType: 'video',
        };
    } catch {
        // Fallback if oEmbed fails
        return {
            url,
            title: 'YouTube Video',
            description: '',
            image: getYouTubeThumbnail(videoId),
            siteName: 'YouTube',
            favicon: API_ENDPOINTS.YOUTUBE_FAVICON,
            mediaType: 'video',
        };
    }
}

/**
 * Determine media type from URL
 */
export function detectMediaType(url: string): 'video' | 'image' | 'article' {
    const videoPatterns = [
        /youtube\.com/,
        /youtu\.be/,
        /vimeo\.com/,
        /tiktok\.com/,
        /instagram\.com\/reel/,
        /twitter\.com\/.*\/video/,
        /x\.com\/.*\/video/,
        /twitch\.tv/,
        /dailymotion\.com/,
    ];

    const imagePatterns = [
        // Direct image URLs
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i,
        // Image hosting
        /imgur\.com/,
        /i\.redd\.it/,
        /giphy\.com/,
        /gfycat\.com/,
        // Image-focused platforms
        /pinterest\.(com|ca|co\.uk|de|fr|es|it|jp|kr|au|nz|at|ch|be|nl|se|no|dk|fi|pl|pt|ie|ru|in|mx|br|ar|cl|co)/,
        /pin\.it/,
        /unsplash\.com/,
        /pexels\.com/,
        /pixabay\.com/,
        /flickr\.com/,
        /500px\.com/,
        // Art & Design platforms
        /deviantart\.com/,
        /artstation\.com/,
        /dribbble\.com/,
        /behance\.net/,
        // Photo sharing
        /instagram\.com(?!\/reel)/,  // Instagram posts (not reels)
        /tumblr\.com.*\/(image|photo)/,
        /flic\.kr/,
        // Wallpapers
        /wallhaven\.cc/,
        /alphacoders\.com/,
    ];

    for (const pattern of videoPatterns) {
        if (pattern.test(url)) return 'video';
    }

    for (const pattern of imagePatterns) {
        if (pattern.test(url)) return 'image';
    }

    return 'article';
}

/**
 * Parse meta tags from HTML
 */
function parseMetaTags(html: string): Record<string, string> {
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
        tags['title'] = titleMatch[1].trim();
    }

    // Description meta
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) {
        tags['description'] = descMatch[1];
    }

    // Favicon
    const faviconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i);
    if (faviconMatch) {
        tags['favicon'] = faviconMatch[1];
    }

    return tags;
}

/**
 * Resolve relative URLs to absolute
 */
function resolveUrl(base: string, relative: string): string {
    if (!relative) return '';
    if (relative.startsWith('http://') || relative.startsWith('https://')) {
        return relative;
    }
    if (relative.startsWith('//')) {
        return 'https:' + relative;
    }
    try {
        const baseUrl = new URL(base);
        if (relative.startsWith('/')) {
            return `${baseUrl.origin}${relative}`;
        }
        return `${baseUrl.origin}/${relative}`;
    } catch {
        return relative;
    }
}

/**
 * Fetch and parse metadata from a URL
 */
export async function fetchMetadata(url: string): Promise<PreviewData> {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '');

    // Check for YouTube - use oEmbed API for reliable metadata
    const youtubeId = parseYouTubeId(url);
    if (youtubeId) {
        return fetchYouTubeMetadata(youtubeId, url);
    }

    // Check for Pinterest (including pin.it short URLs) - use oEmbed API
    if (/pinterest\.(com|ca|co\.uk|de|fr|es|it|jp|kr|au)/i.test(hostname) || hostname === 'pin.it') {
        try {
            const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(url)}`;
            const oembedRes = await fetch(oembedUrl, {
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(8000),
            });

            if (oembedRes.ok) {
                const data = await oembedRes.json();
                return {
                    url,
                    title: data.title || 'Pinterest Pin',
                    description: data.author_name ? `Saved by ${data.author_name}` : 'Pinterest',
                    image: data.thumbnail_url || DEFAULT_PLACEHOLDER,
                    siteName: 'Pinterest',
                    favicon: 'https://www.pinterest.com/favicon.ico',
                    mediaType: 'image',
                };
            }
        } catch (e) {
            console.warn('Pinterest oEmbed failed:', e);
        }
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkeditBot/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const resolvedUrl = response.url;

        // Check for Pinterest after redirect
        // Matches pinterest.com/pin/ or *.pinterest.com/pin/
        if (/(?:^|\.)pinterest\.com\/pin\//i.test(resolvedUrl)) {
            try {
                // Clean URL for oEmbed (remove query params like invite codes etc)
                const cleanUrl = resolvedUrl.split('?')[0];
                const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(cleanUrl)}`;

                const oembedRes = await fetch(oembedUrl);
                if (oembedRes.ok) {
                    const data = await oembedRes.json();
                    return {
                        url: resolvedUrl,
                        title: data.title || 'Pinterest Pin',
                        description: data.author_name ? `Saved by ${data.author_name}` : '',
                        image: data.thumbnail_url || DEFAULT_PLACEHOLDER,
                        siteName: 'Pinterest',
                        favicon: 'https://www.pinterest.com/favicon.ico',
                        mediaType: 'image',
                    };
                }
            } catch (e) {
                console.warn('Pinterest oEmbed failed, falling back to HTML parsing', e);
            }
        }

        const html = await response.text();
        const tags = parseMetaTags(html);

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
    } catch {
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
