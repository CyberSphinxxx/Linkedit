'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollections } from '@/context/CollectionsContext';
import { useLinks } from '@/context/LinksContext';
import { ChevronDown, FolderOpen, Plus, Check, Trash2 } from 'lucide-react';
import CollectionIcon, { iconMap } from './CollectionIcon';
import { COLLECTION_ICONS, CollectionIconName, Collection } from '@/types/collection';
import DeleteCollectionModal from './DeleteCollectionModal';
import { useToast } from '@/components/Toast';

interface CollectionSwitcherProps {
    className?: string;
}

export default function CollectionSwitcher({ className = '' }: CollectionSwitcherProps) {
    const { collections, addCollection, removeCollection } = useCollections();
    const { selectedCollection, setSelectedCollection, links } = useLinks();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState<CollectionIconName>('folder');
    const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setIsCreating(false);
                setNewName('');
                setNewIcon('folder');
                setCollectionToDelete(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreate = async () => {
        if (newName.trim()) {
            const col = await addCollection(newName.trim(), newIcon);
            setSelectedCollection(col._id);
            setNewName('');
            setNewIcon('folder');
            setIsCreating(false);
            setIsOpen(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, collection: Collection) => {
        e.stopPropagation();
        setCollectionToDelete(collection);
        setIsOpen(false); // Close dropdown when opening modal
    };

    const handleConfirmDelete = async () => {
        if (collectionToDelete) {
            await removeCollection(collectionToDelete._id);
            if (selectedCollection === collectionToDelete._id) {
                setSelectedCollection(null);
            }
            showToast(`${collectionToDelete.name} deleted successfully`, 'success');
            setCollectionToDelete(null);
        }
    };

    // Get link counts per collection
    const getCollectionCount = (collectionId: string) => {
        return links.filter(l => (l.collection || 'default_0') === collectionId).length;
    };

    const selectedCol = selectedCollection
        ? collections.find(c => c._id === selectedCollection)
        : null;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface border border-surface-elevated hover:border-primary/30 text-foreground transition-all group"
            >
                {selectedCol ? (
                    <CollectionIcon name={selectedCol.icon} className="w-4 h-4 text-primary" />
                ) : (
                    <FolderOpen className="w-4 h-4 text-primary" />
                )}

                <span className="font-medium">
                    {selectedCol ? selectedCol.name : 'All Collections'}
                </span>
                <ChevronDown className={`w-4 h-4 text-foreground-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-72 bg-surface border border-surface-elevated rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        {/* All Collections option */}
                        <div className="p-1.5 border-b border-surface-elevated">
                            <button
                                onClick={() => {
                                    setSelectedCollection(null);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${!selectedCollection
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-foreground hover:bg-surface-elevated'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <FolderOpen className="w-4 h-4" />
                                    All Collections
                                </span>
                                <span className="text-xs text-foreground-muted">{links.length}</span>
                            </button>
                        </div>

                        {/* Collection list */}
                        <div className="max-h-64 overflow-y-auto p-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {collections.map(col => {
                                const count = getCollectionCount(col._id);
                                const isSelected = selectedCollection === col._id;

                                return (
                                    <div
                                        key={col._id}
                                        className={`group/item w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${isSelected
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-surface-elevated'
                                            }`}
                                        onClick={() => {
                                            setSelectedCollection(col._id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="flex items-center gap-2 overflow-hidden">
                                            <CollectionIcon name={col.icon} className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{col.name}</span>
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {/* Delete button (only for non-default) */}
                                            {col._id !== 'default_0' && (
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, col)}
                                                    className="p-1 rounded-md text-foreground-muted hover:text-error hover:bg-error/10 opacity-0 group-hover/item:opacity-100 transition-all"
                                                    title="Delete collection"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            <span className={`text-xs ${isSelected ? 'text-primary' : 'text-foreground-muted'}`}>
                                                {count}
                                            </span>
                                            {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Create new */}
                        <div className="border-t border-surface-elevated p-3">
                            {isCreating ? (
                                <div className="space-y-3">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                        placeholder="Collection name..."
                                        className="w-full px-3 py-1.5 text-sm rounded-lg bg-background border border-surface-elevated focus:border-primary outline-none"
                                        autoFocus
                                    />

                                    {/* Icon Picker Grid */}
                                    <div>
                                        <p className="text-xs text-foreground-muted mb-2">Select Icon</p>
                                        <div className="grid grid-cols-6 gap-2">
                                            {COLLECTION_ICONS.map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => setNewIcon(icon)}
                                                    className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${newIcon === icon
                                                        ? 'bg-primary text-background'
                                                        : 'bg-surface-elevated text-foreground-muted hover:text-foreground'
                                                        }`}
                                                    title={icon}
                                                >
                                                    <CollectionIcon name={icon} size={14} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            disabled={!newName.trim()}
                                            className="px-3 py-1.5 text-xs bg-primary text-background rounded-lg hover:opacity-90 disabled:opacity-50"
                                        >
                                            Create Collection
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create new collection
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <DeleteCollectionModal
                isOpen={!!collectionToDelete}
                onClose={() => setCollectionToDelete(null)}
                onConfirm={handleConfirmDelete}
                collection={collectionToDelete}
            />
        </div>
    );
}
