'use client';

import { useState, useCallback, useEffect, ClipboardEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreviewData } from '@/lib/scraper';
import { Link as LinkType } from '@/types/link';
import Image from 'next/image';
import TagInput from './TagInput';
import { isValidUrl } from '@/lib/utils';
import { X, Link as LinkIcon, Loader2, Check, ExternalLink, Image as ImageIcon, Video, FileText } from 'lucide-react';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (link: Omit<LinkType, '_id'>) => void;
}

export default function AddLinkModal({ isOpen, onClose, onSave }: AddLinkModalProps) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setUrl('');
            setPreview(null);
            setError(null);
            setTags([]);
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSave = useCallback(() => {
        if (preview) {
            const newLink: Omit<LinkType, '_id'> = {
                original_url: preview.url,
                metadata: {
                    title: preview.title,
                    description: preview.description,
                    thumbnail_image: preview.image,
                    site_name: preview.siteName,
                    favicon: preview.favicon,
                },
                tags,
                media_type: preview.mediaType,
                is_favorite: false,
                created_at: new Date(),
            };
            onSave(newLink);
            onClose();
        }
    }, [preview, tags, onSave, onClose]);

    // Handle escape key and keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) onClose();

            // Ctrl/Cmd + Enter to save
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && preview) {
                e.preventDefault();
                handleSave();
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
        if (!isValidUrl(inputUrl)) {
            setError('Please enter a valid URL');
            return;
        }

        // Direct Image Detection
        if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(inputUrl)) {
            const urlObj = new URL(inputUrl);
            const pathSegments = urlObj.pathname.split('/');
            const filename = pathSegments[pathSegments.length - 1] || 'Image';

            // Clean filename (remove extension and common separator chars)
            const title = decodeURIComponent(filename.split('.')[0]).replace(/[-_]/g, ' ');
            const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

            setPreview({
                url: inputUrl,
                title: capitalizedTitle,
                description: 'Direct Image Link',
                image: inputUrl,
                siteName: urlObj.hostname,
                favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`,
                mediaType: 'image'
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        setPreview(null);

        try {
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch preview');
            }

            const data = await response.json();
            setPreview(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not fetch preview';
            setError(message);
            console.error('Preview error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePaste = useCallback(
        (e: ClipboardEvent<HTMLInputElement>) => {
            const pastedText = e.clipboardData.getData('text');
            if (pastedText && isValidUrl(pastedText)) {
                e.preventDefault();
                setUrl(pastedText);
                fetchPreview(pastedText);
            }
        },
        [fetchPreview]
    );

    const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && url && isValidUrl(url) && !preview) {
            fetchPreview(url);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                        onClick={() => !isLoading && onClose()}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0, opacity: { duration: 0.2 } }}
                        className="relative w-full max-w-xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
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
                                className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* URL Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground-muted ml-1">
                                    Link URL
                                </label>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                            if (preview) {
                                                setPreview(null);
                                                setError(null);
                                            }
                                        }}
                                        onPaste={handlePaste}
                                        onKeyDown={handleKeyDownInput}
                                        disabled={isLoading}
                                        placeholder="https://..."
                                        autoFocus
                                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated/50 border border-surface-elevated text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                                    />
                                    {isLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                                {!error && !isLoading && !preview && (
                                    <div className="flex items-center gap-4 text-xs text-foreground-muted px-1">
                                        <span className="flex items-center gap-1.5">
                                            <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-elevated/50 font-mono text-[10px]">Ctrl+V</kbd>
                                            to paste
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-elevated/50 font-mono text-[10px]">Enter</kbd>
                                            to fetch
                                        </span>
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
                            <AnimatePresence mode="popLayout">
                                {preview && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="rounded-xl border border-surface-elevated overflow-hidden bg-surface-elevated/30">
                                            <div className="flex sm:flex-row flex-col">
                                                {/* Thumbnail */}
                                                <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-surface-elevated">
                                                    <Image
                                                        src={preview.image}
                                                        alt={preview.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wider flex items-center gap-1">
                                                        {preview.mediaType === 'video' && <Video className="w-3 h-3" />}
                                                        {preview.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
                                                        {preview.mediaType === 'article' && <FileText className="w-3 h-3" />}
                                                        {preview.mediaType === 'article' ? 'Link' : preview.mediaType}
                                                    </div>
                                                </div>

                                                {/* Meta */}
                                                <div className="p-4 flex flex-col justify-center min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        {preview.favicon && (
                                                            <Image
                                                                src={preview.favicon}
                                                                alt=""
                                                                width={14}
                                                                height={14}
                                                                className="rounded-sm"
                                                                unoptimized
                                                            />
                                                        )}
                                                        <span className="text-xs text-foreground-muted truncate">
                                                            {preview.siteName}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
                                                        {preview.title}
                                                    </h3>
                                                    <p className="text-xs text-foreground-muted line-clamp-2">
                                                        {preview.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground-muted ml-1">
                                                Tags
                                            </label>
                                            <TagInput
                                                tags={tags}
                                                onChange={setTags}
                                                placeholder="Add tags..."
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-surface-elevated flex items-center justify-end gap-3 bg-surface-elevated/10">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!preview || isLoading}
                                className="px-6 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save Link
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
