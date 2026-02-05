'use client';

import { Link as LinkType } from '@/types/link';

// ============================================
// BOOKMARK HTML PARSING (Chrome/Edge export)
// ============================================

interface ParsedBookmark {
    url: string;
    title: string;
    addDate?: Date;
    tags: string[];
}

export function parseBookmarksHTML(html: string): ParsedBookmark[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bookmarks: ParsedBookmark[] = [];

    // Get all anchor tags (bookmarks)
    const anchors = doc.querySelectorAll('a');

    anchors.forEach((anchor) => {
        const url = anchor.getAttribute('href');
        const title = anchor.textContent?.trim() || 'Untitled';
        const addDateStr = anchor.getAttribute('add_date');

        if (url && url.startsWith('http')) {
            // Get folder name as tag (parent DL > parent DT > H3)
            const tags: string[] = [];
            let parent = anchor.parentElement;
            while (parent) {
                if (parent.tagName === 'DL') {
                    const prevSibling = parent.previousElementSibling;
                    if (prevSibling?.tagName === 'H3') {
                        const folderName = prevSibling.textContent?.trim();
                        if (folderName && folderName !== 'Bookmarks Bar' && folderName !== 'Bookmarks') {
                            tags.unshift(folderName.toLowerCase());
                        }
                    }
                }
                parent = parent.parentElement;
            }

            bookmarks.push({
                url,
                title,
                addDate: addDateStr ? new Date(parseInt(addDateStr) * 1000) : undefined,
                tags: tags.slice(0, 3), // Max 3 tags from folder hierarchy
            });
        }
    });

    return bookmarks;
}

export function convertBookmarksToLinks(bookmarks: ParsedBookmark[]): Omit<LinkType, '_id'>[] {
    return bookmarks.map((bookmark) => ({
        original_url: bookmark.url,
        metadata: {
            title: bookmark.title,
            description: '',
            thumbnail_image: '',
            site_name: new URL(bookmark.url).hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`,
        },
        tags: bookmark.tags,
        media_type: 'article' as const,
        is_favorite: false,
        created_at: bookmark.addDate || new Date(),
    }));
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

export function exportAsJSON(links: LinkType[], filename = 'linkedit-export'): void {
    const data = JSON.stringify(links, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
}

export function exportAsHTML(links: LinkType[], filename = 'linkedit-bookmarks'): void {
    const now = Math.floor(Date.now() / 1000);

    // Group links by first tag
    const grouped: Record<string, LinkType[]> = {};
    links.forEach((link) => {
        const folder = link.tags[0] || 'Uncategorized';
        if (!grouped[folder]) grouped[folder] = [];
        grouped[folder].push(link);
    });

    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file by LinkedIT -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>LinkedIT Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

    Object.entries(grouped).forEach(([folder, folderLinks]) => {
        html += `    <DT><H3 ADD_DATE="${now}">${escapeHTML(folder)}</H3>\n`;
        html += `    <DL><p>\n`;

        folderLinks.forEach((link) => {
            const addDate = Math.floor(new Date(link.created_at).getTime() / 1000);
            html += `        <DT><A HREF="${escapeHTML(link.original_url)}" ADD_DATE="${addDate}">${escapeHTML(link.metadata.title || 'Untitled')}</A>\n`;
        });

        html += `    </DL><p>\n`;
    });

    html += `</DL><p>\n`;

    const blob = new Blob([html], { type: 'text/html' });
    downloadBlob(blob, `${filename}.html`);
}

function escapeHTML(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// DATA CLEANUP FUNCTIONS
// ============================================

export function findDuplicateLinks(links: LinkType[]): { original: LinkType; duplicates: LinkType[] }[] {
    const urlMap = new Map<string, LinkType[]>();

    // Normalize URLs and group
    links.forEach((link) => {
        const normalizedUrl = normalizeUrl(link.original_url);
        if (!urlMap.has(normalizedUrl)) {
            urlMap.set(normalizedUrl, []);
        }
        urlMap.get(normalizedUrl)!.push(link);
    });

    // Find groups with more than one link
    const duplicates: { original: LinkType; duplicates: LinkType[] }[] = [];
    urlMap.forEach((group) => {
        if (group.length > 1) {
            // Keep the oldest one as original
            const sorted = [...group].sort(
                (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            duplicates.push({
                original: sorted[0],
                duplicates: sorted.slice(1),
            });
        }
    });

    return duplicates;
}

function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        // Remove trailing slash, www prefix, and query params for comparison
        const normalized = parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '');
        return normalized.toLowerCase();
    } catch {
        return url.toLowerCase();
    }
}

export async function checkBrokenLinks(
    links: LinkType[],
    onProgress?: (checked: number, total: number) => void
): Promise<{ link: LinkType; status: number | 'error' }[]> {
    const brokenLinks: { link: LinkType; status: number | 'error' }[] = [];
    const batchSize = 5; // Check 5 at a time to avoid overwhelming

    for (let i = 0; i < links.length; i += batchSize) {
        const batch = links.slice(i, i + batchSize);

        const results = await Promise.all(
            batch.map(async (link) => {
                try {
                    // Use our API route to check the link (avoids CORS issues)
                    const response = await fetch('/api/check-link', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: link.original_url }),
                    });

                    const data = await response.json();
                    return { link, status: data.status as number };
                } catch {
                    return { link, status: 'error' as const };
                }
            })
        );

        // Collect broken links (404, 410, or errors)
        results.forEach((result) => {
            if (result.status === 404 || result.status === 410 || result.status === 'error') {
                brokenLinks.push(result);
            }
        });

        onProgress?.(Math.min(i + batchSize, links.length), links.length);

        // Small delay between batches
        if (i + batchSize < links.length) {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }

    return brokenLinks;
}
