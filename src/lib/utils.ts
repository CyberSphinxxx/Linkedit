/**
 * Shared utility functions
 */

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if URL points to a direct image file
 */
export function isDirectImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

/**
 * Safely parse URL and return hostname, with fallback
 */
export function getHostname(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return 'unknown';
    }
}

/**
 * Generate a favicon URL from Google's favicon service
 */
export function getFaviconUrl(url: string): string {
    const hostname = getHostname(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
