'use client';

import { motion } from 'framer-motion';
import { Tag, Zap, Shield, Smartphone, Globe, Layout, Search } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function BentoGrid() {
    return (
        <section className="py-12 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="space-y-4"
            >
                <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-10 sm:mb-16">
                    Everything you need to <span className="text-gradient">curate your web</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min md:auto-rows-[300px]">
                    {/* Card 1: Visual Previews (Large) */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-surface border border-surface-elevated hover:border-primary/50 transition-colors p-8 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <Layout className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Visual Gallery View</h3>
                            <p className="text-foreground-muted">Forget boring lists. See your links as rich cards with auto-generated thumbnails and titles.</p>
                        </div>
                        {/* Visual element */}
                        <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-surface-elevated rounded-tl-3xl border-t border-l border-white/5 opacity-50 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
                            <div className="grid grid-cols-2 gap-4 p-4">
                                <div className="bg-surface rounded-lg h-24 w-full animate-pulse" />
                                <div className="bg-surface rounded-lg h-24 w-full animate-pulse delay-100" />
                                <div className="bg-surface rounded-lg h-24 w-full animate-pulse delay-200" />
                                <div className="bg-surface rounded-lg h-24 w-full animate-pulse delay-300" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Smart Tagging */}
                    <motion.div
                        variants={itemVariants}
                        className="relative group overflow-hidden rounded-3xl bg-surface border border-surface-elevated hover:border-accent/50 transition-colors p-8 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent">
                                <Tag className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Smart Tagging</h3>
                            <p className="text-foreground-muted">Organize with flexible tags. Filter and search instantly.</p>
                        </div>
                        {/* Floating tags visual */}
                        <div className="absolute bottom-4 right-4 flex flex-wrap gap-2 justify-end opacity-50 group-hover:opacity-80 transition-opacity">
                            <span className="bg-surface-elevated px-2 py-1 rounded text-xs border border-white/5">#design</span>
                            <span className="bg-surface-elevated px-2 py-1 rounded text-xs border border-white/5">#dev</span>
                            <span className="bg-surface-elevated px-2 py-1 rounded text-xs border border-white/5">#reading</span>
                        </div>
                    </motion.div>

                    {/* Card 3: Local First */}
                    <motion.div
                        variants={itemVariants}
                        className="relative group overflow-hidden rounded-3xl bg-surface border border-surface-elevated hover:border-success/50 transition-colors p-8 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 text-success">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Privacy First</h3>
                            <p className="text-foreground-muted">Start as a guest. Data stays in your browser until you choose to sync.</p>
                        </div>
                    </motion.div>

                    {/* Card 4: Search (Large) */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-surface border border-surface-elevated hover:border-warning/50 transition-colors p-8 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tl from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 max-w-md">
                            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 text-warning">
                                <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Instant Search</h3>
                            <p className="text-foreground-muted">Find that one article from 3 months ago in milliseconds. Search by title, tag, or description.</p>
                        </div>
                        {/* Search visual */}
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block group-hover:scale-110 transition-transform duration-500">
                            <div className="w-64 bg-surface-elevated rounded-xl p-4 border border-white/5 shadow-2xl">
                                <div className="h-4 w-32 bg-foreground/20 rounded mb-4" />
                                <div className="space-y-2">
                                    <div className="h-10 w-full bg-surface rounded-lg border border-white/5 flex items-center px-3">
                                        <Search className="w-4 h-4 text-foreground-muted mr-2" />
                                        <div className="h-2 w-24 bg-foreground/10 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
