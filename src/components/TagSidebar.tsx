import { useState, useEffect, useMemo } from 'react';
import { Search, Pin, Circle, Hash, GripVertical, ArrowDownAZ, ArrowDown10 } from 'lucide-react';

interface TagSidebarProps {
    tags: { name: string; count: number }[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    onClearTags: () => void;
}

const TAG_COLORS = [
    '', // Default (no color/primary)
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
];

export default function TagSidebar({ tags, selectedTags, onToggleTag, onClearTags }: TagSidebarProps) {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState<'count' | 'name'>('count');
    const [pinnedTags, setPinnedTags] = useState<string[]>([]);
    const [tagColors, setTagColors] = useState<Record<string, string>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('linkedit-tag-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPinnedTags(parsed.pinned || []);
                setTagColors(parsed.colors || {});
            } catch (e) {
                console.error('Failed to parse tag settings', e);
            }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('linkedit-tag-settings', JSON.stringify({ pinned: pinnedTags, colors: tagColors }));
        }
    }, [pinnedTags, tagColors, mounted]);

    const togglePin = (e: React.MouseEvent, tagName: string) => {
        e.stopPropagation();
        setPinnedTags(prev =>
            prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
        );
    };

    const cycleColor = (e: React.MouseEvent, tagName: string) => {
        e.stopPropagation();
        setTagColors(prev => {
            const currentColor = prev[tagName] || '';
            const index = TAG_COLORS.indexOf(currentColor);
            const nextColor = TAG_COLORS[(index + 1) % TAG_COLORS.length];
            return { ...prev, [tagName]: nextColor };
        });
    };

    const processedTags = useMemo(() => {
        // 1. Filter
        const filtered = tags.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

        // 2. Sort
        return filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            // Sort by count (desc), then name (asc) for stability
            return b.count - a.count || a.name.localeCompare(b.name);
        });
    }, [tags, query, sortBy]);

    const { pinned, others } = useMemo(() => {
        const p: typeof tags = [];
        const o: typeof tags = [];
        processedTags.forEach(t => {
            if (pinnedTags.includes(t.name)) {
                p.push(t);
            } else {
                o.push(t);
            }
        });
        return { pinned: p, others: o };
    }, [processedTags, pinnedTags]);

    if (!mounted) return null;

    const renderTagItem = (tag: { name: string; count: number }) => {
        const isSelected = selectedTags.includes(tag.name);
        const isPinned = pinnedTags.includes(tag.name);
        const color = tagColors[tag.name];

        return (
            <button
                key={tag.name}
                onClick={() => onToggleTag(tag.name)}
                className={`group w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-all flex items-center justify-between group ${isSelected
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
                    }`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {/* Color Dot / Hash */}
                    <div
                        role="button"
                        onClick={(e) => cycleColor(e, tag.name)}
                        className={`shrink-0 w-2 h-2 rounded-full transition-colors hover:scale-125 ${color ? '' : 'bg-foreground-muted/30 group-hover:bg-foreground-muted'
                            }`}
                        style={{ backgroundColor: color || undefined }}
                        title="Click to change color"
                    />

                    <span className="truncate font-medium">{tag.name}</span>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100">
                    {/* Pin Action */}
                    <div
                        role="button"
                        onClick={(e) => togglePin(e, tag.name)}
                        className={`p-1 rounded-md hover:bg-background/50 transition-colors ${isPinned ? 'text-primary opacity-100' : 'opacity-0 group-hover:opacity-100 hover:text-foreground'
                            }`}
                        title={isPinned ? "Unpin tag" : "Pin tag"}
                    >
                        <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                    </div>

                    {/* Count */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-surface-elevated'
                        }`}>
                        {tag.count}
                    </span>
                </div>
            </button>
        );
    };

    return (
        <aside className="w-60 flex-shrink-0 hidden lg:flex flex-col gap-4">
            <div className="sticky top-24 space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground">Tags</h3>
                        <span className="text-xs text-foreground-muted bg-surface-elevated px-2 py-0.5 rounded-full">
                            {tags.length}
                        </span>
                    </div>

                    <button
                        onClick={() => setSortBy(prev => prev === 'count' ? 'name' : 'count')}
                        className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                        title={sortBy === 'count' ? "Sort by Name" : "Sort by Count"}
                    >
                        {sortBy === 'count' ? <ArrowDown10 className="w-4 h-4" /> : <ArrowDownAZ className="w-4 h-4" />}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find tag..."
                        className="w-full bg-surface-elevated/50 border border-transparent hover:border-white/5 focus:border-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-foreground placeholder-foreground-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Main List */}
                <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                    {/* All Links - Always top */}
                    <button
                        onClick={onClearTags}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5 mb-2 ${selectedTags.length === 0
                            ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5'
                            : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
                            }`}
                    >
                        <GripVertical className="w-4 h-4 opacity-70" />
                        <span>All Links</span>
                    </button>

                    {/* Pinned Section */}
                    {pinned.length > 0 && (
                        <div className="mb-4">
                            <div className="px-2 mb-1.5 flex items-center gap-2">
                                <Pin className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Pinned</span>
                            </div>
                            <div className="space-y-0.5">
                                {pinned.map(renderTagItem)}
                            </div>
                        </div>
                    )}

                    {/* Others Section */}
                    <div className="space-y-0.5">
                        {others.length > 0 ? (
                            others.map(renderTagItem)
                        ) : (
                            pinned.length === 0 && (
                                <div className="text-center py-8 text-foreground-muted/50 text-xs">
                                    No matching tags found.
                                </div>
                            )
                        )}
                    </div>
                </div>

                {tags.length === 0 && (
                    <div className="p-4 rounded-xl bg-surface-elevated/30 border border-surface-elevated text-center">
                        <p className="text-sm font-medium text-foreground mb-1">No tags yet</p>
                        <p className="text-xs text-foreground-muted">Add tags to save links</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
