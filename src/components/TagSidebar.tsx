'use client';

interface TagSidebarProps {
    tags: { name: string; count: number }[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    onClearTags: () => void;
}

export default function TagSidebar({ tags, selectedTags, onToggleTag, onClearTags }: TagSidebarProps) {
    return (
        <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-foreground mb-3">Tags</h3>

                {/* All links button */}
                <button
                    onClick={onClearTags}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${selectedTags.length === 0
                        ? 'bg-primary/20 text-primary'
                        : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
                        }`}
                >
                    All Links
                </button>

                {/* Tag list */}
                <div className="space-y-0.5 mt-2">
                    {tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.name);
                        return (
                            <button
                                key={tag.name}
                                onClick={() => onToggleTag(tag.name)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${isSelected
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
                                    }`}
                            >
                                <span>#{tag.name}</span>
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected
                                        ? 'bg-primary/30 text-primary'
                                        : 'bg-surface-elevated text-foreground-muted'
                                        }`}
                                >
                                    {tag.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {tags.length === 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-surface-elevated/30 border border-surface-elevated text-center">
                        <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">No tags yet</p>
                        <p className="text-xs text-foreground-muted">Add tags when saving links to organize your collection</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
