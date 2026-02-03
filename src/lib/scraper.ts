export interface PreviewData {
    url: string;
    title: string;
    description: string;
    image: string;
    siteName: string;
    favicon: string;
    mediaType: 'video' | 'image' | 'article';
}

const DEFAULT_PLACEHOLDER = 'https://placehold.co/1200x630/13131a/00f0ff?text=No+Preview';

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
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
    ];

    const imagePatterns = [
        /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
        /imgur\.com/,
        /i\.redd\.it/,
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

    // Check for YouTube first
    const youtubeId = parseYouTubeId(url);
    if (youtubeId) {
        // For YouTube, we can construct data without fetching
        return {
            url,
            title: 'YouTube Video',
            description: '',
            image: getYouTubeThumbnail(youtubeId),
            siteName: 'YouTube',
            favicon: 'https://www.youtube.com/favicon.ico',
            mediaType: 'video',
        };
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkEditBot/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const tags = parseMetaTags(html);

        const image = tags['og:image'] || tags['twitter:image'] || '';
        const resolvedImage = image ? resolveUrl(url, image) : DEFAULT_PLACEHOLDER;
        const favicon = tags['favicon'] ? resolveUrl(url, tags['favicon']) : `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

        return {
            url,
            title: tags['og:title'] || tags['twitter:title'] || tags['title'] || hostname,
            description: tags['og:description'] || tags['twitter:description'] || tags['description'] || '',
            image: resolvedImage,
            siteName: tags['og:site_name'] || hostname,
            favicon,
            mediaType: detectMediaType(url),
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
