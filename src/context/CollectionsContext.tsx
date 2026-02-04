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

    // Initialize with default collections
    const initializeDefaults = () => {
        const defaults: Collection[] = DEFAULT_COLLECTIONS.map((c, i) => ({
            ...c,
            _id: 'default_0', // Ensure consistent ID for default
            created_at: new Date(),
        }));
        setCollections(defaults);
        if (user) {
            localStorage.setItem(`${STORAGE_KEY}_${user.uid}`, JSON.stringify(defaults));
        }
    };

    // Load collections from localStorage (later can migrate to Firestore)
    useEffect(() => {
        if (!user) {
            setCollections([]);
            setIsLoading(false);
            return;
        }

        const stored = localStorage.getItem(`${STORAGE_KEY}_${user.uid}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // First parse dates
                const parsedCollections = parsed.map((c: Collection) => ({
                    ...c,
                    created_at: new Date(c.created_at),
                }));

                // Migration: Rename "Default" to "Uncategorized"
                const migrated = parsedCollections.map((c: Collection) => {
                    if (c._id === 'default_0' && c.name === 'Default') {
                        return { ...c, name: 'Uncategorized', icon: 'inbox' };
                    }
                    return c;
                });

                setCollections(migrated);
            } catch {
                // Initialize with defaults
                initializeDefaults();
            }
        } else {
            initializeDefaults();
        }
        setIsLoading(false);
    }, [user]);

    // Save to localStorage whenever collections change
    useEffect(() => {
        if (user && collections.length > 0) {
            localStorage.setItem(`${STORAGE_KEY}_${user.uid}`, JSON.stringify(collections));
        }
    }, [collections, user]);

    // Add a new collection
    const addCollection = useCallback(async (
        name: string,
        icon?: string,
        color?: string
    ): Promise<Collection> => {
        const newCollection: Collection = {
            _id: `col_${Date.now()}`,
            name,
            icon: icon || 'folder',
            color,
            created_at: new Date(),
        };

        setCollections((prev) => [...prev, newCollection]);
        return newCollection;
    }, []);

    // Update a collection
    const updateCollection = useCallback(async (
        id: string,
        updates: Partial<Collection>
    ) => {
        setCollections((prev) =>
            prev.map((c) => (c._id === id ? { ...c, ...updates } : c))
        );
    }, []);

    // Remove a collection
    const removeCollection = useCallback(async (id: string) => {
        // Don't allow removing the default collection
        if (id === 'default_0') return;
        setCollections((prev) => prev.filter((c) => c._id !== id));
    }, []);

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
