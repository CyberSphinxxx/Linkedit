'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles, Video, Image, Link2 } from 'lucide-react';

interface EmptyStateProps {
    searchQuery: string;
    selectedTags: string[];
    onAddClick: () => void;
}

export default function EmptyState({ searchQuery, selectedTags, onAddClick }: EmptyStateProps) {
    const isFiltered = searchQuery || selectedTags.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
        >
            <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-2xl opacity-40" />
                <div className="relative w-20 h-20 rounded-2xl bg-surface-elevated border border-white/5 flex items-center justify-center shadow-2xl">
                    {isFiltered ? (
                        <Search className="w-10 h-10 text-foreground-muted" strokeWidth={1.5} />
                    ) : (
                        <Sparkles className="w-10 h-10 text-primary" strokeWidth={1.5} />
                    )}
                </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">
                {isFiltered ? 'No links found' : 'Start Building Your Collection'}
            </h3>
            <p className="text-foreground-muted mb-8 max-w-md mx-auto leading-relaxed">
                {isFiltered
                    ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                    : 'Save videos, images, and links from across the web. Your personal archive awaits!'}
            </p>

            {!isFiltered && (
                <>
                    <button
                        onClick={onAddClick}
                        className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Link
                    </button>

                    {/* Quick Tips */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
                        {[
                            { icon: Video, title: 'Videos', desc: 'YouTube, Vimeo, TikTok' },
                            { icon: Image, title: 'Images', desc: 'Direct links, galleries' },
                            { icon: Link2, title: 'Links', desc: 'Blogs, documentation, news' },
                        ].map((tip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="p-5 rounded-2xl bg-surface-elevated/30 border border-white/5 hover:bg-surface-elevated/50 hover:border-white/10 transition-all group text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <tip.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h4>
                                <p className="text-xs text-foreground-muted">{tip.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </motion.div>
    );
}
