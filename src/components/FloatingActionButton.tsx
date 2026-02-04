import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface FloatingActionButtonProps {
    onClick: () => void;
    label?: string;
    shortcutHint?: string;
}

export default function FloatingActionButton({
    onClick,
    label = 'Add Link',
    shortcutHint = 'N',
}: FloatingActionButtonProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    // Use portal to render at document body to avoid containing block issues
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] print:hidden">
            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-surface border border-surface-elevated rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{label}</span>
                        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-surface-elevated text-foreground-muted rounded">
                            {shortcutHint}
                        </kbd>
                    </div>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-background shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label={label}
            >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />

                {/* Icon */}
                <Plus size={28} className="relative z-10" strokeWidth={2.5} />
            </button>
        </div>,
        document.body
    );
}
