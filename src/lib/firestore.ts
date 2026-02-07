import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    Timestamp,
    setDoc,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link as LinkType } from '@/types/link';
import { Collection as CollectionType } from '@/types/collection';

// Get user's links collection reference
const getUserLinksRef = (userId: string) =>
    collection(db, 'users', userId, 'links');

// Convert Firestore doc to Link type
const docToLink = (doc: { id: string; data: () => Record<string, unknown> }): LinkType => {
    const data = doc.data();
    return {
        _id: doc.id,
        original_url: data.original_url as string,
        metadata: data.metadata as LinkType['metadata'],
        tags: data.tags as string[],
        media_type: data.media_type as 'video' | 'image' | 'article',
        is_favorite: data.is_favorite as boolean,
        collection: data.collection as string | undefined,
        created_at: (data.created_at as Timestamp)?.toDate() || new Date(),
    };
};

// Get all links for a user
export async function getLinks(userId: string): Promise<LinkType[]> {
    const linksRef = getUserLinksRef(userId);
    const q = query(linksRef, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToLink({ id: doc.id, data: () => doc.data() }));
}

// Add a new link
export async function addLink(userId: string, link: Omit<LinkType, '_id'>): Promise<string> {
    const linksRef = getUserLinksRef(userId);
    const docRef = await addDoc(linksRef, {
        ...link,
        created_at: Timestamp.now(),
    });
    return docRef.id;
}

// Update a link
export async function updateLink(
    userId: string,
    linkId: string,
    updates: Partial<LinkType>
): Promise<void> {
    const linkRef = doc(db, 'users', userId, 'links', linkId);
    await updateDoc(linkRef, updates);
}

// Delete a link
export async function deleteLink(userId: string, linkId: string): Promise<void> {
    const linkRef = doc(db, 'users', userId, 'links', linkId);
    await deleteDoc(linkRef);
}

// Toggle favorite
export async function toggleFavorite(
    userId: string,
    linkId: string,
    isFavorite: boolean
): Promise<void> {
    await updateLink(userId, linkId, { is_favorite: !isFavorite });
}

// --- Collections ---

// Get user's collections reference
const getUserCollectionsRef = (userId: string) =>
    collection(db, 'users', userId, 'collections');

// Convert Firestore doc to Collection type
const docToCollection = (doc: { id: string; data: () => Record<string, unknown> }): CollectionType => {
    const data = doc.data();
    return {
        _id: doc.id,
        name: data.name as string,
        icon: data.icon as string,
        color: data.color as string,
        created_at: (data.created_at as Timestamp)?.toDate() || new Date(),
    };
};

// Get all collections for a user
export async function getCollections(userId: string): Promise<CollectionType[]> {
    const colsRef = getUserCollectionsRef(userId);
    // Sort by created_at to maintain order
    const q = query(colsRef, orderBy('created_at', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToCollection({ id: doc.id, data: () => doc.data() }));
}

// Add a new collection
export async function addCollection(
    userId: string,
    collection: CollectionType,
    customId?: string
): Promise<string> {
    const colsRef = getUserCollectionsRef(userId);
    // Use custom ID if provided (for migration), otherwise let Firestore generate
    const { _id, ...rest } = collection;

    // Create the data object with timestamp
    const data = {
        ...rest,
        created_at: collection.created_at ? Timestamp.fromDate(collection.created_at) : Timestamp.now(),
    };

    if (customId) {
        const docRef = doc(colsRef, customId);
        await setDoc(docRef, data);
        return customId;
    } else {
        const docRef = await addDoc(colsRef, data);
        return docRef.id;
    }
}

// Update a collection
export async function updateCollection(
    userId: string,
    collectionId: string,
    updates: Partial<CollectionType>
): Promise<void> {
    const colRef = doc(db, 'users', userId, 'collections', collectionId);
    await updateDoc(colRef, updates);
}

// Delete a collection
export async function deleteCollection(userId: string, collectionId: string): Promise<void> {
    const colRef = doc(db, 'users', userId, 'collections', collectionId);
    await deleteDoc(colRef);
}

// Delete all user data (links and collections)
export async function deleteAllUserData(userId: string): Promise<void> {
    const batch = writeBatch(db);

    // 1. Get all links
    const linksRef = getUserLinksRef(userId);
    const linksSnapshot = await getDocs(linksRef);
    linksSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    // 2. Get all collections
    const colsRef = getUserCollectionsRef(userId);
    const colsSnapshot = await getDocs(colsRef);
    colsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    // Commit batch
    await batch.commit();
}

