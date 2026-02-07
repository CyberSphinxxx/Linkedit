'use client';

import { motion } from 'framer-motion';
import { Collection } from '@/types/collection';
import { useLinks } from '@/context/LinksContext';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface CollectionsGridProps {
    collections: Collection[];
    onSelectCollection: (collectionId: string) => void;
    selectedCollectionId?: string | null;
}

export default function CollectionsGrid({ collections, onSelectCollection, selectedCollectionId }: CollectionsGridProps) {
    const { links } = useLinks();

    // Helper to get icon component
    const getIcon = (iconName: string) => {
        // @ts-ignore - Dynamic icon access
        const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1)] as LucideIcon;
        return Icon || Icons.Folder;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {collections.map((collection, index) => {
                const Icon = getIcon(collection.icon);
                const linkCount = links.filter(l => l.collection === collection._id).length;
                const isSelected = selectedCollectionId === collection._id;

                return (
                    <motion.div
                        key={collection._id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`group relative flex flex-col p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden
                            ${isSelected
                                ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10'
                                : 'bg-surface border-surface-elevated hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
                            }`}
                        onClick={() => onSelectCollection(collection._id)}
                    >
                        {/* Background Gradient for selected state */}
                        {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                        )}

                        <div className="relative z-10 flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-surface-elevated text-primary group-hover:bg-primary group-hover:text-white'} transition-colors duration-200`}>
                                <Icon size={24} />
                            </div>
                            <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${isSelected ? 'bg-primary/20 text-primary' : 'bg-surface-elevated text-foreground-muted group-hover:text-foreground'} transition-colors`}>
                                {linkCount} {linkCount === 1 ? 'Link' : 'Links'}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className={`font-bold text-lg mb-1 leading-tight ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'} transition-colors`}>
                                {collection.name}
                            </h3>
                            <p className="text-xs text-foreground-muted line-clamp-2">
                                Created {new Date(collection.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Hover effect bottom bar */}
                        <div className={`absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 ${isSelected ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </motion.div>
                );
            })}
        </div>
    );
}
