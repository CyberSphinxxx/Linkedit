'use client';

interface TagSidebarProps {
    tags: { name: string; count: number }[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export default function TagSidebar({ tags, selectedTag, onSelectTag }: TagSidebarProps) {
    return (
        <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-foreground mb-3">Tags</h3>

                {/* All links button */}
                <button
                    onClick={() => onSelectTag(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${!selectedTag
                            ? 'bg-primary/20 text-primary'
                            : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
                        }`}
                >
                    All Links
                </button>

                {/* Tag list */}
                <div className="space-y-0.5 mt-2">
                    {tags.map((tag) => (
                        <button
                            key={tag.name}
                            onClick={() => onSelectTag(selectedTag === tag.name ? null : tag.name)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedTag === tag.name
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
                                }`}
                        >
                            <span>#{tag.name}</span>
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${selectedTag === tag.name
                                        ? 'bg-primary/30 text-primary'
                                        : 'bg-surface-elevated text-foreground-muted'
                                    }`}
                            >
                                {tag.count}
                            </span>
                        </button>
                    ))}
                </div>

                {tags.length === 0 && (
                    <p className="text-sm text-foreground-muted px-3 py-2">No tags yet</p>
                )}
            </div>
        </aside>
    );
}
