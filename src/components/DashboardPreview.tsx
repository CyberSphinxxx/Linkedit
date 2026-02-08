'use client';

import { motion } from 'framer-motion';
import { Search, Hash, Grid3X3, List, Link2, Plus, Folder, ExternalLink, Globe, Code, PenTool, LayoutTemplate } from 'lucide-react';

export default function DashboardPreview() {
    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 perspective-2000">
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

            <motion.div
                initial={{ rotateX: 20, y: 100, opacity: 0 }}
                whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.1 }}
                className="relative bg-background border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] md:h-[700px]"
            >
                {/* Top Navigation Bar */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-12">
                        {/* Logo Area */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                                <Link2 className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-bold text-lg text-foreground tracking-tight">LinkedIT</span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-white/5 text-sm text-foreground-muted w-80">
                            <Search className="w-4 h-4" />
                            <span>Search by title or tag...</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors cursor-pointer mr-2">
                            <Grid3X3 className="w-4 h-4" />
                            <span className="text-sm font-medium">Collections</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-semibold text-sm transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>Add Link</span>
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border-2 border-background cursor-pointer" />
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-white/5 hidden md:flex flex-col bg-background">
                        <div className="p-4 space-y-6">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
                                    <span>Tags</span>
                                    <span className="bg-surface text-foreground-muted px-1.5 py-0.5 rounded text-[10px]">12</span>
                                </div>
                                <div className="px-3 py-2 bg-surface/50 rounded-lg text-foreground border-l-2 border-primary flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Grid3X3 className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-sm">All Links</span>
                                    </div>
                                </div>

                                {['design', 'development', 'inspiration', 'resources', 'tools', 'reading'].map((tag, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-surface-elevated group-hover:bg-foreground-muted" />
                                            <span>{tag}</span>
                                        </div>
                                        <span className="text-xs text-foreground-muted group-hover:text-foreground-muted">
                                            {[15, 12, 8, 6, 4, 3][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-background overflow-hidden flex flex-col">
                        {/* Stats / Filter Bar */}
                        <div className="p-6 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-surface p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-primary mb-1">
                                        <Link2 className="w-4 h-4" />
                                        <span className="font-bold text-lg">48</span>
                                    </div>
                                    <div className="text-xs text-foreground-muted font-medium">TOTAL LINKS</div>
                                </div>
                                <div className="bg-surface p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-accent mb-1">
                                        <PenTool className="w-4 h-4" />
                                        <span className="font-bold text-lg">15</span>
                                    </div>
                                    <div className="text-xs text-foreground-muted font-medium">DESIGN</div>
                                </div>
                                <div className="bg-surface p-4 rounded-xl border border-white/5 px-4 hidden lg:block">
                                    <div className="flex items-center gap-2 text-success mb-1">
                                        <Code className="w-4 h-4" />
                                        <span className="font-bold text-lg">12</span>
                                    </div>
                                    <div className="text-xs text-foreground-muted font-medium">DEV</div>
                                </div>
                                <div className="bg-surface p-4 rounded-xl border border-white/5 px-4 hidden lg:block">
                                    <div className="flex items-center gap-2 text-warning mb-1">
                                        <LayoutTemplate className="w-4 h-4" />
                                        <span className="font-bold text-lg">8</span>
                                    </div>
                                    <div className="text-xs text-foreground-muted font-medium">INSPIRATION</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-foreground">Your Links</h2>
                                    <div className="bg-surface text-foreground-muted px-3 py-1 rounded-lg text-xs font-medium border border-white/5 flex items-center gap-2 cursor-pointer">
                                        <Folder className="w-3 h-3" />
                                        All Collections
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex bg-surface rounded-lg p-1 border border-white/5">
                                        <button className="px-3 py-1 bg-surface-elevated text-foreground rounded text-xs font-medium shadow-sm">All</button>
                                        <button className="px-3 py-1 text-foreground-muted hover:text-foreground rounded text-xs font-medium transition-colors">Videos</button>
                                        <button className="px-3 py-1 text-foreground-muted hover:text-foreground rounded text-xs font-medium transition-colors">Images</button>
                                    </div>
                                    <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-white/5">
                                        <div className="p-1.5 bg-surface-elevated rounded text-foreground"><Grid3X3 className="w-3.5 h-3.5" /></div>
                                        <div className="p-1.5 text-foreground-muted"><List className="w-3.5 h-3.5" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Grid */}
                        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Card 1 - Modern UI Design */}
                                <div className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-xl">
                                    <div className="h-40 bg-white relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                <LayoutTemplate className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                            <div className="w-3 h-3 rounded-full bg-pink-500 flex items-center justify-center text-[8px] font-bold text-white">d</div>
                                            <span className="text-[10px] text-white font-medium">dribbble.com</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-primary/90 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            IMAGE
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold text-sm mb-1 truncate">Modern Dashboard UI Kit</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#design</span>
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#ui</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 - React Docs */}
                                <div className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-xl">
                                    <div className="h-40 bg-surface-elevated relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                                        <div className="text-primary font-mono text-3xl font-bold opacity-80">&lt;React /&gt;</div>

                                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                            <Globe className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] text-white font-medium">react.dev</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-primary/90 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            DOCS
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold text-sm mb-1 truncate">React Documentation - Reference</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#development</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 - Travel Plans */}
                                <div className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-xl">
                                    <div className="h-40 bg-[#e8eaed] relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-60 bg-[url('https://maps.gstatic.com/mapfiles/maps_lite/images/2x/map_sprite_v2.png')] bg-cover" />
                                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                            <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center p-0.5"><Globe className="w-full h-full text-blue-500" /></div>
                                            <span className="text-[10px] text-white font-medium">Google Maps</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-primary/90 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            MAP
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold text-sm mb-1 truncate">Japan Trip Itinerary 2024</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#travel</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4 - Tech Review */}
                                <div className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-xl hidden lg:block">
                                    <div className="h-40 bg-surface-elevated relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                        <div className="absolute bottom-3 left-3 right-3 z-20">
                                            <div className="h-1 bg-red-600 rounded-full w-2/3 mb-1" />
                                        </div>

                                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10 z-20">
                                            <ExternalLink className="w-3 h-3 text-red-500" />
                                            <span className="text-[10px] text-white font-medium">YouTube</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-20">
                                            VIDEO
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold text-sm mb-1 truncate">The Future of AI Tools - Review</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#tech</span>
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#review</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 5 - Open Source Project */}
                                <div className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-xl hidden lg:block">
                                    <div className="h-40 bg-surface-elevated relative overflow-hidden flex items-center justify-center">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full blur-xl absolute" />
                                        <Github className="w-12 h-12 text-foreground/80 relative z-10" />

                                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                            <Github className="w-3 h-3 text-white" />
                                            <span className="text-[10px] text-white font-medium">GitHub</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-primary/90 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            REPO
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold text-sm mb-1 truncate">awesome-developer-tools</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#opensource</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 6 - Article */}
                                <div className="group bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-2px] hover:shadow-xl hidden lg:block">
                                    <div className="h-40 bg-[#1e1e1e] relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-blue-500/10">
                                        <PenTool className="w-10 h-10 text-white/20" />
                                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                            <Globe className="w-3 h-3 text-blue-400" />
                                            <span className="text-[10px] text-white font-medium">medium.com</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-primary/90 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            READ
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold text-sm mb-1 truncate">10 Tips for Better Productivity</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-surface-elevated text-foreground-muted border border-white/5 text-[10px] px-1.5 py-0.5 rounded">#productivity</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Simple fallback for Github icon if lucide-react doesn't have it imported in the file properly
function Github(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    )
}
