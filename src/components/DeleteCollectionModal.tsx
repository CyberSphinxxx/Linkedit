'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Collection } from '@/types/collection';

interface DeleteCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    collection: Collection | null;
}

export default function DeleteCollectionModal({
    isOpen,
    onClose,
    onConfirm,
    collection
}: DeleteCollectionModalProps) {
    const [inputValue, setInputValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setInputValue('');
            setIsDeleting(false);
        }
    }, [isOpen]);

    if (!collection) return null;

    const handleConfirm = async () => {
        if (inputValue !== collection.name) return;

        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Failed to delete collection', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md bg-surface border border-error/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-surface-elevated flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-error flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Delete Collection
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-foreground-muted hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-foreground-muted">
                                Are you sure you want to delete <span className="font-semibold text-foreground">{collection.name}</span>? This action cannot be undone.
                            </p>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                                    Type <span className="select-all text-foreground font-mono bg-surface-elevated px-1 py-0.5 rounded">{collection.name}</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={collection.name}
                                    className="w-full px-3 py-2 bg-background border border-surface-elevated rounded-lg focus:border-error focus:ring-1 focus:ring-error outline-none transition-all placeholder:text-foreground-muted/30"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-surface-elevated/30 border-t border-surface-elevated flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={inputValue !== collection.name || isDeleting}
                                className="px-4 py-2 text-sm font-medium bg-error text-white rounded-lg hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete Forever
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
