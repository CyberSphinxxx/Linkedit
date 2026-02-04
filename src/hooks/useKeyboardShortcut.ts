import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutOptions {
    /** Key to trigger the callback (case-insensitive) */
    key: string;
    /** Callback to execute when key is pressed */
    onTrigger: () => void;
    /** Whether the shortcut is enabled */
    enabled?: boolean;
    /** Modifier keys required */
    modifiers?: {
        ctrl?: boolean;
        alt?: boolean;
        shift?: boolean;
        meta?: boolean;
    };
}

/**
 * Hook to register a keyboard shortcut
 */
export function useKeyboardShortcut({
    key,
    onTrigger,
    enabled = true,
    modifiers = {},
}: UseKeyboardShortcutOptions) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Don't trigger if typing in an input, textarea, or contenteditable
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            // Check modifiers
            if (modifiers.ctrl && !e.ctrlKey) return;
            if (modifiers.alt && !e.altKey) return;
            if (modifiers.shift && !e.shiftKey) return;
            if (modifiers.meta && !e.metaKey) return;

            // Check key match (case-insensitive)
            if (e.key.toLowerCase() === key.toLowerCase()) {
                e.preventDefault();
                onTrigger();
            }
        },
        [key, onTrigger, modifiers]
    );

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enabled, handleKeyDown]);
}
