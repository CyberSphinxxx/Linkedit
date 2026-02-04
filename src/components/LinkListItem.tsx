'use client';

import { Link as LinkType } from '@/types/link';
import Image from 'next/image';
import { parseYouTubeId } from '@/lib/scraper';
import { getHostname, getFaviconUrl } from '@/lib/utils';
import { useLinks } from '@/context/LinksContext';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/components/Toast';
import { useState } from 'react';
import EditLinkModal from './EditLinkModal';

interface LinkListItemProps {
    link: LinkType;
}

export default function LinkListItem({ link }: LinkListItemProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const { removeLink, toggleFavorite } = useLinks();
    const { settings } = useSettings();
    const { showToast } = useToast();

    const youtubeId = parseYouTubeId(link.original_url);
    const hostname = getHostname(link.original_url);
    const faviconSrc = link.metadata.favicon || getFaviconUrl(link.original_url);

    const handleClick = () => {
        const target = settings.openLinksInNewTab ? '_blank' : '_self';
        if (youtubeId) {
            window.open(`https://www.youtube.com/watch?v=${youtubeId}`, target);
        } else {
            window.open(link.original_url, target);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleFavorite(link._id);
            showToast(link.is_favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
        } catch {
            showToast('Failed to update', 'error');
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await removeLink(link._id);
            showToast('Link deleted', 'success');
        } catch {
            showToast('Failed to delete', 'error');
        }
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(link.original_url);
            showToast('Link copied!', 'success');
        } catch {
            showToast('Failed to copy', 'error');
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                className="group flex items-center gap-4 p-3 rounded-xl bg-surface border border-surface-elevated hover:border-primary/30 transition-all cursor-pointer"
            >
                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-surface-elevated flex-shrink-0">
                    <Image
                        src={link.metadata.thumbnail_image || 'https://placehold.co/64x48/13131a/00f0ff?text=No'}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    {youtubeId && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Image
                            src={faviconSrc}
                            alt=""
                            width={14}
                            height={14}
                            className="rounded-sm"
                            unoptimized
                            onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                        />
                        <span className="text-xs text-foreground-muted truncate">{hostname}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded ${link.media_type === 'video' ? 'bg-error/20 text-error' :
                            link.media_type === 'image' ? 'bg-accent/20 text-accent' :
                                'bg-primary/20 text-primary'
                            }`}>
                            {link.media_type}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground truncate mt-0.5">
                        {link.metadata.title || 'Untitled'}
                    </h3>
                    {link.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            {link.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-[10px] text-foreground-muted">#{tag}</span>
                            ))}
                            {link.tags.length > 3 && (
                                <span className="text-[10px] text-foreground-muted">+{link.tags.length - 3}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-1.5 rounded-lg transition-colors ${link.is_favorite ? 'text-warning' : 'text-foreground-muted hover:text-warning'
                            }`}
                        title={link.is_favorite ? 'Remove favorite' : 'Add favorite'}
                    >
                        <svg className="w-4 h-4" fill={link.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-primary transition-colors"
                        title="Copy link"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-accent transition-colors"
                        title="Edit link"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-error transition-colors"
                        title="Delete link"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <EditLinkModal
                link={link}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </>
    );
}
