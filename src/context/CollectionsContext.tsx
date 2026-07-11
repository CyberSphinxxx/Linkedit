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
    refreshCollections: () => Promise<void>;
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
            // Guest mode: load from localStorage
            try {
                const stored = localStorage.getItem('linkedit_local_collections');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const collections = parsed.map((col: any) => ({
                        ...col,
                        created_at: new Date(col.created_at)
                    }));
                    setCollections(collections);
                } else {
                    setCollections([]);
                }
            } catch {
                setCollections([]);
            }
            setIsLoading(false);
            return;
        }

        try {
            // Check for GUEST local data to migrate (linkedit_local_collections, no user ID)
            const guestStorageKey = 'linkedit_local_collections';
            const guestStored = localStorage.getItem(guestStorageKey);

            if (guestStored) {
                try {
                    const parsed = JSON.parse(guestStored);
                    if (parsed.length > 0) {
                        console.log(`[CollectionsContext] Migrating ${parsed.length} local collections to Firebase...`);

                        let migrated = 0;
                        for (const col of parsed) {
                            try {
                                const collectionToSave = {
                                    ...col,
                                    created_at: new Date(col.created_at)
                                };
                                const sanitizedCollection = removeUndefined(collectionToSave);
                                await firestoreService.addCollection(user.uid, sanitizedCollection as unknown as Collection, col._id);
                                migrated++;
                            } catch (err) {
                                console.warn(`[CollectionsContext] Failed to migrate collection: ${col.name}`, err);
                            }
                        }

                        if (migrated > 0) {
                            localStorage.removeItem(guestStorageKey);
                            console.log(`[CollectionsContext] Successfully migrated ${migrated} collections. Local storage cleared.`);
                        }
                    }
                } catch (err) {
                    console.error("[CollectionsContext] Guest data migration failed", err);
                }
            }

            // Check for user-specific localStorage (legacy migration)
            const userStorageKey = `${STORAGE_KEY}_${user.uid}`;
            const fetched = await firestoreService.getCollections(user.uid);

            if (fetched.length === 0) {
                const stored = localStorage.getItem(userStorageKey);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        const migratedCollections: Collection[] = [];

                        for (const col of parsed) {
                            const collectionToSave = {
                                ...col,
                                created_at: new Date(col.created_at)
                            };
                            const sanitizedCollection = removeUndefined(collectionToSave);
                            await firestoreService.addCollection(user.uid, sanitizedCollection as unknown as Collection, col._id);
                            migratedCollections.push(collectionToSave);
                        }

                        if (migratedCollections.length === 0) {
                            const defaults = DEFAULT_COLLECTIONS.map(c => ({
                                ...c,
                                _id: 'default_0',
                                created_at: new Date(),
                            }));
                            for (const d of defaults) {
                                await firestoreService.addCollection(user.uid, d, d._id);
                            }
                            setCollections(defaults);
                        } else {
                            setCollections(migratedCollections);
                        }

                        // Clear legacy storage after migration
                        localStorage.removeItem(userStorageKey);
                    } catch (err) {
                        console.error("Migration failed", err);
                        const defaults = DEFAULT_COLLECTIONS.map(c => ({ ...c, _id: 'default_0', created_at: new Date() }));
                        setCollections(defaults);
                    }
                } else {
                    const defaults = DEFAULT_COLLECTIONS.map(c => ({
                        ...c,
                        _id: 'default_0',
                        created_at: new Date(),
                    }));
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
            ...(color ? { color } : {}),
            created_at: new Date(),
        } as Collection; // Cast because _id is missing initially if we want Firestore to generate

        // Actually, if we want Firestore to generate, we pass it without _id.
        // But our `addCollection` in firestore.ts handles it.
        // Let's let Firestore generate the ID.

        // Wait, context expects Promise<Collection>.
        // I need the ID.

        const id = await firestoreService.addCollection(user.uid, newCollection, newCollection._id); // Pass generated ID
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

        // Remove undefined values
        const sanitizedUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined)
        );

        const oldCollectionState = collections.find((c) => c._id === id);

        try {
            await firestoreService.updateCollection(user.uid, id, sanitizedUpdates);
        } catch (error) {
            console.error('Failed to update collection:', error);
            if (oldCollectionState) {
                setCollections((prev) =>
                    prev.map((c) => (c._id === id ? oldCollectionState : c))
                );
            }
            throw error;
        }
    }, [user, collections]);

    // Cleanup helper for migration - defined outside or inline
    const removeUndefined = (obj: any) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined)
        );
    };

    // Remove a collection
    const removeCollection = useCallback(async (id: string) => {
        if (!user) return;
        if (id === 'default_0') return; // Protect default

        const collectionToRestore = collections.find((c) => c._id === id);

        // Optimistic update
        setCollections((prev) => prev.filter((c) => c._id !== id));

        try {
            await firestoreService.deleteCollection(user.uid, id);
        } catch (error) {
            console.error('Failed to delete collection:', error);
            if (collectionToRestore) {
                setCollections((prev) => [...prev, collectionToRestore]);
            }
            throw error;
        }
    }, [user, collections]);

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
                refreshCollections,
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
