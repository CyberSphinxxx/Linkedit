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
        <div className="relative w-full max-w-md group">
            {/* Search icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted group-hover:text-foreground group-focus-within:text-primary transition-colors duration-300">
                <svg
                    className="w-5 h-5"
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
                className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-surface-elevated/50 border border-white/5 group-hover:border-white/10 text-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:bg-surface-elevated focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_15px_-3px_rgba(68,214,44,0.15)] transition-all duration-300"
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-foreground-muted hover:text-foreground hover:bg-white/10 rounded-full transition-all duration-200"
                    aria-label="Clear search"
                >
                    <svg
                        className="w-4 h-4"
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
            )}
        </div>
    );
}
