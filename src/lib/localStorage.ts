import { Link } from '@/types/link';
import { Collection, DEFAULT_COLLECTIONS } from '@/types/collection';

const LINKS_STORAGE_KEY = 'linkedit_local_links';
const COLLECTIONS_STORAGE_KEY = 'linkedit_local_collections';

// --- Links ---

// Get all links from local storage
export function getLinks(): Link[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(LINKS_STORAGE_KEY);
        if (!stored) return [];

        const links = JSON.parse(stored);
        // Convert date strings back to Date objects
        return links.map((link: any) => ({
            ...link,
            created_at: new Date(link.created_at)
        })).sort((a: Link, b: Link) => b.created_at.getTime() - a.created_at.getTime());
    } catch (error) {
        console.error('Error reading links from local storage:', error);
        return [];
    }
}

// Add a new link
export function addLink(link: Omit<Link, '_id'>): string {
    const links = getLinks();
    const newId = crypto.randomUUID();

    const newLink: Link = {
        ...link,
        _id: newId,
        created_at: new Date(), // Ensure it's a Date object
    };

    // Links are typically sorted by newest first in the UI, so prepend
    const updatedLinks = [newLink, ...links];
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));

    return newId;
}

// Update a link
export function updateLink(linkId: string, updates: Partial<Link>): void {
    const links = getLinks();
    const updatedLinks = links.map(link =>
        link._id === linkId ? { ...link, ...updates } : link
    );
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
}

// Delete a link
export function deleteLink(linkId: string): void {
    const links = getLinks();
    const updatedLinks = links.filter(link => link._id !== linkId);
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
}

// Toggle favorite
export function toggleFavorite(linkId: string, isFavorite: boolean): void {
    updateLink(linkId, { is_favorite: !isFavorite });
}

// --- Collections ---

// Get all collections from local storage
export function getCollections(): Collection[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY);

        // If nothing stored, initialize with defaults
        if (!stored) {
            const defaults = DEFAULT_COLLECTIONS.map(c => ({
                ...c,
                _id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique IDs for defaults
                created_at: new Date()
            }));
            // Only set if we really need to, or just return defaults?
            // Better to return defaults but NOT save them immediately to avoid "ghost" data?
            // The Context usually handles initialization. Let's return empty array if really empty,
            // but the Context might expect defaults. 
            // Actually, for local storage, let's return [] and let Context handle defaults logic 
            // OR return defaults.
            // In the Context logic for Firestore, it checks if(fetched.length === 0). 
            // Let's return configured defaults if empty to match behavior.
            return [];
        }

        const collections = JSON.parse(stored);
        return collections.map((col: any) => ({
            ...col,
            created_at: new Date(col.created_at)
        })).sort((a: Collection, b: Collection) => a.created_at.getTime() - b.created_at.getTime());
    } catch (error) {
        console.error('Error reading collections from local storage:', error);
        return [];
    }
}

// Add a new collection
export function addCollection(collection: Collection): string {
    const collections = getCollections();

    // If ID is missing (it shouldn't be based on type, but for safety), generate one
    // But usually the caller handles the object creation.
    // Let's assume the passed collection object is mostly ready, but we might need to ensure _id.

    const newCollection = {
        ...collection,
        // Ensure _id exists if not provided
        _id: collection._id || crypto.randomUUID(),
        created_at: collection.created_at || new Date()
    };

    const updatedCollections = [...collections, newCollection];
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(updatedCollections));

    return newCollection._id;
}

// Update a collection
export function updateCollection(collectionId: string, updates: Partial<Collection>): void {
    const collections = getCollections();
    const updatedCollections = collections.map(col =>
        col._id === collectionId ? { ...col, ...updates } : col
    );
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(updatedCollections));
}

// Delete a collection
export function deleteCollection(collectionId: string): void {
    const collections = getCollections();
    const updatedCollections = collections.filter(col => col._id !== collectionId);
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(updatedCollections));
}

// --- Utilities ---

// Delete all local user data
export function deleteAllUserData(): void {
    localStorage.removeItem(LINKS_STORAGE_KEY);
    localStorage.removeItem(COLLECTIONS_STORAGE_KEY);
}

// Get storage usage in bytes
export function getStorageUsage(): number {
    if (typeof window === 'undefined') return 0;

    let total = 0;
    if (localStorage.getItem(LINKS_STORAGE_KEY)) {
        total += (localStorage.getItem(LINKS_STORAGE_KEY) || '').length * 2; // UTF-16 characters = 2 bytes
    }
    if (localStorage.getItem(COLLECTIONS_STORAGE_KEY)) {
        total += (localStorage.getItem(COLLECTIONS_STORAGE_KEY) || '').length * 2;
    }

    return total;
}
