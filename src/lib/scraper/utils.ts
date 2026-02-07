
/**
 * Decode HTML entities
 */
export function decodeHtmlEntities(text: string): string {
    if (!text) return '';
    const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' ',
        '&#xb7;': '·',
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™',
    };
    return text.replace(/&[a-z0-9]+;|&#x[0-9a-f]+;|&#[0-9]+;/gi, (match) => {
        if (entities[match]) return entities[match];
        // Handle hex
        if (match.startsWith('&#x')) {
            return String.fromCodePoint(parseInt(match.slice(3, -1), 16));
        }
        // Handle decimal
        if (match.startsWith('&#')) {
            return String.fromCodePoint(parseInt(match.slice(2, -1), 10));
        }
        return match;
    });
}

/**
 * Resolve relative URLs to absolute
 */
export function resolveUrl(base: string, relative: string): string {
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
