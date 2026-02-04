'use client';

import { useCallback } from 'react';
import { useLinks } from '@/context/LinksContext';
import { useToast } from '@/components/Toast';
import { Link as LinkType } from '@/types/link';

/**
 * Hook that consolidates common link actions
 * Used by LinkCard, LinkListItem, and other link-displaying components
 */
export function useLinkActions() {
    const { toggleFavorite, removeLink, updateLink } = useLinks();
    const { showToast } = useToast();

    const handleToggleFavorite = useCallback(async (link: LinkType) => {
        try {
            await toggleFavorite(link._id);
            showToast(
                link.is_favorite ? 'Removed from favorites' : 'Added to favorites',
                'success'
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to toggle favorite';
            showToast(message, 'error');
        }
    }, [toggleFavorite, showToast]);

    const handleDelete = useCallback(async (link: LinkType) => {
        try {
            await removeLink(link._id);
            showToast('Link deleted', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete link';
            showToast(message, 'error');
        }
    }, [removeLink, showToast]);

    const handleCopyUrl = useCallback(async (link: LinkType) => {
        try {
            await navigator.clipboard.writeText(link.original_url);
            showToast('URL copied to clipboard', 'success');
        } catch {
            showToast('Failed to copy URL', 'error');
        }
    }, [showToast]);

    const handleUpdateNote = useCallback(async (linkId: string, note: string) => {
        try {
            await updateLink(linkId, { note });
            showToast('Note saved', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save note';
            showToast(message, 'error');
        }
    }, [updateLink, showToast]);

    return {
        handleToggleFavorite,
        handleDelete,
        handleCopyUrl,
        handleUpdateNote,
    };
}
