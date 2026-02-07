'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode,
} from 'react';
import { Link as LinkType } from '@/types/link';
import { useAuth } from './AuthContext';
import * as firestoreService from '@/lib/firestore';
import * as localStorageService from '@/lib/localStorage';

interface LinksContextType {
    links: LinkType[];
    filteredLinks: LinkType[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
    selectedMediaType: string | null;
    setSelectedMediaType: (type: string | null) => void;
    selectedCollection: string | null;
    setSelectedCollection: (collection: string | null) => void;
    allTags: { name: string; count: number }[];
    addLink: (link: Omit<LinkType, '_id'>) => Promise<void>;
    updateLink: (id: string, updates: Partial<LinkType>) => Promise<void>;
    removeLink: (id: string) => Promise<void>;
    toggleFavorite: (id: string) => Promise<void>;
    refreshLinks: () => Promise<void>;
    clearError: () => void;
}

const LinksContext = createContext<LinksContextType | null>(null);

export function LinksProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [links, setLinks] = useState<LinkType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [allTags, setAllTags] = useState<{ name: string; count: number }[]>([]);

    // Clear error
    const clearError = useCallback(() => setError(null), []);

    // Helper to determine service
    const getService = useCallback(() => {
        return user ? firestoreService : localStorageService;
    }, [user]);

    // Fetch links when user changes - wrapped in useCallback
    const refreshLinks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (user) {
                // Check for local data to migrate when user signs in
                const localLinks = localStorageService.getLinks();

                if (localLinks.length > 0) {
                    console.log(`[LinksContext] Migrating ${localLinks.length} local links to Firebase...`);

                    // Migrate each local link to Firestore
                    let migrated = 0;
                    for (const link of localLinks) {
                        try {
                            // Remove _id to let Firestore generate a new one
                            const { _id, ...linkData } = link;
                            await firestoreService.addLink(user.uid, linkData);
                            migrated++;
                        } catch (err) {
                            // Skip duplicates or errors, continue with next link
                            console.warn(`[LinksContext] Failed to migrate link: ${link.original_url}`, err);
                        }
                    }

                    // Clear localStorage after successful migration
                    if (migrated > 0) {
                        localStorage.removeItem('linkedit_local_links');
                        console.log(`[LinksContext] Successfully migrated ${migrated} links. Local storage cleared.`);
                    }
                }

                // Fetch all links from Firestore (includes migrated data)
                const userLinks = await firestoreService.getLinks(user.uid);
                setLinks(userLinks);
            } else {
                // Local storage for guests
                const localLinks = localStorageService.getLinks();
                setLinks(localLinks);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load links';
            setError(message);
            console.error('Error fetching links:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshLinks();
        // Reset filters on auth change? Maybe not needed, but good practice
        setSelectedCollection(null);
    }, [refreshLinks]);

    // Recalculate tags whenever links change
    useEffect(() => {
        const tagCounts: Record<string, number> = {};
        links.forEach((link) => {
            link.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        const tags = Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        setAllTags(tags);
    }, [links]);


    // Add a new link - wrapped in useCallback
    const addLink = useCallback(async (link: Omit<LinkType, '_id'>) => {
        try {
            if (user) {
                const newId = await firestoreService.addLink(user.uid, link);
                const newLink: LinkType = { ...link, _id: newId };
                setLinks((prev) => [newLink, ...prev]);
            } else {
                const newId = localStorageService.addLink(link);
                // localStorageService.addLink returns the ID, but also updates storage.
                // We need to update state to reflect change immediately without refetch
                // But wait, localStorageService.addLink already creates the object with ID and Date.
                // We should construct it here similarly for optimistic update, or just refetch?
                // Since it's local, refetch is cheap, but state update is smoother.
                // Let's manually construct for state update to allow animation/immediate feedback.

                const newLink: LinkType = {
                    ...link,
                    _id: newId,
                    created_at: new Date()
                };
                setLinks((prev) => [newLink, ...prev]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add link';
            console.error('Error adding link:', err);
            throw new Error(message);
        }
    }, [user]);

    // Remove a link - wrapped in useCallback
    const removeLink = useCallback(async (id: string) => {
        try {
            if (user) {
                await firestoreService.deleteLink(user.uid, id);
            } else {
                localStorageService.deleteLink(id);
            }
            setLinks((prev) => prev.filter((link) => link._id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to remove link';
            console.error('Error removing link:', err);
            throw new Error(message);
        }
    }, [user]);

    // Update a link - wrapped in useCallback
    const updateLink = useCallback(async (id: string, updates: Partial<LinkType>) => {
        try {
            if (user) {
                await firestoreService.updateLink(user.uid, id, updates);
            } else {
                localStorageService.updateLink(id, updates);
            }
            setLinks((prev) =>
                prev.map((link) =>
                    link._id === id ? { ...link, ...updates } : link
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update link';
            console.error('Error updating link:', err);
            throw new Error(message);
        }
    }, [user]);

    // Toggle favorite - wrapped in useCallback
    const toggleFavorite = useCallback(async (id: string) => {
        let currentIsFavorite = false;
        setLinks((prev) => {
            const link = prev.find((l) => l._id === id);
            if (link) currentIsFavorite = link.is_favorite;
            return prev;
        });

        try {
            if (user) {
                await firestoreService.toggleFavorite(user.uid, id, currentIsFavorite);
            } else {
                localStorageService.toggleFavorite(id, currentIsFavorite);
            }

            setLinks((prev) =>
                prev.map((l) =>
                    l._id === id ? { ...l, is_favorite: !l.is_favorite } : l
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to toggle favorite';
            console.error('Error toggling favorite:', err);
            throw new Error(message);
        }
    }, [user]);

    // Filter links based on search, tag, and media type
    const filteredLinks = useMemo(() => {
        return links.filter((link) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = link.metadata.title?.toLowerCase().includes(query);
                const matchesTags = link.tags.some((tag) =>
                    tag.toLowerCase().includes(query)
                );
                if (!matchesTitle && !matchesTags) return false;
            }

            // Tag filter (OR match)
            if (selectedTags.length > 0) {
                const hasMatchingTag = link.tags.some((tag) => selectedTags.includes(tag));
                if (!hasMatchingTag) return false;
            }

            // Media type filter
            if (selectedMediaType && link.media_type !== selectedMediaType) {
                return false;
            }

            // Collection filter
            if (selectedCollection) {
                const linkCollection = link.collection || 'default_0';
                if (linkCollection !== selectedCollection) return false;
            }

            return true;
        });
    }, [links, searchQuery, selectedTags, selectedMediaType, selectedCollection]);

    // Memoize context value
    const contextValue = useMemo(() => ({
        links,
        filteredLinks,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedTags,
        setSelectedTags,
        selectedMediaType,
        setSelectedMediaType,
        selectedCollection,
        setSelectedCollection,
        allTags,
        addLink,
        updateLink,
        removeLink,
        toggleFavorite,
        refreshLinks,
        clearError,
    }), [
        links,
        filteredLinks,
        isLoading,
        error,
        searchQuery,
        selectedTags,
        selectedMediaType,
        selectedCollection,
        allTags,
        addLink,
        updateLink,
        removeLink,
        toggleFavorite,
        refreshLinks,
        clearError,
    ]);

    return (
        <LinksContext.Provider value={contextValue}>
            {children}
        </LinksContext.Provider>
    );
}

export function useLinks() {
    const context = useContext(LinksContext);
    if (!context) {
        throw new Error('useLinks must be used within a LinksProvider');
    }
    return context;
}
