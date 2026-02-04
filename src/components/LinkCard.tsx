'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link as LinkType } from '@/types/link';
import YouTubeModal from './YouTubeModal';
import ImageLightbox from './ImageLightbox';
import EditLinkModal from './EditLinkModal';
import LinkDetailsModal from './LinkDetailsModal';
import { parseYouTubeId } from '@/lib/scraper';
import { isDirectImage, getHostname, getFaviconUrl } from '@/lib/utils';
import { useLinks } from '@/context/LinksContext';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/components/Toast';
import { Info, ExternalLink, Heart, Edit2, Trash2, MoreHorizontal, Play } from 'lucide-react';

interface LinkCardProps {
    link: LinkType;
}

export default function LinkCard({ link }: LinkCardProps) {
    const [showYouTubeModal, setShowYouTubeModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const { removeLink, toggleFavorite } = useLinks();
    const { settings } = useSettings();
    const { showToast } = useToast();

    const youtubeId = parseYouTubeId(link.original_url);
    const isImage = isDirectImage(link.original_url) || link.media_type === 'image';
    const hostname = getHostname(link.original_url);

    // Handlers...
    const handleClick = () => {
        if (youtubeId) return;
        if (isImage) setShowLightbox(true);
        else window.open(link.original_url, '_blank');
    };

    const handleWatchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowYouTubeModal(true);
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
                className={`group relative flex flex-col w-full rounded-2xl overflow-hidden bg-surface border border-surface-elevated shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                    }`}
                onMouseLeave={() => setShowMenu(false)}
            >
                {/* === TOP: MEDIA SECTION (Clickable to Open) === */}
                <div
                    className="relative w-full aspect-video bg-background overflow-hidden cursor-pointer"
                    onClick={() => {
                        if (youtubeId) setShowYouTubeModal(true);
                        else if (isImage) setShowLightbox(true);
                        else window.open(link.original_url, '_blank');
                    }}
                >
                    <Image
                        src={thumbnailSrc}
                        alt={link.metadata.title || 'Link preview'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                        onError={() => setImageError(true)}
                    />

                    {/* Hover Overlay (Darken) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Site Badge (Top Left) */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-sm z-10 pointer-events-none">
                        <Image
                            src={faviconSrc}
                            alt=""
                            width={14}
                            height={14}
                            className="rounded-sm"
                            unoptimized
                            onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                        />
                        <span className="text-[11px] font-medium text-white/90 truncate max-w-[80px]">
                            {link.metadata.site_name || hostname}
                        </span>
                    </div>

                    {/* Media Badge (Top Right) */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <span className={`
                            px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm
                            ${link.media_type === 'article' ? 'bg-primary text-background' : ''}
                            ${link.media_type === 'video' ? 'bg-error text-white' : ''}
                            ${link.media_type === 'image' ? 'bg-accent text-white' : ''}
                        `}>
                            {link.media_type}
                        </span>
                    </div>

                    {/* === HOVER ACTIONS (Bottom Row) === */}
                    <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20" onClick={(e) => e.stopPropagation()}>

                        {/* Primary Interaction Group */}
                        <div className="flex items-center gap-2">
                            {/* Favorite */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border transition-all shadow-lg ${link.is_favorite
                                    ? 'bg-warning border-warning text-background'
                                    : 'bg-black/60 border-white/10 text-white hover:bg-white hover:text-black'
                                    }`}
                                title={link.is_favorite ? 'Unfavorite' : 'Favorite'}
                            >
                                <Heart className={`w-4 h-4 ${link.is_favorite ? 'fill-current' : ''}`} />
                            </button>

                            {/* Open/Watch (Explicit Button) */}
                            {youtubeId ? (
                                <button
                                    onClick={handleWatchClick}
                                    className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-error hover:border-error transition-all shadow-lg"
                                    title="Watch Video"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); window.open(link.original_url, '_blank'); }}
                                    className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background transition-all shadow-lg"
                                    title="Open Link"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}

                            {/* Details */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowDetailsModal(true); }}
                                className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg"
                                title="Details"
                            >
                                <Info className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Management Group */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}
                                className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-all shadow-lg"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* === BOTTOM: CONTENT SECTION === */}
                <div className="flex flex-col p-4 bg-surface border-t border-surface-elevated flex-grow">
                    {/* Title */}
                    <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {link.metadata.title || 'Untitled Link'}
                    </h3>

                    {/* Tags & Meta */}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                        {link.tags.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                                {link.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-md bg-surface-elevated text-foreground-muted text-[10px] font-medium border border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-[10px] text-white/20 italic">No tags</span>
                        )}

                        {/* Favorite Indicator (Small) */}
                        {link.is_favorite && (
                            <Heart className="w-3.5 h-3.5 text-warning fill-current" />
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {youtubeId && (
                <YouTubeModal
                    videoId={youtubeId}
                    isOpen={showYouTubeModal}
                    onClose={() => setShowYouTubeModal(false)}
                />
            )}

            {isImage && (
                <ImageLightbox
                    src={link.metadata.thumbnail_image || link.original_url || ''}
                    alt={link.metadata.title || 'Image'}
                    isOpen={showLightbox}
                    onClose={() => setShowLightbox(false)}
                />
            )}

            <EditLinkModal
                link={link}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />

            <LinkDetailsModal
                link={link}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
            />
        </>
    );
}
