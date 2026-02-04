'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkType } from '@/types/link';
import { useLinks } from '@/context/LinksContext';
import { useCollections } from '@/context/CollectionsContext';
import { useToast } from '@/components/Toast';
import TagInput from './TagInput';
import CollectionIcon from './CollectionIcon';
import { ChevronDown, FolderOpen } from 'lucide-react';

interface EditLinkModalProps {
    link: LinkType;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditLinkModal({ link, isOpen, onClose }: EditLinkModalProps) {
    const [tags, setTags] = useState<string[]>(link.tags);
    const [title, setTitle] = useState(link.metadata.title || '');
    const [imageUrl, setImageUrl] = useState(link.metadata.thumbnail_image || '');
    const [selectedCollection, setSelectedCollection] = useState<string>(link.collection || 'default_0');
    const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { updateLink } = useLinks();
    const { collections } = useCollections();
    const { showToast } = useToast();
    const collectionDropdownRef = useRef<HTMLDivElement>(null);

    // Ensure we're mounted on client before using portal
    useEffect(() => {
        setMounted(true);
    }, []);

    const selectedCollectionData = collections.find(c => c._id === selectedCollection);

    useEffect(() => {
        if (isOpen) {
            setTags(link.tags);
            setTitle(link.metadata.title || '');
            setImageUrl(link.metadata.thumbnail_image || '');
            setSelectedCollection(link.collection || 'default_0');
            setIsCollectionDropdownOpen(false);
        }
    }, [isOpen, link]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(e.target as Node)) {
                setIsCollectionDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateLink(link._id, {
                tags,
                collection: selectedCollection,
                metadata: {
                    ...link.metadata,
                    title,
                    thumbnail_image: imageUrl
                }
            });
            showToast('Link updated!', 'success');
            onClose();
        } catch {
            showToast('Failed to update', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-surface border border-surface-elevated rounded-2xl shadow-xl overflow-visible"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-elevated">
                            <h2 className="text-lg font-semibold text-foreground">Edit Link</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-surface-elevated transition-colors"
                            >
                                <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Link Details Editing */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-surface-elevated/50 border border-surface-elevated text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
                                        placeholder="Link Title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Preview Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-surface-elevated/50 border border-surface-elevated text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="text-xs text-foreground-muted mt-1.5">
                                        Paste a direct image URL to fix missing previews.
                                    </p>
                                </div>
                            </div>

                            {/* Collection Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Collection
                                </label>
                                <div className="relative" ref={collectionDropdownRef}>
                                    <button
                                        onClick={() => setIsCollectionDropdownOpen(!isCollectionDropdownOpen)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-elevated/50 border border-surface-elevated hover:border-primary/30 text-sm text-foreground transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CollectionIcon name={selectedCollectionData?.icon || 'inbox'} className="w-4 h-4 text-foreground-muted" />
                                            <span>{selectedCollectionData?.name || 'Uncategorized'}</span>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-foreground-muted" />
                                    </button>

                                    <AnimatePresence>
                                        {isCollectionDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute top-full mt-2 left-0 w-full bg-surface border border-surface-elevated rounded-xl shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                            >
                                                {collections.map(col => (
                                                    <button
                                                        key={col._id}
                                                        onClick={() => {
                                                            setSelectedCollection(col._id);
                                                            setIsCollectionDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-surface-elevated transition-colors ${selectedCollection === col._id ? 'bg-primary/10 text-primary' : 'text-foreground'
                                                            }`}
                                                    >
                                                        <CollectionIcon name={col.icon} className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">{col.name}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tags
                                </label>
                                <div className="bg-surface-elevated/50 border border-surface-elevated rounded-xl">
                                    <TagInput tags={tags} onChange={setTags} />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-surface-elevated bg-surface-elevated/30">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary to-accent text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use portal to render at document body to avoid scroll position issues
    if (!mounted) return null;
    return createPortal(content, document.body);
}
