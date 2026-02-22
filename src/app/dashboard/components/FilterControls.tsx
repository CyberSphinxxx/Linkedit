'use client';

import { ArrowUpDown, Grid3X3, List } from 'lucide-react';
import { SortOption, ViewMode } from '../hooks/useDashboardUI';

interface FilterControlsProps {
    selectedMediaType: string | null;
    setSelectedMediaType: (type: string | null) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    showSortDropdown: boolean;
    setShowSortDropdown: (show: boolean) => void;
    toggleSortDropdown: () => void;
    closeSortDropdown: () => void;
}

export default function FilterControls({
    selectedMediaType,
    setSelectedMediaType,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    showSortDropdown,
    setShowSortDropdown,
    toggleSortDropdown,
    closeSortDropdown,
}: FilterControlsProps) {
    return (
        <div className="relative z-30 flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Media type filter */}
            <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-surface-elevated/50 border border-surface-elevated overflow-x-auto scrollbar-hide">
                {['all', 'video', 'image', 'article'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedMediaType(type === 'all' ? null : type)}
                        className={`px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${(type === 'all' && !selectedMediaType) || selectedMediaType === type
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
                            }`}
                    >
                        {type === 'all' ? 'All' : type === 'article' ? 'Links' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                    </button>
                ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-2">
                {/* View Mode Toggle (Grid/List) */}
                <div className="flex items-center p-1 rounded-lg bg-surface-elevated/50 border border-surface-elevated">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-foreground-muted hover:text-foreground'
                            }`}
                        title="Grid view"
                    >
                        <Grid3X3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-foreground-muted hover:text-foreground'
                            }`}
                        title="List view"
                    >
                        <List className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="h-6 w-px bg-surface-elevated hidden sm:block" />

                {/* Sort dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleSortDropdown}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-elevated/50 border border-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                            {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'favorites' ? 'Favorites' : 'A-Z'}
                        </span>
                    </button>
                    {showSortDropdown && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={closeSortDropdown} />
                            <div className="absolute right-0 top-full mt-2 p-1 bg-surface border border-surface-elevated rounded-xl shadow-xl z-20 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                                {[
                                    { value: 'favorites', label: 'Favorites First' },
                                    { value: 'newest', label: 'Newest First' },
                                    { value: 'oldest', label: 'Oldest First' },
                                    { value: 'alphabetical', label: 'Alphabetical' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setSortBy(option.value as SortOption); closeSortDropdown(); }}
                                        className={`w-full px-3 py-2 text-xs text-left transition-colors flex items-center gap-2 rounded-lg ${sortBy === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
                                            }`}
                                    >
                                        {sortBy === option.value && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
