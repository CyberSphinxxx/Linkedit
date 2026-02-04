'use client';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search links...',
}: SearchBarProps) {
    return (
        <div className="relative w-full max-w-md">
            {/* Search icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className="w-5 h-5 text-foreground-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface border border-surface-elevated text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary/50 transition-colors"
            />

            {/* Keyboard shortcut hint or Clear button */}
            {value ? (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-elevated rounded-full transition-colors"
                >
                    <svg
                        className="w-4 h-4 text-foreground-muted hover:text-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            ) : (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1">
                    <span className="text-[10px] text-foreground-muted/50">Search</span>
                </div>
            )}
        </div>
    );
}
