'use client';

import { motion } from 'framer-motion';
import { Search, Hash, Grid3X3, List, MoreVertical, Link2, Image as ImageIcon, Video, FileText } from 'lucide-react';

export default function DashboardPreview() {
    return (
        <div className="relative w-full max-w-5xl mx-auto mt-24 mb-24 px-4 perspective-2000">
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ rotateX: 20, y: 100, opacity: 0 }}
                whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                className="relative bg-background border border-surface-elevated rounded-xl shadow-2xl overflow-hidden"
            >
                {/* Mock Header */}
                <div className="h-14 border-b border-surface-elevated flex items-center justify-between px-4 bg-surface/50 backdrop-blur-sm">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg hidden sm:block">LinkedIT</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated text-sm text-foreground-muted w-64">
                            <Search className="w-4 h-4" />
                            <span>Search links...</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-elevated animate-pulse" />
                    </div>
                </div>

                <div className="flex h-[500px]">
                    {/* Mock Sidebar */}
                    <div className="w-56 border-r border-surface-elevated p-4 hidden md:block bg-surface/30">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="px-2 py-1 text-xs font-semibold text-foreground-muted uppercase tracking-wider">Tags</div>
                                {['Design', 'Development', 'Inspiration', 'Resources', 'Tutorials'].map((tag, i) => (
                                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground-muted rounded-lg border border-transparent">
                                        <Hash className="w-3 h-3" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mock Grid */}
                    <div className="flex-1 p-6 bg-grid">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Your Links</h2>
                            <div className="flex gap-2">
                                <div className="p-1.5 rounded-lg bg-surface-elevated border border-white/5"><Grid3X3 className="w-4 h-4" /></div>
                                <div className="p-1.5 rounded-lg text-foreground-muted"><List className="w-4 h-4" /></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Card 1 - Video */}
                            <div className="rounded-xl border border-surface-elevated bg-surface overflow-hidden hover:border-primary/50 transition-colors">
                                <div className="aspect-video bg-surface-elevated relative group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                                            <Video className="w-5 h-5" />
                                        </div>
                                    </div>
                                    {/* Mock thumbnail gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-3/4 bg-surface-elevated rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-surface-elevated/50 rounded" />
                                </div>
                            </div>

                            {/* Card 2 - Image */}
                            <div className="rounded-xl border border-surface-elevated bg-surface overflow-hidden hover:border-primary/50 transition-colors">
                                <div className="aspect-video bg-surface-elevated relative">
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" /> Image
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-2/3 bg-surface-elevated rounded mb-2" />
                                    <div className="flex gap-1 mt-2">
                                        <div className="h-5 w-12 bg-primary/10 rounded-full" />
                                        <div className="h-5 w-16 bg-primary/10 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 - Article */}
                            <div className="rounded-xl border border-surface-elevated bg-surface overflow-hidden hover:border-primary/50 transition-colors">
                                <div className="aspect-video bg-surface-elevated relative">
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> Article
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/10 to-red-500/10" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-full bg-surface-elevated rounded mb-2" />
                                    <div className="h-3 w-5/6 bg-surface-elevated/50 rounded" />
                                </div>
                            </div>

                            {/* Card 4 - Hidden on small */}
                            <div className="rounded-xl border border-surface-elevated bg-surface overflow-hidden hover:border-primary/50 transition-colors hidden lg:block">
                                <div className="aspect-video bg-surface-elevated relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-1/2 bg-surface-elevated rounded mb-2" />
                                </div>
                            </div>

                            {/* Card 5 - Hidden on small */}
                            <div className="rounded-xl border border-surface-elevated bg-surface overflow-hidden hover:border-primary/50 transition-colors hidden lg:block">
                                <div className="aspect-video bg-surface-elevated relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-rose-500/10" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-3/4 bg-surface-elevated rounded mb-2" />
                                </div>
                            </div>

                            {/* Card 6 - Hidden on small */}
                            <div className="rounded-xl border border-surface-elevated bg-surface overflow-hidden hover:border-primary/50 transition-colors hidden lg:block">
                                <div className="aspect-video bg-surface-elevated relative">
                                    <div className="absolute inset-0 bg-gradient-to-bl from-yellow-500/10 to-amber-500/10" />
                                </div>
                                <div className="p-3">
                                    <div className="h-4 w-2/3 bg-surface-elevated rounded mb-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
