'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, FileJson, FileText, Database, AlertTriangle,
    Download, Loader2, Trash2, Copy, RefreshCw
} from 'lucide-react';
import { useLinks } from '@/context/LinksContext';
import { useCollections } from '@/context/CollectionsContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import {
    parseBookmarksHTML,
    convertBookmarksToLinks,
    parseJSONExport,
    exportAsJSON,
    exportAsHTML,
    findDuplicateLinks,
    checkBrokenLinks,
} from '@/lib/dataManagement';
import { deleteAllUserData } from '@/lib/firestore';

export function DataTab() {
    const { links, addLink, removeLink, refreshLinks, updateLink } = useLinks();
    const { refreshCollections } = useCollections();
    const { user } = useAuth();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isImporting, setIsImporting] = useState(false);
    const [isCheckingBrokenLinks, setIsCheckingBrokenLinks] = useState(false);
    const [brokenLinksProgress, setBrokenLinksProgress] = useState<{ checked: number; total: number } | null>(null);
    const [isRefreshingFB, setIsRefreshingFB] = useState(false);
    const [refreshFBProgress, setRefreshFBProgress] = useState<{ checked: number; total: number } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
    const [isDeletingData, setIsDeletingData] = useState(false);
    const [storageUsage, setStorageUsage] = useState<number>(0);

    // Calculate storage usage on mount
    React.useEffect(() => {
        if (!user) {
            import('@/lib/localStorage').then(mod => {
                setStorageUsage(mod.getStorageUsage());
            });
        }
    }, [user, links]);

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const content = await file.text();
            const isJSON = file.name.endsWith('.json');

            if (isJSON) {
                const linksToAdd = parseJSONExport(content);
                if (linksToAdd.length === 0) {
                    showToast('No links found in JSON file', 'error');
                    return;
                }

                let added = 0;
                for (const link of linksToAdd) {
                    try {
                        const { _id, ...linkData } = link;
                        await addLink(linkData);
                        added++;
                    } catch {
                        // Skip duplicates or errors
                    }
                }
                showToast(`Imported ${added} of ${linksToAdd.length} links from JSON`, 'success');
            } else {
                const bookmarks = parseBookmarksHTML(content);
                if (bookmarks.length === 0) {
                    showToast('No bookmarks found in file', 'error');
                    return;
                }

                const linksToAdd = convertBookmarksToLinks(bookmarks);
                let added = 0;

                for (const link of linksToAdd) {
                    try {
                        await addLink(link);
                        added++;
                    } catch {
                        // Skip duplicates or errors
                    }
                }
                showToast(`Imported ${added} of ${linksToAdd.length} bookmarks`, 'success');
            }
        } catch (error) {
            console.error('Import error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to import file';
            showToast(errorMessage, 'error');
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [addLink, showToast]);

    const handleExportJSON = () => {
        exportAsJSON(links);
        showToast('Exported as JSON', 'success');
    };

    const handleExportHTML = () => {
        exportAsHTML(links);
        showToast('Exported as HTML bookmarks', 'success');
    };

    const handleRemoveDuplicates = async () => {
        const duplicateGroups = findDuplicateLinks(links);
        if (duplicateGroups.length === 0) {
            showToast('No duplicates found', 'success');
            return;
        }

        const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.duplicates.length, 0);
        const confirmed = window.confirm(`Found ${totalDuplicates} duplicate links. Remove them?`);
        if (!confirmed) return;

        let removed = 0;
        for (const group of duplicateGroups) {
            for (const dup of group.duplicates) {
                try {
                    await removeLink(dup._id);
                    removed++;
                } catch {
                    // Skip errors
                }
            }
        }

        showToast(`Removed ${removed} duplicate links`, 'success');
    };

    const handleDeleteAllData = async () => {
        if (!user || deleteConfirmationText !== 'DELETE ALL DATA') return;

        setIsDeletingData(true);
        try {
            await deleteAllUserData(user.uid);
            await refreshLinks();
            await refreshCollections();
            showToast('All data deleted successfully', 'success');
            setIsDeleteModalOpen(false);
            setDeleteConfirmationText('');
        } catch (error) {
            console.error('Delete all data error:', error);
            showToast('Failed to delete data', 'error');
        } finally {
            setIsDeletingData(false);
        }
    };

    const handleDeleteBrokenLinks = async () => {
        if (links.length === 0) {
            showToast('No links to check', 'error');
            return;
        }

        setIsCheckingBrokenLinks(true);
        setBrokenLinksProgress({ checked: 0, total: links.length });

        try {
            const brokenLinks = await checkBrokenLinks(links, (checked, total) => {
                setBrokenLinksProgress({ checked, total });
            });

            if (brokenLinks.length === 0) {
                showToast('No broken links found', 'success');
                return;
            }

            const confirmed = window.confirm(`Found ${brokenLinks.length} broken links. Remove them all?`);
            if (confirmed) {
                let removed = 0;
                for (const { link } of brokenLinks) {
                    try {
                        await removeLink(link._id);
                        removed++;
                    } catch {
                        // Skip errors
                    }
                }
                showToast(`Removed ${removed} broken links`, 'success');
            }
        } catch (error) {
            console.error('Broken links check error:', error);
            showToast('Failed to check broken links', 'error');
        } finally {
            setIsCheckingBrokenLinks(false);
            setBrokenLinksProgress(null);
        }
    };

    const handleRefreshFBLinks = async () => {
        const fbLinks = links.filter((l) =>
            l.original_url.includes('facebook.com') ||
            l.original_url.includes('fb.watch') ||
            l.original_url.includes('fb.com') ||
            l.original_url.includes('instagram.com') ||
            l.metadata.thumbnail_image?.includes('fbcdn.net') ||
            l.metadata.thumbnail_image?.includes('fbsbx.com') ||
            l.metadata.thumbnail_image?.includes('/api/proxy-image')
        );

        if (fbLinks.length === 0) {
            showToast('No Facebook/Instagram links found to refresh', 'success');
            return;
        }

        setIsRefreshingFB(true);
        setRefreshFBProgress({ checked: 0, total: fbLinks.length });
        let updatedCount = 0;

        try {
            for (let i = 0; i < fbLinks.length; i++) {
                const link = fbLinks[i];
                try {
                    const response = await fetch('/api/preview', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: link.original_url }),
                    });

                    if (response.ok) {
                        const preview = await response.json();
                        if (preview && preview.image && preview.image !== link.metadata.thumbnail_image) {
                            await updateLink(link._id, {
                                metadata: {
                                    ...link.metadata,
                                    thumbnail_image: preview.image,
                                    title: preview.title || link.metadata.title,
                                    description: preview.description || link.metadata.description,
                                }
                            });
                            updatedCount++;
                        }
                    }
                } catch (err) {
                    console.error('Failed to refresh link', link.original_url, err);
                }
                setRefreshFBProgress({ checked: i + 1, total: fbLinks.length });
            }

            showToast(`Refreshed ${updatedCount} links successfully`, 'success');
        } catch (error) {
            console.error('FB Refresh error:', error);
            showToast('Failed to refresh some links', 'error');
        } finally {
            setIsRefreshingFB(false);
            setRefreshFBProgress(null);
        }
    };

    return (
        <>
            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Upload size={20} className="text-primary" />
                    Export Data
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={handleExportJSON}
                        className="flex items-center gap-3 p-4 rounded-xl border border-surface-elevated hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                    >
                        <FileJson size={24} className="text-primary" />
                        <div>
                            <div className="font-medium text-foreground">Export as JSON</div>
                            <div className="text-sm text-foreground-muted">Full data backup</div>
                        </div>
                    </button>
                    <button
                        onClick={handleExportHTML}
                        className="flex items-center gap-3 p-4 rounded-xl border border-surface-elevated hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                    >
                        <FileText size={24} className="text-primary" />
                        <div>
                            <div className="font-medium text-foreground">Export as HTML</div>
                            <div className="text-sm text-foreground-muted">Browser bookmarks format</div>
                        </div>
                    </button>
                </div>
            </section>

            {!user && (
                <>
                    <div className="border-t border-surface-elevated" />
                    <section>
                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Database size={20} className="text-warning" />
                            Local Storage
                        </h2>
                        <div className="p-5 rounded-xl border border-surface-elevated bg-surface-elevated/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground">Storage Used</span>
                                <span className="text-sm font-bold text-foreground">
                                    {((storageUsage || 0) / 1024 / 1024).toFixed(2)} MB <span className="text-foreground-muted font-normal">/ 5.0 MB</span>
                                </span>
                            </div>
                            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${(storageUsage || 0) > 4.5 * 1024 * 1024 ? 'bg-error' :
                                        (storageUsage || 0) > 3 * 1024 * 1024 ? 'bg-warning' : 'bg-success'
                                        }`}
                                    style={{ width: `${Math.min(((storageUsage || 0) / (5 * 1024 * 1024)) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="mt-3 text-xs text-foreground-muted flex items-start gap-2">
                                <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                                <p>Data is saved only on this device. Clear your browser data to remove it, or Export as JSON to back it up.</p>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <div className="border-t border-surface-elevated" />

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Download size={20} className="text-accent" />
                    Import Data
                </h2>
                <button
                    onClick={handleImportClick}
                    disabled={isImporting}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-surface-elevated hover:border-accent/50 hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isImporting ? (
                        <Loader2 size={24} className="text-accent animate-spin" />
                    ) : (
                        <Download size={24} className="text-accent" />
                    )}
                    <div className="text-left">
                        <div className="font-medium text-foreground">
                            {isImporting ? 'Importing...' : 'Import Data'}
                        </div>
                        <div className="text-sm text-foreground-muted">Upload HTML bookmarks or JSON export</div>
                    </div>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,.json"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </section>

            <div className="border-t border-surface-elevated" />

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trash2 size={20} className="text-error" />
                    Cleanup
                </h2>
                <div className="space-y-3">
                    <button
                        onClick={handleRemoveDuplicates}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-surface-elevated hover:border-error/30 hover:bg-error/5 transition-all text-left"
                    >
                        <Copy size={24} className="text-error" />
                        <div>
                            <div className="font-medium text-foreground">Remove duplicate links</div>
                            <div className="text-sm text-foreground-muted">Find and delete duplicate URLs</div>
                        </div>
                    </button>
                    <button
                        onClick={handleDeleteBrokenLinks}
                        disabled={isCheckingBrokenLinks}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-surface-elevated hover:border-error/30 hover:bg-error/5 transition-all text-left disabled:opacity-50"
                    >
                        {isCheckingBrokenLinks ? (
                            <Loader2 size={24} className="text-error animate-spin" />
                        ) : (
                            <AlertTriangle size={24} className="text-error" />
                        )}
                        <div className="flex-1">
                            <div className="font-medium text-foreground">
                                {isCheckingBrokenLinks
                                    ? `Checking... ${brokenLinksProgress?.checked ?? 0}/${brokenLinksProgress?.total ?? 0}`
                                    : 'Find broken links'}
                            </div>
                            <div className="text-sm text-foreground-muted">Check and remove dead links</div>
                        </div>
                    </button>
                    <button
                        onClick={handleRefreshFBLinks}
                        disabled={isRefreshingFB}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-surface-elevated hover:border-accent/30 hover:bg-accent/5 transition-all text-left disabled:opacity-50"
                    >
                        {isRefreshingFB ? (
                            <Loader2 size={24} className="text-accent animate-spin" />
                        ) : (
                            <RefreshCw size={24} className="text-accent" />
                        )}
                        <div className="flex-1">
                            <div className="font-medium text-foreground">
                                {isRefreshingFB
                                    ? `Refreshing... ${refreshFBProgress?.checked ?? 0}/${refreshFBProgress?.total ?? 0}`
                                    : 'Refresh Facebook & Instagram Images'}
                            </div>
                            <div className="text-sm text-foreground-muted">Fix broken "No Image" thumbnails that have expired</div>
                        </div>
                    </button>
                </div>
            </section>

            <div className="border-t border-surface-elevated" />

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trash2 size={20} className="text-error" />
                    Danger Zone
                </h2>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-error/20 bg-error/5 hover:bg-error/10 hover:border-error/50 transition-all text-left group"
                >
                    <Trash2 size={24} className="text-error" />
                    <div>
                        <div className="font-medium text-error group-hover:text-red-500 transition-colors">Delete all data</div>
                        <div className="text-sm text-foreground-muted">Permanently delete all links and collections</div>
                    </div>
                </button>
            </section>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-surface border border-surface-elevated rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-error">
                                <AlertTriangle className="w-8 h-8" />
                                <h3 className="text-xl font-bold">Delete All Data?</h3>
                            </div>

                            <p className="text-foreground-muted">
                                This action cannot be undone. This will permanently delete your:
                            </p>
                            <ul className="list-disc list-inside text-sm text-foreground-muted ml-2 space-y-1">
                                <li>All saved links</li>
                                <li>All collections</li>
                                <li>All associated metadata</li>
                            </ul>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-foreground">
                                    Type <span className="font-mono font-bold select-all">DELETE ALL DATA</span> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmationText}
                                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                    placeholder="DELETE ALL DATA"
                                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-elevated focus:border-error focus:ring-1 focus:ring-error outline-none font-mono text-sm"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setDeleteConfirmationText('');
                                    }}
                                    disabled={isDeletingData}
                                    className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAllData}
                                    disabled={deleteConfirmationText !== 'DELETE ALL DATA' || isDeletingData}
                                    className="px-4 py-2 text-sm font-medium bg-error text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isDeletingData && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Delete Everything
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
