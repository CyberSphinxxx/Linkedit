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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link as LinkType } from '@/types/link';

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
