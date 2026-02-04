'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({
    tags,
    onChange,
    placeholder = 'Add tags...',
}: TagInputProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            // Remove last tag on backspace if input is empty
            onChange(tags.slice(0, -1));
        }
    };

    const addTag = () => {
        const tag = input.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (tag && !tags.includes(tag)) {
            onChange([...tags, tag]);
        }
        setInput('');
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((t) => t !== tagToRemove));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-elevated border border-surface-elevated focus-within:border-primary/50 transition-colors">
                {/* Existing tags */}
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary"
                    >
                        #{tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
                            aria-label={`Remove tag ${tag}`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                ))}

                {/* Input */}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[100px] bg-transparent text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
                />
            </div>
            <p className="text-xs text-foreground-muted mt-1.5 ml-1">
                Press Enter to add tag
            </p>
        </div>
    );
}
