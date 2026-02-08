'use client';

import { motion, Variants } from 'framer-motion';
import { Video, Image as ImageIcon, Link2, FileText } from 'lucide-react';

const floatingCardVariants: Variants = {
    animate: (i: number) => ({
        y: [0, -15, 0],
        rotate: [0, i % 2 === 0 ? 2 : -2, 0],
        transition: {
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
        }
    }),
    hover: {
        scale: 1.05,
        rotate: 0,
        transition: { duration: 0.2 }
    }
};

export default function HeroFloatingElements() {
    return (
        <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
            {/* --- TOP LEFT CLUSTER --- */}
            {/* Video Card (Blue) - Adjusted */}
            <motion.div
                custom={1}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-24 left-10 xl:left-24 w-40 p-3 rounded-xl bg-surface/60 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: -12 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-blue-500/20 text-blue-400"><Video size={14} /></div>
                    <div className="h-2 w-14 bg-white/10 rounded-full" />
                </div>
                <div className="h-16 rounded-lg bg-black/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
                </div>
            </motion.div>

            {/* Image Card (Rose) - Far Left */}
            <motion.div
                custom={7}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-64 left-4 xl:left-8 w-32 p-2.5 rounded-xl bg-surface/50 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: -6 }}
            >
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded bg-rose-500/20 text-rose-400"><ImageIcon size={12} /></div>
                    <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                </div>
                <div className="h-12 rounded-lg bg-black/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-red-500/20" />
                </div>
            </motion.div>

            {/* --- TOP RIGHT CLUSTER --- */}
            {/* Image Card (Green) - Adjusted */}
            <motion.div
                custom={2}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-20 right-12 xl:right-32 w-40 p-3 rounded-xl bg-surface/60 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: 10 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-green-500/20 text-green-400"><ImageIcon size={14} /></div>
                    <div className="h-2 w-12 bg-white/10 rounded-full" />
                </div>
                <div className="h-16 rounded-lg bg-black/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-emerald-500/20" />
                </div>
            </motion.div>

            {/* Video Card (Teal) - Far Right */}
            <motion.div
                custom={9}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-56 right-4 xl:right-8 w-32 p-2.5 rounded-xl bg-surface/50 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: 12 }}
            >
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded bg-teal-500/20 text-teal-400"><Video size={12} /></div>
                    <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                </div>
                <div className="h-12 rounded-lg bg-black/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-cyan-500/20" />
                </div>
            </motion.div>

            {/* --- MIDDLE SECTION --- */}
            {/* Music Card (Purple) - Left */}
            <motion.div
                custom={5}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-1/2 -translate-y-12 left-12 xl:left-40 w-36 p-3 rounded-xl bg-surface/60 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: -3 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-purple-500/20 text-purple-400"><Video size={14} /></div>
                    <div className="h-2 w-10 bg-white/10 rounded-full" />
                </div>
                <div className="h-10 rounded-lg bg-black/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20" />
                </div>
            </motion.div>

            {/* Code Card (Cyan) - Right */}
            <motion.div
                custom={6}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-1/2 -translate-y-20 right-10 xl:right-40 w-36 p-3 rounded-xl bg-surface/60 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: 8 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-400"><FileText size={14} /></div>
                    <div className="h-2 w-10 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-1">
                    <div className="h-1.5 w-full bg-white/5 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-white/5 rounded-full" />
                </div>
            </motion.div>

            {/* --- BOTTOM SECTION --- */}
            {/* Article Card (Pink) - Left */}
            <motion.div
                custom={3}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-40 left-16 xl:left-32 w-40 p-3 rounded-xl bg-surface/60 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: -8 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-pink-500/20 text-pink-400"><FileText size={14} /></div>
                    <div className="h-2 w-10 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                    <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                </div>
            </motion.div>

            {/* Link Card (Amber) - Far Left Bottom */}
            <motion.div
                custom={8}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-16 left-6 xl:left-12 w-36 p-3 rounded-xl bg-surface/50 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: 5 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-amber-500/20 text-amber-400"><Link2 size={14} /></div>
                    <div className="h-2 w-10 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                </div>
            </motion.div>

            {/* Link Card (Orange) - Right */}
            <motion.div
                custom={4}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-48 right-16 xl:right-36 w-40 p-3 rounded-xl bg-surface/60 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: 6 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-orange-500/20 text-orange-400"><Link2 size={14} /></div>
                    <div className="h-2 w-12 bg-white/10 rounded-full" />
                </div>
                <div className="h-12 rounded-lg bg-black/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-red-500/10" />
                </div>
            </motion.div>

            {/* Text Card (Indigo) - Far Right Bottom */}
            <motion.div
                custom={10}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-16 right-6 xl:right-12 w-36 p-3 rounded-xl bg-surface/50 backdrop-blur-md border border-white/10 shadow-xl"
                style={{ rotate: -7 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-indigo-500/20 text-indigo-400"><FileText size={14} /></div>
                    <div className="h-2 w-10 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                </div>
            </motion.div>

            {/* Small Accent Cards - Corners */}
            <motion.div
                custom={11}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-48 left-4 xl:left-10 w-28 p-2 rounded-lg bg-surface/40 backdrop-blur-md border border-white/10 shadow-lg"
                style={{ rotate: 15 }}
            >
                <div className="flex items-center gap-1.5 mb-1">
                    <div className="p-1 rounded bg-violet-500/20 text-violet-400"><ImageIcon size={10} /></div>
                    <div className="h-1 w-6 bg-white/10 rounded-full" />
                </div>
                <div className="h-8 rounded bg-black/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/15 to-purple-500/15" />
                </div>
            </motion.div>

            <motion.div
                custom={12}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-44 right-4 xl:right-10 w-28 p-2 rounded-lg bg-surface/40 backdrop-blur-md border border-white/10 shadow-lg"
                style={{ rotate: -9 }}
            >
                <div className="flex items-center gap-1.5 mb-1">
                    <div className="p-1 rounded bg-lime-500/20 text-lime-400"><Link2 size={10} /></div>
                    <div className="h-1 w-6 bg-white/10 rounded-full" />
                </div>
                <div className="h-8 rounded bg-black/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/15 to-green-500/15" />
                </div>
            </motion.div>

            {/* Floating Tags - Adjusted Positions */}
            <motion.div
                custom={1}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-32 left-[20%] px-3 py-1.5 rounded-full bg-primary/10 text-primary/50 text-xs font-medium border border-primary/20 opacity-60"
                style={{ rotate: -5 }}
            >
                #design
            </motion.div>

            <motion.div
                custom={2}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-40 right-[20%] px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400/50 text-xs font-medium border border-blue-500/20 opacity-60"
                style={{ rotate: 8 }}
            >
                #ai
            </motion.div>

            <motion.div
                custom={3}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-32 left-[25%] px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400/50 text-xs font-medium border border-pink-500/20 opacity-60"
                style={{ rotate: -3 }}
            >
                #memes
            </motion.div>

            <motion.div
                custom={4}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-28 right-[25%] px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400/50 text-xs font-medium border border-orange-500/20 opacity-60"
                style={{ rotate: 6 }}
            >
                #tools
            </motion.div>

            <motion.div
                custom={5}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-1/2 left-[15%] px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400/50 text-xs font-medium border border-emerald-500/20 opacity-40"
                style={{ rotate: 4 }}
            >
                #tutorials
            </motion.div>

            <motion.div
                custom={6}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-[60%] right-[15%] px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400/50 text-xs font-medium border border-yellow-500/20 opacity-40"
                style={{ rotate: -7 }}
            >
                #resources
            </motion.div>

            {/* Additional Tags - scattered */}
            <motion.div
                custom={7}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-28 left-1/3 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400/50 text-xs font-medium border border-cyan-500/20 opacity-50"
                style={{ rotate: 3 }}
            >
                #productivity
            </motion.div>

            <motion.div
                custom={8}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-36 right-1/3 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400/50 text-xs font-medium border border-violet-500/20 opacity-50"
                style={{ rotate: -4 }}
            >
                #inspiration
            </motion.div>

            <motion.div
                custom={9}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-52 left-1/4 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400/50 text-xs font-medium border border-rose-500/20 opacity-50"
                style={{ rotate: 5 }}
            >
                #dev
            </motion.div>

            <motion.div
                custom={10}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-44 right-1/4 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400/50 text-xs font-medium border border-teal-500/20 opacity-50"
                style={{ rotate: -6 }}
            >
                #bookmarks
            </motion.div>

            <motion.div
                custom={3}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-48 left-8 xl:left-16 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400/50 text-xs font-medium border border-amber-500/20 opacity-40"
                style={{ rotate: 7 }}
            >
                #videos
            </motion.div>

            <motion.div
                custom={4}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute top-56 right-8 xl:right-16 px-3 py-1.5 rounded-full bg-lime-500/10 text-lime-400/50 text-xs font-medium border border-lime-500/20 opacity-40"
                style={{ rotate: -8 }}
            >
                #articles
            </motion.div>

            <motion.div
                custom={5}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-60 left-8 xl:left-16 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400/50 text-xs font-medium border border-indigo-500/20 opacity-40"
                style={{ rotate: 2 }}
            >
                #research
            </motion.div>

            <motion.div
                custom={6}
                variants={floatingCardVariants}
                animate="animate"
                className="absolute bottom-64 right-8 xl:right-16 px-3 py-1.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400/50 text-xs font-medium border border-fuchsia-500/20 opacity-40"
                style={{ rotate: -2 }}
            >
                #images
            </motion.div>
        </div>
    );
}
