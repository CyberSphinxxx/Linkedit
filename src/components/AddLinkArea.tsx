'use client';

import { motion } from 'framer-motion';
import { Plus, Link as LinkIcon, Sparkles, Command } from 'lucide-react';

interface AddLinkAreaProps {
    onClick: () => void;
}

export default function AddLinkArea({ onClick }: AddLinkAreaProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-8"
        >
            <div className="flex flex-col gap-2">
                {/* Clean, pill-shaped input trigger */}
                <button
                    onClick={onClick}
                    className="group relative w-full flex items-center justify-between p-1 pr-1.5 rounded-full bg-surface border border-surface-elevated hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 outline-none"
                >
                    <div className="flex items-center gap-4 flex-1 pl-5 py-3">
                        <div className="text-primary bg-primary/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                            <Plus size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-base font-medium text-foreground-muted group-hover:text-foreground transition-colors">
                                Paste a link to save it...
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted group-hover:bg-surface-elevated/80 transition-colors">
                            <span className="text-[10px] tracking-widest uppercase opacity-70">Press</span>
                            <kbd className="font-mono bg-black/20 px-1.5 rounded text-foreground">N</kbd>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <Sparkles size={18} />
                        </div>
                    </div>
                </button>

                {/* Helper text / Sub-actions (Optional, keeps the main bar clean) */}
                <div className="px-6 flex items-center gap-6 text-xs text-foreground-muted font-medium opacity-60">
                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                        <LinkIcon size={12} /> Automatically detects metadata
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                        <Command size={12} /> CMD+V to paste
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
