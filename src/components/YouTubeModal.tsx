'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '@/hooks';

interface YouTubeModalProps {
    videoId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function YouTubeModal({ videoId, isOpen, onClose }: YouTubeModalProps) {
    const [mounted, setMounted] = useState(false);

    useModal({ isOpen, onClose });

    // Ensure we're mounted on client before using portal
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const content = (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-elevated hover:bg-surface text-foreground-muted hover:text-foreground transition-colors z-10"
                aria-label="Close video"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Video container */}
            <div
                className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title="YouTube Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        </div>
    );

    // Use portal to render at document body to avoid scroll position issues
    return createPortal(content, document.body);
}

