'use client';

import { useState, useCallback, useEffect, ClipboardEvent, ChangeEvent } from 'react';
import { PreviewData } from '@/lib/scraper';
import { Link as LinkType } from '@/types/link';
import Image from 'next/image';
import TagInput from './TagInput';
import { isValidUrl } from '@/lib/utils';

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

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, isLoading]);

    const fetchPreview = useCallback(async (inputUrl: string) => {
        if (!isValidUrl(inputUrl)) {
            setError('Please enter a valid URL');
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        if (preview) {
            setPreview(null);
            setError(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && url && isValidUrl(url) && !preview) {
            fetchPreview(url);
        }
    };

    const handleSave = () => {
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
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => !isLoading && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl bg-surface/90 backdrop-blur-xl border border-surface-elevated rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-elevated">
                    <h2 className="text-lg font-semibold text-foreground">Add New Link</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* URL Input */}
                    <div className="relative">
                        <input
                            type="url"
                            value={url}
                            onChange={handleChange}
                            onPaste={handlePaste}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder="Paste a link to save it to your brain..."
                            autoFocus
                            className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-elevated text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                        />

                        {isLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-error text-sm mt-3">{error}</p>
                    )}

                    {/* Preview Card */}
                    {preview && (
                        <div className="mt-5 rounded-xl bg-surface-elevated overflow-hidden border border-surface-elevated">
                            {/* Thumbnail */}
                            <div className="relative w-full h-40 bg-background">
                                <Image
                                    src={preview.image}
                                    alt={preview.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute top-2 left-2">
                                    <span
                                        className={`
                      px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase
                      ${preview.mediaType === 'video' ? 'bg-error/90 text-white' : ''}
                      ${preview.mediaType === 'image' ? 'bg-accent/90 text-white' : ''}
                      ${preview.mediaType === 'article' ? 'bg-primary/90 text-background' : ''}
                    `}
                                    >
                                        {preview.mediaType}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Image
                                        src={preview.favicon}
                                        alt={preview.siteName}
                                        width={16}
                                        height={16}
                                        className="rounded-sm"
                                        unoptimized
                                    />
                                    <span className="text-xs text-foreground-muted">{preview.siteName}</span>
                                </div>
                                <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                                    {preview.title}
                                </h3>
                            </div>
                        </div>
                    )}

                    {/* Tags Input */}
                    {preview && (
                        <div className="mt-4">
                            <TagInput
                                tags={tags}
                                onChange={setTags}
                                placeholder="Add tags (e.g. meme, react, funny)"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                {preview && (
                    <div className="flex gap-3 p-5 pt-0">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-medium text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Save Link
                        </button>
                        <button
                            onClick={() => {
                                setPreview(null);
                                setUrl('');
                                setTags([]);
                            }}
                            className="px-4 py-2.5 rounded-xl border border-surface-elevated text-foreground-muted font-medium text-sm hover:border-foreground-muted hover:text-foreground transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
