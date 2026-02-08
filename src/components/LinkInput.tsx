'use client';

import { useState, useCallback, ClipboardEvent, ChangeEvent } from 'react';
import { PreviewData } from '@/lib/scraper';
import { Link as LinkType } from '@/types/link';
import PreviewCard from './PreviewCard';
import LoginPromptModal from './LoginPromptModal';
import { useAuth } from '@/context/AuthContext';
import { isValidUrl } from '@/lib/utils';

interface LinkInputProps {
    onSave?: (link: Omit<LinkType, '_id'>) => void;
}

export default function LinkInput({ onSave }: LinkInputProps) {
    const { user } = useAuth();
    const [url, setUrl] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

    const handleConfirm = (tags: string[]) => {
        // Allow guests to save (LinksContext handles storage)
        // if (!user) { setShowLoginPrompt(true); return; }

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
            onSave?.(newLink);
            setUrl('');
            setPreview(null);
        }
    };

    const handleDismiss = () => {
        setPreview(null);
        setUrl('');
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Input field */}
            <div
                className={`
          relative rounded-2xl p-[2px] transition-all duration-300
          ${isFocused ? 'bg-primary' : 'bg-surface-elevated'}
        `}
            >
                <div
                    className={`
            absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300
            bg-primary
            ${isFocused ? 'opacity-30' : 'opacity-0'}
          `}
                />

                <div className="relative rounded-2xl bg-surface overflow-hidden">
                    <input
                        type="url"
                        value={url}
                        onChange={handleChange}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isLoading}
                        placeholder="Paste a link to save it to your brain..."
                        className="w-full px-6 py-5 text-lg bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {isLoading && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                                style={{ animation: 'shimmer 1.5s infinite' }}
                            />
                        </div>
                    )}

                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isLoading ? (
                            <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg
                                className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-foreground-muted'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {!preview && !isLoading && !error && (
                <p className="text-center text-foreground-muted text-sm mt-4">
                    Paste any URL • Videos, Images, Articles
                </p>
            )}

            {error && (
                <p className="text-center text-error text-sm mt-4">{error}</p>
            )}

            <PreviewCard
                data={preview}
                isLoading={isLoading}
                onConfirm={handleConfirm}
                onDismiss={handleDismiss}
            />

            <LoginPromptModal
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
            />
        </div>
    );
}
