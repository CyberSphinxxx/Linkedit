'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { THEMES, ThemeConfig } from '@/lib/themes';
import DashboardPreview from './DashboardPreview';

export default function ThemePreviewSection() {
    const [activeTheme, setActiveTheme] = useState<ThemeConfig>(THEMES[1]); // Default to Cyberpunk (index 1) or first non-system

    // Filter out system theme for preview
    const previewThemes = THEMES.filter(t => !t.isSystem);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-400"
                    >
                        Your Curated Web, Your Style.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-foreground-muted max-w-2xl mx-auto"
                    >
                        Choose from our collection of handcrafted themes or build your own.
                        Match your dashboard to your personality.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Theme Selector List */}
                    <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] lg:overflow-y-auto pr-2 scrollbar-hide">
                        {previewThemes.map((theme) => (
                            <motion.button
                                key={theme.id}
                                onClick={() => setActiveTheme(theme)}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-3 md:p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 md:gap-4 ${activeTheme.id === theme.id
                                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                                    : 'bg-surface/50 border-white/5 hover:bg-surface-elevated text-foreground-muted hover:text-foreground'
                                    }`}
                            >
                                <div
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-inner shrink-0"
                                    style={{
                                        background: theme.previewColor,
                                        color: theme.colorScheme === 'dark' ? 'white' : 'black'
                                    }}
                                >
                                    {theme.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className={`font-bold text-sm md:text-base truncate ${activeTheme.id === theme.id ? 'text-white' : ''}`}>{theme.label}</h3>
                                    <p className="text-[10px] md:text-xs opacity-70 truncate">{theme.description}</p>
                                </div>
                                {activeTheme.id === theme.id && (
                                    <div className="ml-auto w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] shrink-0" />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Live Preview Area - Hidden on mobile to save space */}
                    <div className="hidden lg:block lg:col-span-8 relative">
                        <div
                            className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 bg-background/50 flex justify-center items-center"
                            data-theme={activeTheme.id}
                        >
                            <div className="pointer-events-none select-none transform scale-[0.8] origin-center">
                                <DashboardPreview />
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-6 -z-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                        <div className="absolute -top-6 -left-6 -z-10 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
