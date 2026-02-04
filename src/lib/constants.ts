/**
 * Application-wide constants
 * Centralized magic values for better maintainability
 */

// Timeout values in milliseconds
export const TIMEOUTS = {
    FETCH_METADATA: 10000,
    YOUTUBE_OEMBED: 5000,
    PINTEREST_OEMBED: 8000,
    DEBOUNCE_RESIZE: 100,
    DEBOUNCE_SEARCH: 300,
} as const;

// Placeholder and fallback URLs
export const PLACEHOLDERS = {
    // Use design tokens from CSS variables
    IMAGE: 'https://placehold.co/1200x630/13131a/00f0ff?text=No+Preview',
    FAVICON: (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
} as const;

// UI limits
export const LIMITS = {
    MAX_TAGS_DISPLAY: 3,
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 200,
    MASONRY_GAP: 16,
} as const;

// External API endpoints
export const API_ENDPOINTS = {
    YOUTUBE_OEMBED: (url: string) => `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    PINTEREST_OEMBED: (url: string) => `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(url)}`,
    YOUTUBE_THUMBNAIL: (videoId: string) => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    YOUTUBE_FAVICON: 'https://www.youtube.com/favicon.ico',
    PINTEREST_FAVICON: 'https://www.pinterest.com/favicon.ico',
} as const;

// Media type patterns for URL detection
export const MEDIA_PATTERNS = {
    VIDEO: [
        /youtube\.com/,
        /youtu\.be/,
        /vimeo\.com/,
        /tiktok\.com/,
        /instagram\.com\/reel/,
        /twitter\.com\/.*\/video/,
        /x\.com\/.*\/video/,
        /twitch\.tv/,
        /dailymotion\.com/,
    ],
    IMAGE: [
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i,
        /imgur\.com/,
        /i\.redd\.it/,
        /giphy\.com/,
        /pinterest\.(com|ca|co\.uk|de|fr|es|it|jp|kr|au|nz|at|ch|be|nl|se|no|dk|fi|pl|pt|ie|ru|in|mx|br|ar|cl|co)/,
        /pin\.it/,
        /unsplash\.com/,
        /pexels\.com/,
        /deviantart\.com/,
        /artstation\.com/,
        /dribbble\.com/,
        /behance\.net/,
    ],
} as const;
