'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '@/hooks';

interface ImageLightboxProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useModal({ isOpen, onClose });

    // Ensure we're mounted on client before using portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset loaded state when closed
    if (!isOpen && isLoaded) {
        setIsLoaded(false);
    }

    if (!isOpen || !mounted) return null;

    const content = (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-elevated hover:bg-surface text-foreground-muted hover:text-foreground transition-colors z-10"
                aria-label="Close lightbox"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Loading spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {/* Image - using native img for proper sizing */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={`max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );

    // Use portal to render at document body to avoid scroll position issues
    return createPortal(content, document.body);
}

