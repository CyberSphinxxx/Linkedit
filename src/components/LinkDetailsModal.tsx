'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link as LinkType } from '@/types/link';
import CollectionIcon from './CollectionIcon';
import { useCollections } from '@/context/CollectionsContext';
import { useLinks } from '@/context/LinksContext';
import { ExternalLink, X, Calendar, Hash, Folder } from 'lucide-react';

interface LinkDetailsModalProps {
    link: LinkType;
    isOpen: boolean;
    onClose: () => void;
}

export default function LinkDetailsModal({ link, isOpen, onClose }: LinkDetailsModalProps) {
    const { getCollection } = useCollections();
    const collectionData = link.collection ? getCollection(link.collection) : null;
    const [mounted, setMounted] = useState(false);

    // Ensure we're mounted on client before using portal
    useEffect(() => {
        setMounted(true);
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



    const formattedDate = new Date(link.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });


    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteContent, setNoteContent] = useState(link.note || '');
    const { updateLink } = useLinks();

    const handleSaveNote = async () => {
        try {
            await updateLink(link._id, { note: noteContent });
            setIsEditingNote(false);
        } catch (error) {
            console.error('Failed to update note', error);
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image */}
                        <div className="relative aspect-video w-full bg-surface-elevated">
                            {link.metadata.thumbnail_image ? (
                                <Image
                                    src={link.metadata.thumbnail_image}
                                    alt={link.metadata.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-surface-elevated text-foreground-muted">
                                    No Preview
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="relative p-6 -mt-12 space-y-6">
                            {/* Header Info */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    {link.metadata.favicon && (
                                        <Image
                                            src={link.metadata.favicon}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="rounded-sm"
                                            unoptimized
                                        />
                                    )}
                                    <span className="text-sm font-medium text-white/70">
                                        {link.metadata.site_name || (() => {
                                            try {
                                                return new URL(link.original_url).hostname;
                                            } catch {
                                                return link.original_url;
                                            }
                                        })()}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                                    {link.metadata.title || 'Untitled Link'}
                                </h2>
                                {link.metadata.description && (
                                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                                        {link.metadata.description}
                                    </p>
                                )}
                            </div>

                            {/* Notes Section - Editable */}
                            <div className="p-4 rounded-xl bg-surface-elevated/50 border border-white/5 group">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                                        <span className="text-primary">📝</span> My Notes
                                    </h3>
                                    {!isEditingNote && (
                                        <button
                                            onClick={() => setIsEditingNote(true)}
                                            className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                        >
                                            Edit Note
                                        </button>
                                    )}
                                </div>

                                {isEditingNote ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            placeholder="Add your thoughts..."
                                            className="w-full h-24 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-primary/50 transition-colors"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditingNote(false);
                                                    setNoteContent(link.note || '');
                                                }}
                                                className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveNote}
                                                className="px-3 py-1.5 text-xs font-medium bg-primary text-black rounded-lg hover:brightness-110 transition-colors"
                                            >
                                                Save Note
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    link.note ? (
                                        <p
                                            className="text-sm text-foreground leading-relaxed whitespace-pre-wrap cursor-pointer hover:text-white transition-colors"
                                            onClick={() => setIsEditingNote(true)}
                                        >
                                            {link.note}
                                        </p>
                                    ) : (
                                        <p
                                            className="text-sm text-foreground-muted italic cursor-pointer hover:text-white/60 transition-colors"
                                            onClick={() => setIsEditingNote(true)}
                                        >
                                            No notes added to this link. Click to add one.
                                        </p>
                                    )
                                )}
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-foreground-muted flex items-center gap-1.5">
                                        <Folder className="w-3 h-3" /> Collection
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                        <CollectionIcon name={collectionData?.icon || 'inbox'} className="w-4 h-4 text-primary" />
                                        <span>{collectionData?.name || 'Uncategorized'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-foreground-muted flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Added Date
                                    </p>
                                    <p className="text-sm text-foreground">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            {link.tags.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-foreground-muted flex items-center gap-1.5">
                                        <Hash className="w-3 h-3" /> Tags
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {link.tags.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-surface-elevated text-xs font-medium text-foreground-muted border border-white/5">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-2">
                                <a
                                    href={link.original_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-background font-bold hover:opacity-90 transition-opacity"
                                >
                                    Open Link <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
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
