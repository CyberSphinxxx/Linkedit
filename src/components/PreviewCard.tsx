'use client';

import { useState } from 'react';
import { PreviewData } from '@/lib/scraper';
import Image from 'next/image';
import TagInput from './TagInput';

interface PreviewCardProps {
    data: PreviewData | null;
    isLoading?: boolean;
    onConfirm?: (tags: string[]) => void;
    onDismiss?: () => void;
}

export default function PreviewCard({
    data,
    isLoading = false,
    onConfirm,
    onDismiss,
}: PreviewCardProps) {
    const [tags, setTags] = useState<string[]>([]);

    const handleConfirm = () => {
        onConfirm?.(tags);
        setTags([]);
    };

    const handleDismiss = () => {
        onDismiss?.();
        setTags([]);
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-6 animate-pulse">
                <div className="rounded-2xl bg-surface overflow-hidden border border-surface-elevated">
                    <div className="w-full h-48 bg-surface-elevated" />
                    <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-surface-elevated" />
                            <div className="w-24 h-4 rounded bg-surface-elevated" />
                        </div>
                        <div className="w-full h-6 rounded bg-surface-elevated" />
                        <div className="w-3/4 h-4 rounded bg-surface-elevated" />
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-6">
            <div className="rounded-2xl bg-surface overflow-hidden border border-surface-elevated hover:border-primary/30 transition-colors duration-300 group">
                {/* Thumbnail */}
                <div className="relative w-full h-48 md:h-56 overflow-hidden bg-surface-elevated">
                    <Image
                        src={data.image}
                        alt={data.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />

                    {/* Media type badge */}
                    <div className="absolute top-3 left-3">
                        <span
                            className={`
                px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                ${data.mediaType === 'video' ? 'bg-error/90 text-white' : ''}
                ${data.mediaType === 'image' ? 'bg-accent/90 text-white' : ''}
                ${data.mediaType === 'article' ? 'bg-primary/90 text-background' : ''}
              `}
                        >
                            {data.mediaType}
                        </span>
                    </div>

                    {/* Play icon for videos */}
                    {data.mediaType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Site info */}
                    <div className="flex items-center gap-2 mb-3">
                        {data.favicon && (
                            <Image
                                src={data.favicon}
                                alt=""
                                width={20}
                                height={20}
                                className="rounded"
                                unoptimized
                            />
                        )}
                        <span className="text-sm text-foreground-muted">{data.siteName}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {data.title}
                    </h3>

                    {/* Description */}
                    {data.description && (
                        <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                            {data.description}
                        </p>
                    )}

                    {/* Tags input */}
                    <div className="mb-4">
                        <TagInput
                            tags={tags}
                            onChange={setTags}
                            placeholder="Add tags (e.g. meme, react, funny)"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-medium text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Save Link
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2.5 rounded-xl border border-surface-elevated text-foreground-muted font-medium text-sm transition-colors hover:border-foreground-muted hover:text-foreground"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
