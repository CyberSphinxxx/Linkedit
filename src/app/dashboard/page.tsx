'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TagSidebar from '@/components/TagSidebar';
import CollectionSwitcher from '@/components/CollectionSwitcher';
import CollectionsGrid from '@/components/CollectionsGrid';
import MasonryGrid from '@/components/MasonryGrid';
import LinkCard from '@/components/LinkCard';
import LinkListItem from '@/components/LinkListItem';
import FloatingActionButton from '@/components/FloatingActionButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { FeatureErrorBoundary } from '@/components/ErrorBoundary';
import { useLinks } from '@/context/LinksContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useCollections } from '@/context/CollectionsContext';
import { useToast } from '@/components/Toast';
import { LayoutGrid } from 'lucide-react';
import { useDashboardUI } from './hooks/useDashboardUI';
import StatsRow from './components/StatsRow';
import FilterControls from './components/FilterControls';
import EmptyState from './components/EmptyState';
import { Link as LinkType } from '@/types/link';

const AddLinkModal = dynamic(() => import('@/components/AddLinkModal'), { ssr: false });

export default function Dashboard() {
    const {
        links,
        filteredLinks,
        allTags,
        searchQuery,
        setSearchQuery,
        selectedTags,
        setSelectedTags,
        selectedMediaType,
        setSelectedMediaType,
        addLink,
        isLoading,
        error,
        refreshLinks,
        clearError,
        setSelectedCollection,
    } = useLinks();

    const { collections } = useCollections();
    const { loading: authLoading } = useAuth();
    const { settings } = useSettings();
    const { showToast } = useToast();

    const {
        isModalOpen,
        openAddModal,
        closeAddModal,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        showCollectionsGrid,
        setShowCollectionsGrid,
        toggleCollectionsGrid,
        showSortDropdown,
        toggleSortDropdown,
        closeSortDropdown,
        showBackToTop,
        scrollToTop,
    } = useDashboardUI();

    // Compute sorted links
    const sortedLinks = useMemo(() => {
        const sorted = [...filteredLinks];
        switch (sortBy) {
            case 'favorites':
                return sorted.sort((a, b) => {
                    if (a.is_favorite && !b.is_favorite) return -1;
                    if (!a.is_favorite && b.is_favorite) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            case 'alphabetical':
                return sorted.sort((a, b) => (a.metadata.title || '').localeCompare(b.metadata.title || ''));
            case 'newest':
            default:
                return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    }, [filteredLinks, sortBy]);

    // Error handling
    useEffect(() => {
        if (error) {
            showToast(error, 'error');
            clearError();
        }
    }, [error, showToast, clearError]);

    const handleSaveLink = async (link: Omit<LinkType, '_id'>) => {
        try {
            await addLink(link);
            showToast('Link Saved', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save link';
            showToast(message, 'error');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    const patternClasses: Record<string, string> = {
        grid: 'bg-pattern-grid',
        dots: 'bg-pattern-dots',
        cross: 'bg-pattern-cross',
        waves: 'bg-pattern-waves',
        none: '',
    };

    const activePatternClass = patternClasses[settings.backgroundPattern] || '';

    return (
        <div className={`min-h-screen ${activePatternClass}`}>
            <Header
                onAddClick={openAddModal}
                searchBar={
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by title or tag..."
                    />
                }
                actions={
                    <button
                        onClick={toggleCollectionsGrid}
                        className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${showCollectionsGrid
                            ? 'bg-primary/20 text-primary border-primary/20'
                            : 'bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/5 border-transparent hover:border-white/10'
                            }`}
                        title={showCollectionsGrid ? "View Links" : "View Collections"}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden lg:inline">{showCollectionsGrid ? 'Links' : 'Collections'}</span>
                    </button>
                }
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <StatsRow links={links} allTags={allTags} />

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block">
                        <FeatureErrorBoundary featureName="Tags">
                            <TagSidebar
                                tags={allTags}
                                selectedTags={selectedTags}
                                onToggleTag={(tag) => {
                                    if (selectedTags.includes(tag)) {
                                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                                    } else {
                                        setSelectedTags([...selectedTags, tag]);
                                    }
                                }}
                                onClearTags={() => setSelectedTags([])}
                            />
                        </FeatureErrorBoundary>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                                        <h1 className="text-2xl font-bold text-foreground">
                                            {showCollectionsGrid ? 'Your Collections' : 'Your Links'}
                                        </h1>
                                        {!showCollectionsGrid && <CollectionSwitcher className="w-full sm:w-auto" />}
                                    </div>
                                    <p className="text-sm text-foreground-muted">
                                        {showCollectionsGrid
                                            ? `${collections.length} collection${collections.length !== 1 ? 's' : ''}`
                                            : `${filteredLinks.length} link${filteredLinks.length !== 1 ? 's' : ''}`
                                        }
                                        {!showCollectionsGrid && searchQuery && ` matching "${searchQuery}"`}
                                    </p>
                                </div>

                                {!showCollectionsGrid && (
                                    <FilterControls
                                        selectedMediaType={selectedMediaType}
                                        setSelectedMediaType={setSelectedMediaType}
                                        viewMode={viewMode}
                                        setViewMode={setViewMode}
                                        sortBy={sortBy}
                                        setSortBy={setSortBy}
                                        showSortDropdown={showSortDropdown}
                                        setShowSortDropdown={toggleSortDropdown}
                                        toggleSortDropdown={toggleSortDropdown}
                                        closeSortDropdown={closeSortDropdown}
                                    />
                                )}
                            </div>

                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors text-xs font-medium group ring-1 ring-primary/20"
                                        >
                                            <span>#{tag}</span>
                                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {(searchQuery || selectedTags.length > 0 || selectedMediaType) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedTags([]);
                                        setSelectedMediaType(null);
                                    }}
                                    className="mb-4 text-sm text-primary hover:underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                            </div>
                        ) : showCollectionsGrid ? (
                            <FeatureErrorBoundary featureName="Collections Grid">
                                <CollectionsGrid
                                    collections={collections}
                                    onSelectCollection={(id) => {
                                        setSelectedCollection(id);
                                        setShowCollectionsGrid(false);
                                    }}
                                />
                            </FeatureErrorBoundary>
                        ) : sortedLinks.length > 0 ? (
                            <FeatureErrorBoundary featureName="Links Grid" onReset={refreshLinks}>
                                {viewMode === 'grid' ? (
                                    <MasonryGrid>
                                        {sortedLinks.map((link) => (
                                            <LinkCard key={link._id} link={link} />
                                        ))}
                                    </MasonryGrid>
                                ) : (
                                    <div className="space-y-2">
                                        {sortedLinks.map((link) => (
                                            <LinkListItem key={link._id} link={link} />
                                        ))}
                                    </div>
                                )}
                            </FeatureErrorBoundary>
                        ) : (
                            <EmptyState
                                searchQuery={searchQuery}
                                selectedTags={selectedTags}
                                onAddClick={openAddModal}
                            />
                        )}
                    </main>
                </div>
            </div >

            <ScrollToTopButton show={showBackToTop} onClick={scrollToTop} />

            {settings.showFloatingAddButton && (
                <FloatingActionButton
                    onClick={openAddModal}
                    label="Add Link"
                    shortcutHint="N"
                />
            )}

            {isModalOpen && (
                <AddLinkModal
                    isOpen={isModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveLink}
                />
            )}
        </div>
    );
}
