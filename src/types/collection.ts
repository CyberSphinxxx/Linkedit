// Types for Collection entity
export interface Collection {
    _id: string;
    name: string;
    icon: string;        // Lucide icon name (e.g., 'folder', 'briefcase')
    color?: string;      // Optional accent color (hex)
    created_at: Date;
}

// Available icons for collections (Lucide icon names)
export const COLLECTION_ICONS = [
    'folder',
    'folder-open',
    'briefcase',
    'book',
    'bookmark',
    'star',
    'heart',
    'code',
    'music',
    'video',
    'image',
    'file-text',
    'globe',
    'link',
    'lightbulb',
    'rocket',
    'zap',
    'trophy',
    'target',
    'flag',
    'home',
    'users',
    'graduation-cap',
    'flask-conical',
    'inbox',
    'gamepad-2',
    'palette',
    'coffee',
    'camera',
    'shopping-bag',
] as const;

export type CollectionIconName = typeof COLLECTION_ICONS[number];

// Only one default collection
export const DEFAULT_COLLECTIONS: Omit<Collection, '_id' | 'created_at'>[] = [
    { name: 'Uncategorized', icon: 'inbox' },
];
