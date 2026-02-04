'use client';

import { useState, useCallback, useEffect, ClipboardEvent, KeyboardEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PreviewData } from '@/lib/scraper';
import { Link as LinkType } from '@/types/link';
import Image from 'next/image';
import TagInput from './TagInput';
import { isValidUrl } from '@/lib/utils';
import { useSettings } from '@/context/SettingsContext';
import { useCollections } from '@/context/CollectionsContext';
import { useLinks } from '@/context/LinksContext';
import CollectionIcon, { iconMap } from './CollectionIcon';
import { COLLECTION_ICONS, CollectionIconName } from '@/types/collection';
import { extractDominantColor, hexToRgba } from '@/lib/colorUtils';
import {
    X, Link as LinkIcon, Loader2, Check, ExternalLink, Image as ImageIcon,
    Video, FileText, Search, StickyNote, ChevronDown, Plus, FolderOpen, Sparkles
} from 'lucide-react';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (link: Omit<LinkType, '_id'>) => void;
}

export default function AddLinkModal({ isOpen, onClose, onSave }: AddLinkModalProps) {
    const { settings } = useSettings();
    const { collections, addCollection } = useCollections();
    const { allTags } = useLinks();

    // Form state
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    // New enhanced state
    const [note, setNote] = useState('');
    const [isNoteExpanded, setIsNoteExpanded] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState('default_0');
    const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionIcon, setNewCollectionIcon] = useState<CollectionIconName>('folder');
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [customImageUrl, setCustomImageUrl] = useState('');
    const [dominantColor, setDominantColor] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Ensure we're mounted on client before using portal
    useEffect(() => {
        setMounted(true);
    }, []);

    const collectionDropdownRef = useRef<HTMLDivElement>(null);
    const newCollectionInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setUrl('');
            setPreview(null);
            setError(null);
            setTags([]);
            setNote('');
            setIsNoteExpanded(false);
            setSelectedCollection('default_0');
            setDominantColor(null);
            setIsLoading(false);
            setIsCollectionDropdownOpen(false);
            setIsCreatingCollection(false);
            setNewCollectionName('');
            setNewCollectionIcon('folder');
        }
    }, [isOpen]);

    // Extract dominant color when preview image loads
    useEffect(() => {
        if (preview?.image && !preview.image.includes('placehold')) {
            extractDominantColor(preview.image).then(setDominantColor);
        } else {
            setDominantColor(null);
        }
    }, [preview?.image]);

    // Close collection dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(e.target as Node)) {
                setIsCollectionDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus new collection input when creating
    useEffect(() => {
        if (isCreatingCollection && newCollectionInputRef.current) {
            newCollectionInputRef.current.focus();
        }
    }, [isCreatingCollection]);

    const resetFormKeepModal = () => {
        setUrl('');
        setPreview(null);
        setError(null);
        setTags([]);
        setNote('');
        setIsNoteExpanded(false);
        setDominantColor(null);
        // Keep collection selection for batch adding
    };

    const handleSave = useCallback((andAddAnother = false) => {
        if (preview) {
            const newLink: Omit<LinkType, '_id'> = {
                original_url: preview.url,
                metadata: {
                    title: preview.title,
                    description: preview.description,
                    thumbnail_image: customImageUrl || preview.image,
                    site_name: preview.siteName,
                    favicon: preview.favicon,
                },
                tags,
                media_type: preview.mediaType,
                is_favorite: false,
                created_at: new Date(),
                ...(note.trim() ? { note: note.trim() } : {}),
                collection: selectedCollection,
            };
            onSave(newLink);

            if (andAddAnother) {
                resetFormKeepModal();
            } else {
                onClose();
            }
        }
    }, [preview, tags, note, selectedCollection, onSave, onClose]);

    // Handle escape key and keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) onClose();

            // Ctrl/Cmd + Enter to save & add another
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && preview) {
                e.preventDefault();
                handleSave(true); // Save & Add Another
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, isLoading, preview, handleSave]);

    const fetchPreview = useCallback(async (inputUrl: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl }),
            });

            if (!response.ok) throw new Error('Failed to fetch preview');

            const data = await response.json();
            setPreview(data);

            // Auto-suggest media type tag
            if (data.mediaType && data.mediaType !== 'article') {
                if (!tags.includes(`#${data.mediaType}`)) {
                    setTags(prev => [...prev, `#${data.mediaType}`]);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch link preview');
        } finally {
            setIsLoading(false);
        }
    }, [tags]);

    const handlePaste = useCallback(
        (e: ClipboardEvent<HTMLInputElement>) => {
            const pastedText = e.clipboardData.getData('text');
            if (pastedText && isValidUrl(pastedText)) {
                e.preventDefault();
                setUrl(pastedText);
                if (settings.autoFetchMetadata) {
                    fetchPreview(pastedText);
                }
            }
        },
        [fetchPreview, settings.autoFetchMetadata]
    );

    const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && url && isValidUrl(url) && !preview) {
            fetchPreview(url);
        }
    };

    const handleCreateCollection = async () => {
        if (newCollectionName.trim()) {
            const newCol = await addCollection(newCollectionName.trim(), newCollectionIcon);
            setSelectedCollection(newCol._id);
            setNewCollectionName('');
            setNewCollectionIcon('folder');
            setIsCreatingCollection(false);
            setIsCollectionDropdownOpen(false);
        }
    };

    // Get suggested tags (top 5 most used + media type)
    const suggestedTags = allTags
        .slice(0, 5)
        .map(t => t.name)
        .filter(t => !tags.includes(t));

    const addSuggestedTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags(prev => [...prev, tag]);
        }
    };

    const selectedCollectionData = collections.find(c => c._id === selectedCollection);

    // Dynamic glow style
    const glowStyle = dominantColor ? {
        boxShadow: `0 0 60px ${hexToRgba(dominantColor, 0.3)}, 0 0 120px ${hexToRgba(dominantColor, 0.15)}`,
    } : {};

    const content = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="flex min-h-full w-full items-center justify-center p-4 pb-24">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-background/60 backdrop-blur-md transition-opacity"
                            onClick={() => !isLoading && onClose()}
                        />

                        {/* Modal Panel with Dynamic Glow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0, opacity: { duration: 0.2 } }}
                            style={glowStyle}
                            className="relative transform overflow-hidden rounded-2xl bg-surface border border-white/10 text-left shadow-2xl transition-all w-full max-w-xl ring-1 ring-white/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-elevated">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-surface-elevated text-primary">
                                        <LinkIcon className="w-4 h-4" />
                                    </span>
                                    Add New Link
                                </h2>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors disabled:opacity-50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5 space-y-5">
                                {/* URL Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground-muted">Link URL</label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            onPaste={handlePaste}
                                            onKeyDown={handleKeyDownInput}
                                            placeholder="https://..."
                                            disabled={isLoading}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-surface-elevated focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-foreground-muted/50 outline-none transition-all disabled:opacity-50"
                                        />
                                        {isLoading && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Hints or Fetch button */}
                                    {!error && !isLoading && !preview && (
                                        <div className="flex items-center gap-4 text-xs text-foreground-muted px-1">
                                            {settings.autoFetchMetadata ? (
                                                <>
                                                    <span className="flex items-center gap-1.5">
                                                        <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-elevated/50 font-mono text-[10px]">Ctrl+V</kbd>
                                                        to paste
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-elevated/50 font-mono text-[10px]">Enter</kbd>
                                                        to fetch
                                                    </span>
                                                </>
                                            ) : url && isValidUrl(url) ? (
                                                <button
                                                    onClick={() => fetchPreview(url)}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                >
                                                    <Search className="w-4 h-4" />
                                                    Fetch Preview
                                                </button>
                                            ) : (
                                                <span className="text-foreground-muted">Paste a URL to get started</span>
                                            )}
                                        </div>
                                    )}
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-error px-1"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Preview Card */}
                                {preview && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-xl overflow-hidden border border-surface-elevated bg-background"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-surface-elevated overflow-hidden">
                                            {(customImageUrl || preview.image) ? (
                                                <Image
                                                    src={customImageUrl || preview.image}
                                                    alt={preview.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
                                                    <ImageIcon className="w-12 h-12 text-foreground-muted/20" />
                                                </div>
                                            )}

                                            {/* Edit Image Controls */}
                                            <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsEditingImage(!isEditingImage);
                                                    }}
                                                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${isEditingImage
                                                        ? 'bg-primary text-background'
                                                        : 'bg-black/40 text-white hover:bg-black/60'
                                                        }`}
                                                    title="Change preview image"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Image URL Input */}
                                            <AnimatePresence>
                                                {isEditingImage && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute inset-x-2 top-12 z-20"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            type="url"
                                                            value={customImageUrl}
                                                            onChange={(e) => setCustomImageUrl(e.target.value)}
                                                            placeholder="Paste image URL..."
                                                            className="w-full px-3 py-2 rounded-lg bg-background/90 border border-surface-elevated/50 shadow-lg text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-md"
                                                            autoFocus
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            {/* Media type badge */}
                                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm
                                                ${preview.mediaType === 'video' ? 'bg-error/90 text-white' : ''}
                                                ${preview.mediaType === 'image' ? 'bg-accent/90 text-white' : ''}
                                                ${preview.mediaType === 'article' ? 'bg-primary/90 text-background' : ''}
                                            `}>
                                                {preview.mediaType === 'video' && <Video className="w-3 h-3" />}
                                                {preview.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
                                                {preview.mediaType === 'article' && <FileText className="w-3 h-3" />}
                                                {preview.mediaType === 'article' ? 'Link' : preview.mediaType}
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                {preview.favicon && (
                                                    <Image
                                                        src={preview.favicon}
                                                        alt=""
                                                        width={16}
                                                        height={16}
                                                        className="rounded"
                                                        unoptimized
                                                    />
                                                )}
                                                <span className="text-xs text-foreground-muted">{preview.siteName}</span>
                                            </div>
                                            <h3 className="font-medium text-foreground line-clamp-2">{preview.title}</h3>
                                            {preview.description && (
                                                <p className="text-sm text-foreground-muted mt-1 line-clamp-2">{preview.description}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Personal Note (Collapsible) */}
                                {preview && (
                                    <div className="space-y-2">
                                        {!isNoteExpanded ? (
                                            <button
                                                onClick={() => setIsNoteExpanded(true)}
                                                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                                            >
                                                <StickyNote className="w-4 h-4" />
                                                Add a note...
                                            </button>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                            >
                                                <label className="text-sm font-medium text-foreground-muted flex items-center gap-2">
                                                    <StickyNote className="w-4 h-4" />
                                                    Personal Note
                                                </label>
                                                <textarea
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="Why are you saving this? (optional)"
                                                    rows={2}
                                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-background border border-surface-elevated focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-foreground-muted/50 outline-none transition-all resize-none text-sm"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {/* Tags */}
                                {preview && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground-muted">Tags</label>
                                        <TagInput tags={tags} onChange={setTags} />

                                        {/* Suggested Tags */}
                                        {suggestedTags.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Sparkles className="w-3 h-3 text-foreground-muted" />
                                                {suggestedTags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => addSuggestedTag(tag)}
                                                        className="px-2 py-1 text-xs rounded-lg bg-surface-elevated text-foreground-muted hover:bg-primary/10 hover:text-primary transition-colors"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-surface-elevated bg-surface-elevated/30 flex items-center justify-between gap-4">
                                {/* Collection Dropdown */}
                                <div className="relative" ref={collectionDropdownRef}>
                                    <button
                                        onClick={() => setIsCollectionDropdownOpen(!isCollectionDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-surface-elevated hover:border-primary/30 text-sm text-foreground transition-colors"
                                    >
                                        <CollectionIcon name={selectedCollectionData?.icon || 'inbox'} className="w-4 h-4 text-foreground-muted" />
                                        <span>{selectedCollectionData?.name || 'Uncategorized'}</span>
                                        <ChevronDown className="w-4 h-4 text-foreground-muted" />
                                    </button>

                                    <AnimatePresence>
                                        {isCollectionDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute bottom-full mb-2 left-0 w-72 bg-surface border border-surface-elevated rounded-xl shadow-xl overflow-hidden z-10"
                                            >
                                                <div className="max-h-48 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                                                            <CollectionIcon name={col.icon} className="w-4 h-4" />
                                                            <span>{col.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="border-t border-surface-elevated p-3">
                                                    {isCreatingCollection ? (
                                                        <div className="space-y-3">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    ref={newCollectionInputRef}
                                                                    type="text"
                                                                    value={newCollectionName}
                                                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                                                                    placeholder="Collection name..."
                                                                    className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-background border border-surface-elevated focus:border-primary outline-none"
                                                                />
                                                            </div>
                                                            {/* Icon Picker */}
                                                            <div>
                                                                <p className="text-xs text-foreground-muted mb-2">Select Icon</p>
                                                                <div className="grid grid-cols-6 gap-2">
                                                                    {COLLECTION_ICONS.map(icon => (
                                                                        <button
                                                                            key={icon}
                                                                            onClick={() => setNewCollectionIcon(icon)}
                                                                            className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${newCollectionIcon === icon
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
                                                                    onClick={() => setIsCreatingCollection(false)}
                                                                    className="px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleCreateCollection}
                                                                    disabled={!newCollectionName.trim()}
                                                                    className="px-3 py-1.5 text-xs bg-primary text-background rounded-lg hover:opacity-90 disabled:opacity-50"
                                                                >
                                                                    Create Collection
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setIsCreatingCollection(true)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Create new collection
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => !isLoading && onClose()}
                                        className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSave(false)}
                                        disabled={!preview || isLoading}
                                        className="px-5 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Link
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );

    // Use portal to render at document body to avoid scroll position issues
    if (!mounted) return null;
    return createPortal(content, document.body);
}
