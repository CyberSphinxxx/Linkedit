'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import { THEMES, type ThemeConfig } from '@/lib/themes';
import { ArrowLeft, Search, Check, Zap, Sparkles, Filter, ShoppingBag, Heart } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ThemeStorePage() {
    const router = useRouter();
    const { settings, updateSettings, toggleFavoriteTheme } = useSettings();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'animated' | 'static' | 'favorites'>('all');

    const filteredThemes = THEMES.filter(theme => {
        const matchesSearch = theme.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            theme.description.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (filter === 'animated') matchesFilter = !!theme.isAnimated;
        if (filter === 'static') matchesFilter = !theme.isAnimated;
        if (filter === 'favorites') matchesFilter = settings.favoriteThemes?.includes(theme.id) ?? false;

        return matchesSearch && matchesFilter;
    });

    const handleApplyTheme = (theme: ThemeConfig) => {
        updateSettings({ theme: theme.id as any });
        // Optional: show a toast or feedback
        // showToast(`Applied ${theme.label} theme`, 'success');
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-elevated">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push('/settings')}
                                className="p-3 rounded-full hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors border border-transparent hover:border-surface-elevated"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <ShoppingBag className="text-primary" />
                                    Theme Store
                                </h1>
                                <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                                    Discover your look
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto flex-1 justify-end">
                            {/* Filters - Now integrated in the top bar for desktop */}
                            <div className="hidden md:flex items-center bg-surface-elevated/50 p-1 rounded-full border border-surface-elevated">
                                {[
                                    { id: 'all', label: 'All', icon: <Filter size={14} /> },
                                    { id: 'favorites', label: 'Favorites', icon: <Heart size={14} /> },
                                    { id: 'animated', label: 'Live', icon: <Zap size={14} /> },
                                    { id: 'static', label: 'Standard', icon: <Sparkles size={14} /> },
                                ].map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFilter(f.id as any)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.id
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-foreground-muted hover:text-foreground'
                                            }`}
                                    >
                                        {f.id === 'favorites' ? (
                                            <f.icon.type {...f.icon.props} className={filter === 'favorites' ? 'fill-current' : ''} />
                                        ) : (
                                            f.icon
                                        )}
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="relative group w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-foreground-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search themes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-surface-elevated/50 border border-surface-elevated rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
                        {[
                            { id: 'all', label: 'All', icon: <Filter size={14} /> },
                            { id: 'favorites', label: 'Likes', icon: <Heart size={14} /> },
                            { id: 'animated', label: 'Live', icon: <Zap size={14} /> },
                            { id: 'static', label: 'Standard', icon: <Sparkles size={14} /> },
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${filter === f.id
                                    ? 'bg-primary text-background border-primary'
                                    : 'bg-surface-elevated/50 text-foreground-muted border-transparent hover:bg-surface-elevated hover:text-foreground'
                                    }`}
                            >
                                {f.id === 'favorites' ? (
                                    <f.icon.type {...f.icon.props} className={filter === 'favorites' ? 'fill-current' : ''} />
                                ) : (
                                    f.icon
                                )}
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredThemes.map((theme) => {
                            const isFavorite = settings.favoriteThemes?.includes(theme.id);

                            return (
                                <motion.div
                                    key={theme.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => handleApplyTheme(theme)}
                                        className={`group relative w-full flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${settings.theme === theme.id
                                            ? 'border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/20 scale-[1.02]'
                                            : 'border-surface-elevated hover:border-primary/50 hover:shadow-xl hover:-translate-y-1'
                                            }`}
                                    >
                                        {/* Preview Area */}
                                        <div
                                            className="h-40 w-full relative overflow-hidden"
                                            style={{ background: theme.previewColor }}
                                        >
                                            {/* Overlay for legibility if needed */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                            {/* Active Badge - Moved to Bottom Right inside preview */}
                                            {settings.theme === theme.id && (
                                                <div className="absolute bottom-3 right-3 bg-white text-black px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 z-10">
                                                    <Check size={10} strokeWidth={4} />
                                                    ACTIVE
                                                </div>
                                            )}

                                            {/* Favorite Button - Fixed position Top Right */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavoriteTheme(theme.id);
                                                }}
                                                className={`absolute top-3 right-3 z-30 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isFavorite
                                                    ? 'bg-white text-red-500 border-white'
                                                    : 'bg-black/20 text-white/70 border-white/10 hover:bg-black/40 hover:text-white'
                                                    }`}
                                                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                            >
                                                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
                                            </button>


                                            {/* Animated Badge */}
                                            {theme.isAnimated && (
                                                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1">
                                                    <Zap size={10} className="text-yellow-400" />
                                                    Live
                                                </div>
                                            )}

                                            {/* Theme Icon - Centered & Large */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`p-4 rounded-2xl backdrop-blur-sm shadow-2xl transition-transform duration-500 group-hover:scale-110 ${settings.theme === theme.id ? 'bg-background/90 text-primary' : 'bg-white/20 text-white'
                                                    }`}>
                                                    {React.cloneElement(theme.icon as any, { size: 40 })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-5 bg-surface flex flex-col gap-2 text-left w-full h-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {theme.label}
                                                    </div>
                                                    <div className="text-sm text-foreground-muted line-clamp-1">
                                                        {theme.description}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-foreground-muted">
                                                <span className="bg-surface-elevated px-2 py-1 rounded-md border border-white/5 uppercase tracking-wide opacity-70">
                                                    {theme.colorScheme}
                                                </span>
                                                {settings.theme === theme.id ? (
                                                    <span className="text-primary flex items-center gap-1">
                                                        Installed
                                                    </span>
                                                ) : (
                                                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                        Apply Theme <ArrowLeft size={12} className="rotate-180" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {filteredThemes.length === 0 && (
                    <div className="text-center py-24 text-foreground-muted">
                        <Heart size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No themes found matching "{searchQuery}"</p>
                        {filter === 'favorites' && <p className="text-sm mt-2">Mark themes as favorite to see them here.</p>}
                        <button
                            onClick={() => { setSearchQuery(''); setFilter('all'); }}
                            className="mt-4 text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
