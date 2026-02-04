'use client';

import { useState, useRef, useCallback } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import CollectionIcon from './CollectionIcon';
import { useCollections } from '@/context/CollectionsContext';
import { useClickOutside } from '@/hooks';

interface CollectionDropdownProps {
    selectedId: string;
    onSelect: (id: string) => void;
    showCreateOption?: boolean;
    onCreateNew?: (name: string) => void;
    placeholder?: string;
}

export default function CollectionDropdown({
    selectedId,
    onSelect,
    showCreateOption = false,
    onCreateNew,
    placeholder = 'Select collection',
}: CollectionDropdownProps) {
    const { collections } = useCollections();
    const [isOpen, setIsOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => setIsOpen(false), []);
    useClickOutside(dropdownRef, handleClose, isOpen);

    const selectedCollection = collections.find((c) => c._id === selectedId);

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
    };

    const handleCreateNew = async () => {
        if (!newCollectionName.trim() || !onCreateNew) return;

        setIsCreating(true);
        try {
            await onCreateNew(newCollectionName.trim());
            setNewCollectionName('');
            setIsOpen(false);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-surface-elevated border border-surface-elevated hover:border-primary/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {selectedCollection ? (
                        <>
                            <CollectionIcon
                                name={selectedCollection.icon}
                                className="w-5 h-5 text-primary"
                            />
                            <span className="text-sm font-medium text-foreground">
                                {selectedCollection.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-foreground-muted">{placeholder}</span>
                    )}
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-foreground-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface border border-surface-elevated rounded-xl shadow-xl overflow-hidden">
                    {/* Collection List */}
                    <div className="max-h-48 overflow-y-auto py-2">
                        {collections.map((collection) => (
                            <button
                                key={collection._id}
                                type="button"
                                onClick={() => handleSelect(collection._id)}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${selectedId === collection._id
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-surface-elevated text-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <CollectionIcon
                                        name={collection.icon}
                                        className={`w-4 h-4 ${selectedId === collection._id
                                            ? 'text-primary'
                                            : 'text-foreground-muted'
                                            }`}
                                    />
                                    <span className="text-sm font-medium">{collection.name}</span>
                                </div>
                                {selectedId === collection._id && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Create New Option */}
                    {showCreateOption && onCreateNew && (
                        <div className="border-t border-surface-elevated p-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="New collection name..."
                                    className="flex-1 px-3 py-2 rounded-lg bg-surface-elevated border border-surface-elevated text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary/50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreateNew();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateNew}
                                    disabled={!newCollectionName.trim() || isCreating}
                                    className="px-3 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
