'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MasonryGrid from '@/components/MasonryGrid';
import LinkCard from '@/components/LinkCard';
import SearchBar from '@/components/SearchBar';
import TagSidebar from '@/components/TagSidebar';
import AddLinkModal from '@/components/AddLinkModal';
import Header from '@/components/Header';
import { FeatureErrorBoundary } from '@/components/ErrorBoundary';
import { useLinks } from '@/context/LinksContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { Link as LinkType } from '@/types/link';

export default function Dashboard() {
    const {
        filteredLinks,
        allTags,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        selectedMediaType,
        setSelectedMediaType,
        addLink,
        isLoading,
        error,
        refreshLinks,
        clearError,
    } = useLinks();

    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

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

    // Don't render if not authenticated
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background bg-grid">
            {/* Header */}
            <Header
                onAddClick={() => setIsModalOpen(true)}
                searchBar={
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by title or tag..."
                    />
                }
            />

            {/* Main content with sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div data-sidebar>
                        <FeatureErrorBoundary featureName="Tags">
                            <TagSidebar
                                tags={allTags}
                                selectedTag={selectedTag}
                                onSelectTag={setSelectedTag}
                            />
                        </FeatureErrorBoundary>
                    </div>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        {/* Stats bar */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground mb-1">
                                    {selectedTag ? `#${selectedTag}` : 'Your Collection'}
                                </h1>
                                <p className="text-sm text-foreground-muted">
                                    {filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}
                                    {searchQuery && ` matching "${searchQuery}"`}
                                </p>
                            </div>

                            {/* Media type filter */}
                            <div className="flex items-center gap-2">
                                {['all', 'video', 'image', 'article'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedMediaType(type === 'all' ? null : type)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${(type === 'all' && !selectedMediaType) ||
                                                selectedMediaType === type
                                                ? 'bg-primary text-background'
                                                : 'bg-surface-elevated text-foreground-muted hover:text-foreground'
                                            }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear filters */}
                        {(searchQuery || selectedTag || selectedMediaType) && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedTag(null);
                                    setSelectedMediaType(null);
                                }}
                                className="mb-4 text-sm text-primary hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}

                        {/* Loading state */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                            </div>
                        ) : filteredLinks.length > 0 ? (
                            <FeatureErrorBoundary featureName="Links Grid" onReset={refreshLinks}>
                                <MasonryGrid>
                                    {filteredLinks.map((link) => (
                                        <LinkCard key={link._id} link={link} />
                                    ))}
                                </MasonryGrid>
                            </FeatureErrorBoundary>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    No links found
                                </h3>
                                <p className="text-foreground-muted mb-6">
                                    {searchQuery || selectedTag
                                        ? 'Try adjusting your filters'
                                        : 'Start by adding your first link!'}
                                </p>
                                {!searchQuery && !selectedTag && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-medium hover:opacity-90 transition-opacity"
                                    >
                                        + Add Your First Link
                                    </button>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Add Link Modal */}
            <AddLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLink}
            />
        </div>
    );
}
