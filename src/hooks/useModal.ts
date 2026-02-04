'use client';

import { useEffect, useCallback } from 'react';

interface UseModalOptions {
    isOpen: boolean;
    onClose: () => void;
    closeOnEscape?: boolean;
    lockScroll?: boolean;
}

/**
 * Hook to handle common modal behaviors:
 * - Escape key to close
 * - Body scroll locking
 * - Cleanup on unmount
 */
export function useModal({
    isOpen,
    onClose,
    closeOnEscape = true,
    lockScroll = true,
}: UseModalOptions) {
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        },
        [onClose, closeOnEscape]
    );

    useEffect(() => {
        if (!isOpen) return;

        // Add escape key listener
        if (closeOnEscape) {
            document.addEventListener('keydown', handleEscape);
        }

        // Lock body scroll
        if (lockScroll) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = originalOverflow || '';
            };
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, handleEscape, closeOnEscape, lockScroll]);

    return { isOpen };
}
