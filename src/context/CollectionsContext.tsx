'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { Collection, DEFAULT_COLLECTIONS } from '@/types/collection';
import { useAuth } from './AuthContext';


import * as firestoreService from '@/lib/firestore';

interface CollectionsContextType {
    collections: Collection[];
    isLoading: boolean;
    addCollection: (name: string, icon?: string, color?: string) => Promise<Collection>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    removeCollection: (id: string) => Promise<void>;
    getCollection: (id: string) => Collection | undefined;
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

const STORAGE_KEY = 'linkedit_collections';

export function CollectionsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch collections from Firestore
    const refreshCollections = useCallback(async () => {
        if (!user) {
            setCollections([]);
            setIsLoading(false);
            return;
        }

        try {
            const fetched = await firestoreService.getCollections(user.uid);

            // Check for migration needed
            // If we have 0 collections in Firestore, check LocalStorage
            if (fetched.length === 0) {
                const stored = localStorage.getItem(`${STORAGE_KEY}_${user.uid}`);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        const migratedCollections: Collection[] = [];

                        // Migrate each local collection to Firestore
                        for (const col of parsed) {
                            // Use existing ID to preserve link references
                            // Ensure date strings are converted back to Dates for the object we use locally,
                            // though firestoreService handles wrapping it for Firestore.
                            const collectionToSave = {
                                ...col,
                                created_at: new Date(col.created_at)
                            };

                            await firestoreService.addCollection(user.uid, collectionToSave, col._id);
                            migratedCollections.push(collectionToSave);
                        }

                        // If no local collections (empty array), create default
                        if (migratedCollections.length === 0) {
                            const defaults = DEFAULT_COLLECTIONS.map(c => ({
                                ...c,
                                _id: 'default_0', // or generate one? default_0 is used by app logic
                                created_at: new Date(),
                            }));
                            for (const d of defaults) {
                                await firestoreService.addCollection(user.uid, d, d._id);
                            }
                            setCollections(defaults);
                        } else {
                            setCollections(migratedCollections);
                        }

                        // Clear local storage after successful migration ??
                        // Maybe keep it as backup for now, safe to ignore.
                    } catch (err) {
                        console.error("Migration failed", err);
                        // Fallback to defaults
                        const defaults = DEFAULT_COLLECTIONS.map(c => ({ ...c, _id: 'default_0', created_at: new Date() }));
                        setCollections(defaults); // Optimistic
                    }
                } else {
                    // No local storage, just create default
                    const defaults = DEFAULT_COLLECTIONS.map(c => ({
                        ...c,
                        _id: 'default_0',
                        created_at: new Date(),
                    }));
                    // Check if default exists? No, fetched was 0.
                    for (const d of defaults) {
                        await firestoreService.addCollection(user.uid, d, d._id);
                    }
                    setCollections(defaults);
                }
            } else {
                setCollections(fetched);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshCollections();
    }, [refreshCollections]);

    // Add a new collection
    const addCollection = useCallback(async (
        name: string,
        icon?: string,
        color?: string
    ): Promise<Collection> => {
        if (!user) throw new Error('User not authenticated');

        const newCollection: Collection = {
            _id: `col_${Date.now()}`, // Generate client-side ID or let Firestore generate? 
            // We use `col_` prefix in app. Let's stick to generating it here so we can return it immediately.
            // Or let `addCollection` generate it if we don't pass one. 
            // `firestoreService.addCollection` returns the ID.
            // Let's rely on `firestoreService` to handle the saving.
            // But we need to construct the object.
            name,
            icon: icon || 'folder',
            color,
            created_at: new Date(),
        } as Collection; // Cast because _id is missing initially if we want Firestore to generate

        // Actually, if we want Firestore to generate, we pass it without _id.
        // But our `addCollection` in firestore.ts handles it.
        // Let's let Firestore generate the ID.

        // Wait, context expects Promise<Collection>.
        // I need the ID.

        const id = await firestoreService.addCollection(user.uid, newCollection); // Returns ID
        const finalCollection = { ...newCollection, _id: id };

        setCollections((prev) => [...prev, finalCollection]);
        return finalCollection;
    }, [user]);

    // Update a collection
    const updateCollection = useCallback(async (
        id: string,
        updates: Partial<Collection>
    ) => {
        if (!user) return;

        // Optimistic update
        setCollections((prev) =>
            prev.map((c) => (c._id === id ? { ...c, ...updates } : c))
        );

        await firestoreService.updateCollection(user.uid, id, updates);
    }, [user]);

    // Remove a collection
    const removeCollection = useCallback(async (id: string) => {
        if (!user) return;
        if (id === 'default_0') return; // Protect default

        // Optimistic update
        setCollections((prev) => prev.filter((c) => c._id !== id));

        await firestoreService.deleteCollection(user.uid, id);
    }, [user]);

    // Get a collection by ID
    const getCollection = useCallback((id: string) => {
        return collections.find((c) => c._id === id);
    }, [collections]);

    return (
        <CollectionsContext.Provider
            value={{
                collections,
                isLoading,
                addCollection,
                updateCollection,
                removeCollection,
                getCollection,
            }}
        >
            {children}
        </CollectionsContext.Provider>
    );
}

export function useCollections() {
    const context = useContext(CollectionsContext);
    if (!context) {
        throw new Error('useCollections must be used within a CollectionsProvider');
    }
    return context;
}
