'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

interface ImageLightboxProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
            setIsLoaded(false);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-elevated hover:bg-surface text-foreground-muted hover:text-foreground transition-colors z-10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Loading spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {/* Image container */}
            <div
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={1920}
                    height={1080}
                    className={`object-contain max-h-[90vh] rounded-lg shadow-2xl transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setIsLoaded(true)}
                    unoptimized
                    priority
                />

                {/* Caption */}
                <p className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent text-foreground text-center text-sm rounded-b-lg">
                    {alt}
                </p>
            </div>

            {/* Hint */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground-muted text-xs">
                Press ESC or click outside to close
            </p>
        </div>
    );
}
