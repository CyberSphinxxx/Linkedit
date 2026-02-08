'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MasonryGrid from '@/components/MasonryGrid';
import LinkCard from '@/components/LinkCard';
import LinkListItem from '@/components/LinkListItem';
import SearchBar from '@/components/SearchBar';
import TagSidebar from '@/components/TagSidebar';
import dynamic from 'next/dynamic';
const AddLinkModal = dynamic(() => import('@/components/AddLinkModal'), { ssr: false });
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import AddLinkArea from '@/components/AddLinkArea';
import FloatingActionButton from '@/components/FloatingActionButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { FeatureErrorBoundary } from '@/components/ErrorBoundary';
import { useLinks } from '@/context/LinksContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/components/Toast';
import { useKeyboardShortcut } from '@/hooks';
import { Link as LinkType } from '@/types/link';
import CollectionSwitcher from '@/components/CollectionSwitcher';
import CollectionsGrid from '@/components/CollectionsGrid';
import { useCollections } from '@/context/CollectionsContext';
import { Link2, Video, Image, Grid3X3, List, ArrowUpDown, Sparkles, Search, Hash, LayoutGrid } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'favorites';
type ViewMode = 'grid' | 'list';

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
    const { user, loading: authLoading } = useAuth();
    const { settings } = useSettings();
    const router = useRouter();
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [viewMode, setViewMode] = useState<ViewMode>(settings.defaultView);
    const [showCollectionsGrid, setShowCollectionsGrid] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Default to list view on mobile
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setViewMode('list');
        }
    }, []);

    // Back to top scroll logic
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Open modal function
    const openAddModal = useCallback(() => setIsModalOpen(true), []);

    // Keyboard shortcut: Press 'N' to open add modal
    useKeyboardShortcut({
        key: 'n',
        onTrigger: openAddModal,
    });

    // Compute stats
    const stats = useMemo(() => {
        const videos = links.filter(l => l.media_type === 'video').length;
        const images = links.filter(l => l.media_type === 'image').length;
        const articles = links.filter(l => l.media_type === 'article').length;
        return { total: links.length, videos, images, articles };
    }, [links]);

    // Sort filtered links
    const sortedLinks = useMemo(() => {
        const sorted = [...filteredLinks];
        switch (sortBy) {
            case 'favorites':
                // Favorites first, then by newest
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

    // Redirect if not logged in - REMOVED for Guest Mode
    /*
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);
    */

    // Show error toast when links fail to load
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

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    // Don't render if not authenticated - REMOVED for Guest Mode
    // if (!user) {
    //     return null;
    // }

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
            {/* Header */}
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
                        onClick={() => setShowCollectionsGrid(!showCollectionsGrid)}
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

            {/* Main content with sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">


                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        icon={<Link2 size={20} strokeWidth={2.5} />}
                        label="Total Links"
                        value={stats.total}
                        color="primary"
                        delay={0}
                    />
                    {allTags
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3)
                        .map((tag, index) => (
                            <StatsCard
                                key={tag.name}
                                icon={<Hash size={20} strokeWidth={2.5} />}
                                label={tag.name}
                                value={tag.count}
                                color={index === 0 ? 'accent' : index === 1 ? 'success' : 'warning'}
                                delay={0.1 * (index + 1)}
                            />
                        ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Hidden on mobile/tablet */}
                    <div data-sidebar className="hidden lg:block">
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
                    </div>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        {/* Content header area */}
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                {/* Title & Collection Switcher */}
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

                                {/* Filters & Controls */}
                                <div className="relative z-30 flex flex-wrap items-center gap-2 sm:gap-3">
                                    {/* Collections toggle moved to header */}

                                    {!showCollectionsGrid && (
                                        <>
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

                                            {/* Divider */}
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
                                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-elevated/50 border border-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                                                    >
                                                        <ArrowUpDown className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">
                                                            {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'favorites' ? 'Favorites' : 'A-Z'}
                                                        </span>
                                                    </button>
                                                    {showSortDropdown && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                                                            <div className="absolute right-0 top-full mt-2 p-1 bg-surface border border-surface-elevated rounded-xl shadow-xl z-20 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                                                                {[
                                                                    { value: 'favorites', label: 'Favorites First' },
                                                                    { value: 'newest', label: 'Newest First' },
                                                                    { value: 'oldest', label: 'Oldest First' },
                                                                    { value: 'alphabetical', label: 'Alphabetical' },
                                                                ].map((option) => (
                                                                    <button
                                                                        key={option.value}
                                                                        onClick={() => { setSortBy(option.value as SortOption); setShowSortDropdown(false); }}
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
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Active Tags Row */}
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

                            {/* Clear filters */}
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

                            {/* Loading state */}
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
                            /* Improved Empty State */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-20"
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-2xl opacity-40" />
                                    <div className="relative w-20 h-20 rounded-2xl bg-surface-elevated border border-white/5 flex items-center justify-center shadow-2xl">
                                        {searchQuery || selectedTags.length > 0 ? (
                                            <Search className="w-10 h-10 text-foreground-muted" strokeWidth={1.5} />
                                        ) : (
                                            <Sparkles className="w-10 h-10 text-primary" strokeWidth={1.5} />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    {searchQuery || selectedTags.length > 0 ? 'No links found' : 'Start Building Your Collection'}
                                </h3>
                                <p className="text-foreground-muted mb-8 max-w-md mx-auto leading-relaxed">
                                    {searchQuery || selectedTags.length > 0
                                        ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                                        : 'Save videos, images, and links from across the web. Your personal archive awaits!'}
                                </p>

                                {!searchQuery && selectedTags.length === 0 && (
                                    <>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 flex items-center gap-2 mx-auto"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Your First Link
                                        </button>

                                        {/* Quick Tips */}
                                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
                                            {[
                                                { icon: Video, title: 'Videos', desc: 'YouTube, Vimeo, TikTok' },
                                                { icon: Image, title: 'Images', desc: 'Direct links, galleries' },
                                                { icon: Link2, title: 'Links', desc: 'Blogs, documentation, news' },
                                            ].map((tip, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                    className="p-5 rounded-2xl bg-surface-elevated/30 border border-white/5 hover:bg-surface-elevated/50 hover:border-white/10 transition-all group text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                                        <tip.icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <h4 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h4>
                                                    <p className="text-xs text-foreground-muted">{tip.desc}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div >

            {/* Mobile Navigation Controls */}
            <ScrollToTopButton show={showBackToTop} onClick={scrollToTop} />

            {/* Floating Action Button - Visible if enabled in settings */}
            {settings.showFloatingAddButton && (
                <FloatingActionButton
                    onClick={openAddModal}
                    label="Add Link"
                    shortcutHint="N"
                />
            )}

            {/* Add Link Modal */}
            {isModalOpen && (
                <AddLinkModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveLink}
                />
            )}
        </div>
    );
}
