'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as LinkType } from '@/types/link';
import { useLinks } from '@/context/LinksContext';
import { useToast } from '@/components/Toast';

interface EditLinkModalProps {
    link: LinkType;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditLinkModal({ link, isOpen, onClose }: EditLinkModalProps) {
    const [tags, setTags] = useState<string[]>(link.tags);
    const [title, setTitle] = useState(link.metadata.title || '');
    const [imageUrl, setImageUrl] = useState(link.metadata.thumbnail_image || '');
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { updateLink } = useLinks();
    const { showToast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTags(link.tags);
            setTitle(link.metadata.title || '');
            setImageUrl(link.metadata.thumbnail_image || '');
            setTagInput('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, link]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateLink(link._id, {
                tags,
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-surface border border-surface-elevated rounded-2xl shadow-xl overflow-hidden"
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

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-elevated/50 border border-surface-elevated min-h-[80px]">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                        >
                                            #{tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-error transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onBlur={handleAddTag}
                                        placeholder={tags.length === 0 ? 'Add tags...' : ''}
                                        className="flex-1 min-w-[100px] bg-transparent text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
                                    />
                                </div>
                                <p className="text-xs text-foreground-muted mt-2">
                                    Press Enter to add a tag, Backspace to remove
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-surface-elevated">
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
}
