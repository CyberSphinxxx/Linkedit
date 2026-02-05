'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddLinkAreaProps {
    onClick: () => void;
}

export default function AddLinkArea({ onClick }: AddLinkAreaProps) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative col-span-2 md:row-span-2 h-full min-h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface border border-white/5 hover:border-primary/50 transition-all p-6 flex flex-col items-center justify-center gap-6 text-center shadow-2xl"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(68,214,44,0.03)_1px,transparent_1px),linear-gradient(-45deg,rgba(68,214,44,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon Container */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-20 h-20 rounded-3xl bg-surface border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-5px_rgba(68,214,44,0.3)] transition-all duration-300">
                    <Plus size={40} className="text-primary group-hover:scale-110 group-hover:rotate-90 transition-transform duration-500" />
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Add New Link</h3>
                <p className="text-sm text-foreground-muted max-w-[240px] mx-auto group-hover:text-foreground/80 transition-colors">
                    Save, organize, and categorize your digital discoveries instantly.
                </p>
            </div>

            {/* Shortcut Indicator */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-foreground">
                    <span className="opacity-70">PRESS</span>
                    <kbd className="font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">N</kbd>
                </div>
            </div>
        </motion.button>
    );
}
