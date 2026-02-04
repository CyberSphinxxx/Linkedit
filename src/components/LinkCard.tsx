'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link as LinkType } from '@/types/link';
import YouTubeModal from './YouTubeModal';
import ImageLightbox from './ImageLightbox';
import EditLinkModal from './EditLinkModal';
import { parseYouTubeId } from '@/lib/scraper';
import { isDirectImage, getHostname, getFaviconUrl } from '@/lib/utils';
import { useLinks } from '@/context/LinksContext';
import { useToast } from '@/components/Toast';

interface LinkCardProps {
    link: LinkType;
}

export default function LinkCard({ link }: LinkCardProps) {
    const [showYouTubeModal, setShowYouTubeModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { removeLink, toggleFavorite } = useLinks();
    const { showToast } = useToast();

    const youtubeId = parseYouTubeId(link.original_url);
    const isImage = isDirectImage(link.original_url) || link.media_type === 'image';
    const hostname = getHostname(link.original_url);

    const handleClick = () => {
        if (youtubeId) {
            return;
        } else if (isImage) {
            setShowLightbox(true);
        } else {
            window.open(link.original_url, '_blank');
        }
    };

    const handleWatchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowYouTubeModal(true);
    };

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(link.original_url);
            showToast('Link copied!', 'success');
        } catch {
            showToast('Failed to copy', 'error');
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
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            await removeLink(link._id);
            showToast('Link deleted', 'success');
        } catch {
            showToast('Failed to delete', 'error');
            setIsDeleting(false);
        }
    };

    const thumbnailSrc = imageError
        ? 'https://placehold.co/600x400/13131a/00f0ff?text=No+Image'
        : link.metadata.thumbnail_image || 'https://placehold.co/600x400/13131a/00f0ff?text=No+Image';

    const faviconSrc = link.metadata.favicon || getFaviconUrl(link.original_url);

    return (
        <>
            <div
                onClick={handleClick}
                className={`group break-inside-avoid mb-4 rounded-2xl bg-surface border border-surface-elevated overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${youtubeId ? '' : 'cursor-pointer'
                    } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden bg-surface-elevated">
                    <Image
                        src={thumbnailSrc}
                        alt={link.metadata.title || 'Link preview'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                        onError={() => setImageError(true)}
                    />

                    {/* Gradient overlay for text legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Favicon + Site name overlay */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 backdrop-blur-md shadow-sm border border-white/5 z-20">
                        <Image
                            src={faviconSrc}
                            alt={link.metadata.site_name || hostname}
                            width={14}
                            height={14}
                            className="rounded-sm"
                            unoptimized
                            onError={(e) => {
                                e.currentTarget.src = '/favicon.ico';
                            }}
                        />
                        <span className="text-[10px] font-semibold text-foreground truncate max-w-[80px]">
                            {link.metadata.site_name || hostname}
                        </span>
                    </div>

                    {/* Quick Actions Bar - Unified & Cleaner */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-20">
                        <div className="flex items-center gap-1">
                            {/* Favorite button */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`p-1.5 rounded-md backdrop-blur-md border border-white/10 transition-all duration-200 ${link.is_favorite
                                    ? 'bg-warning text-background shadow-lg shadow-warning/20'
                                    : 'bg-black/60 text-white/80 hover:text-warning hover:bg-black/80'
                                    }`}
                                title={link.is_favorite ? 'Remove favorite' : 'Favorite'}
                            >
                                <svg className="w-3.5 h-3.5" fill={link.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>

                            {/* Copy link button */}
                            <button
                                onClick={handleCopyLink}
                                className="p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200"
                                title="Copy"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>

                            {/* Edit button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}
                                className="p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200"
                                title="Edit"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>

                        {/* Delete button */}
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-error hover:bg-black/80 transition-all duration-200 disabled:opacity-50"
                            title="Delete"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Play icon - Smaller & Centered */}
                    {youtubeId && (
                        <button
                            onClick={handleWatchClick}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/play z-10"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-primary group-hover/play:border-primary shadow-lg">
                                <svg
                                    className="w-5 h-5 text-white ml-0.5 transition-colors"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    )}



                    {/* Media type badge - Smaller & Top Right */}
                    <div className="absolute top-2.5 right-2.5 z-20">
                        <span
                            className={`
                px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm
                ${link.media_type === 'video' ? 'bg-error text-white' : ''}
                ${link.media_type === 'image' ? 'bg-accent text-white' : ''}
                ${link.media_type === 'article' ? 'bg-primary text-background' : ''}
              `}
                        >
                            {link.media_type === 'article' ? 'LINK' : link.media_type}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 leading-snug">
                        {link.metadata.title || 'Untitled'}
                    </h3>

                    {/* Tags */}
                    {link.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {link.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-surface-elevated text-foreground-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {link.tags.length > 3 && (
                                <span className="px-2 py-1 text-[10px] text-foreground-muted">
                                    +{link.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}



                    {/* View Image button */}
                    {isImage && !youtubeId && (
                        <button
                            onClick={() => setShowLightbox(true)}
                            className="w-full px-4 py-2 rounded-xl bg-accent/10 text-accent font-medium text-sm hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            View Full Size
                        </button>
                    )}
                </div>
            </div>

            {/* YouTube Modal */}
            {youtubeId && (
                <YouTubeModal
                    videoId={youtubeId}
                    isOpen={showYouTubeModal}
                    onClose={() => setShowYouTubeModal(false)}
                />
            )}

            {/* Image Lightbox */}
            {isImage && (
                <ImageLightbox
                    src={link.metadata.thumbnail_image || link.original_url}
                    alt={link.metadata.title || 'Image'}
                    isOpen={showLightbox}
                    onClose={() => setShowLightbox(false)}
                />
            )}

            {/* Edit Modal */}
            <EditLinkModal
                link={link}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </>
    );
}

