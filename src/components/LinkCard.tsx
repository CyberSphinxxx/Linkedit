'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link as LinkType } from '@/types/link';
import YouTubeModal from './YouTubeModal';
import ImageLightbox from './ImageLightbox';
import { parseYouTubeId } from '@/lib/scraper';
import { isDirectImage, getHostname, getFaviconUrl } from '@/lib/utils';

interface LinkCardProps {
    link: LinkType;
}

export default function LinkCard({ link }: LinkCardProps) {
    const [showYouTubeModal, setShowYouTubeModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [imageError, setImageError] = useState(false);

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

    const thumbnailSrc = imageError
        ? 'https://placehold.co/600x400/13131a/00f0ff?text=No+Image'
        : link.metadata.thumbnail_image || 'https://placehold.co/600x400/13131a/00f0ff?text=No+Image';

    const faviconSrc = link.metadata.favicon || getFaviconUrl(link.original_url);

    return (
        <>
            <div
                onClick={handleClick}
                className={`group break-inside-avoid mb-4 rounded-2xl bg-surface border border-surface-elevated overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${youtubeId ? '' : 'cursor-pointer'
                    }`}
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

                    {/* Favicon + Site name overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm">
                        <Image
                            src={faviconSrc}
                            alt={link.metadata.site_name || hostname}
                            width={16}
                            height={16}
                            className="rounded-sm"
                            unoptimized
                            onError={(e) => {
                                e.currentTarget.src = '/favicon.ico';
                            }}
                        />
                        <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
                            {link.metadata.site_name || hostname}
                        </span>
                    </div>

                    {/* Play icon / Watch button for YouTube videos */}
                    {youtubeId && (
                        <button
                            onClick={handleWatchClick}
                            className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                        >
                            <div className="w-14 h-14 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-primary">
                                <svg
                                    className="w-7 h-7 text-primary group-hover/play:text-background ml-1 transition-colors"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    )}

                    {/* Zoom icon for images */}
                    {isImage && !youtubeId && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Media type badge */}
                    <div className="absolute top-3 right-3">
                        <span
                            className={`
                px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider
                ${link.media_type === 'video' ? 'bg-error/90 text-white' : ''}
                ${link.media_type === 'image' ? 'bg-accent/90 text-white' : ''}
                ${link.media_type === 'article' ? 'bg-primary/90 text-background' : ''}
              `}
                        >
                            {link.media_type}
                        </span>
                    </div>

                    {/* Favorite indicator */}
                    {link.is_favorite && (
                        <div className="absolute bottom-3 right-3">
                            <svg
                                className="w-5 h-5 text-warning drop-shadow-md"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    )}
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

                    {/* Watch button for YouTube */}
                    {youtubeId && (
                        <button
                            onClick={handleWatchClick}
                            className="w-full px-4 py-2 rounded-xl bg-error/10 text-error font-medium text-sm hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Video
                        </button>
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
        </>
    );
}
