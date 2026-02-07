
import { API_ENDPOINTS, TIMEOUTS } from '@/lib/constants';
import { PreviewData } from '../types';

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
export async function fetchYouTubeMetadata(videoId: string, url: string): Promise<PreviewData> {
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
