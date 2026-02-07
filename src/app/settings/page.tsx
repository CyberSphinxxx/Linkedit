'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSettings, CardDensity, DefaultView } from '@/context/SettingsContext';
import { THEMES, getThemeById, type ThemeId } from '@/lib/themes';
import { useLinks } from '@/context/LinksContext';
import { useToast } from '@/components/Toast';
import {
    ArrowLeft, Grid3X3, List, LayoutGrid, LayoutList,
    ExternalLink, Zap, Download, Upload, Trash2, Copy, FileJson, FileText, Loader2,
    AlertTriangle, Palette, Settings2, Database, PlusCircle, Check, PanelTop, ShoppingBag, Info, Heart
} from 'lucide-react';
import {
    parseBookmarksHTML,
    convertBookmarksToLinks,
    exportAsJSON,
    exportAsHTML,
    findDuplicateLinks,
    checkBrokenLinks,
} from '@/lib/dataManagement';
import packageInfo from '../../../package.json';

type SettingsTab = 'appearance' | 'layout' | 'data' | 'about';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette size={20} />, description: 'Theme & visual settings' },
    { id: 'layout', label: 'Layout', icon: <LayoutGrid size={20} />, description: 'Grid & card preferences' },
    { id: 'data', label: 'Data & Import', icon: <Database size={20} />, description: 'Export, import, cleanup' },
    { id: 'about', label: 'About', icon: <Info size={20} />, description: 'Version & developer info' },
];

export default function SettingsPage() {
    const router = useRouter();
    const { settings, updateSettings, resetSettings } = useSettings();
    const { links, addLink, removeLink } = useLinks();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
    const [isImporting, setIsImporting] = useState(false);
    const [isCheckingBrokenLinks, setIsCheckingBrokenLinks] = useState(false);
    const [brokenLinksProgress, setBrokenLinksProgress] = useState<{ checked: number; total: number } | null>(null);

    // Import handlers
    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const html = await file.text();
            const bookmarks = parseBookmarksHTML(html);

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
        } catch (error) {
            console.error('Import error:', error);
            showToast('Failed to import bookmarks', 'error');
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

        // Count total duplicates to remove
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

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-surface-elevated">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-lg hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Settings2 size={24} className="text-primary" />
                            Settings
                        </h1>
                        <p className="text-sm text-foreground-muted">Customize your experience</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <nav className="lg:w-64 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                        ? 'bg-primary/10 text-primary border border-primary/30'
                                        : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated border border-transparent'
                                        }`}
                                >
                                    <span className={activeTab === tab.id ? 'text-primary' : ''}>{tab.icon}</span>
                                    <div>
                                        <div className="font-medium text-sm">{tab.label}</div>
                                        <div className="text-xs opacity-70">{tab.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-surface border border-surface-elevated rounded-2xl p-6 space-y-8"
                        >
                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <>
                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Palette size={20} className="text-primary" />
                                            Theme
                                        </h2>
                                        <div className="bg-surface-elevated/30 border border-surface-elevated rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-6">
                                            {/* Current Theme Icon */}
                                            <div className="relative group">
                                                <div
                                                    className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center text-primary-foreground relative overflow-hidden"
                                                    style={{ background: getThemeById(settings.theme)?.previewColor || '#333' }}
                                                >
                                                    {/* Dark overlay for contrast if needed */}
                                                    <div className="absolute inset-0 bg-black/10" />

                                                    <div className="relative z-10 bg-background/20 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
                                                        {React.cloneElement(getThemeById(settings.theme)?.icon as any || <Palette />, { size: 32, className: 'text-white' })}
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-success text-success-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-background shadow-sm flex items-center gap-1">
                                                    <Check size={10} strokeWidth={4} />
                                                    Active
                                                </div>
                                            </div>

                                            <div className="flex-1 text-center sm:text-left">
                                                <div className="text-sm text-foreground-muted uppercase tracking-wider font-semibold mb-1">Current Look</div>
                                                <h3 className="text-2xl font-bold text-foreground mb-1">
                                                    {getThemeById(settings.theme)?.label || 'Unknown Theme'}
                                                </h3>
                                                <p className="text-foreground-muted mb-4 max-w-sm mx-auto sm:mx-0">
                                                    {getThemeById(settings.theme)?.description || 'Custom theme'}
                                                </p>

                                                <button
                                                    onClick={() => router.push('/themes')}
                                                    className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary/15 hover:border-primary/50 active:scale-95 transition-all"
                                                >
                                                    <ShoppingBag size={18} />
                                                    Browse Theme Store
                                                </button>
                                            </div>

                                            <div className="hidden sm:block w-px h-24 bg-surface-elevated mx-2" />

                                            <div className="hidden sm:flex flex-col gap-2 min-w-[140px]">
                                                <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-1">Quick Switch</div>
                                                <div className="flex gap-2">
                                                    {['light', 'oled'].map(id => {
                                                        const t = getThemeById(id);
                                                        if (!t) return null;
                                                        return (
                                                            <button
                                                                key={id}
                                                                onClick={() => updateSettings({ theme: id as any })}
                                                                title={t.label}
                                                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${settings.theme === id
                                                                    ? 'border-primary ring-2 ring-primary/20 scale-110'
                                                                    : 'border-surface-elevated hover:bg-surface-elevated hover:scale-105'
                                                                    }`}
                                                                style={{ background: t.previewColor }}
                                                            >
                                                                {React.cloneElement(t.icon as any, {
                                                                    size: 16,
                                                                    className: `drop-shadow-md ${t.colorScheme === 'light' ? 'text-black/70' : 'text-white'}`
                                                                })}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Favorites Section */}
                                        {settings.favoriteThemes && settings.favoriteThemes.length > 0 && (
                                            <div className="mb-6 animate-slide-up">
                                                <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <Heart size={14} className="text-primary fill-primary/20" />
                                                    Favorites
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                    {settings.favoriteThemes.map(id => {
                                                        const t = getThemeById(id);
                                                        if (!t) return null;
                                                        return (
                                                            <button
                                                                key={id}
                                                                onClick={() => updateSettings({ theme: id as any })}
                                                                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left overflow-hidden ${settings.theme === id
                                                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                                                    : 'border-surface-elevated hover:border-primary/50 hover:bg-surface-elevated'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center flex-shrink-0"
                                                                    style={{ background: t.previewColor }}
                                                                >
                                                                    {React.cloneElement(t.icon as any, {
                                                                        size: 24,
                                                                        className: `drop-shadow-md ${t.colorScheme === 'light' ? 'text-black/70' : 'text-white'}`
                                                                    })}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="font-bold text-base text-foreground leading-tight mb-0.5">{t.label}</div>
                                                                    <div className="text-xs text-foreground-muted opacity-70 group-hover:opacity-100 transition-opacity">
                                                                        {t.description}
                                                                    </div>
                                                                </div>
                                                                {settings.theme === id && (
                                                                    <div className="absolute right-3 top-3 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                    <button
                                                        onClick={() => router.push('/themes')}
                                                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-surface-elevated hover:border-foreground-muted/50 hover:bg-surface-elevated/50 transition-all text-foreground-muted hover:text-foreground h-full min-h-[80px]"
                                                    >
                                                        <PlusCircle size={24} />
                                                        <span className="text-sm font-medium">Add More</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </section>

                                    <div className="border-t border-surface-elevated" />

                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Grid3X3 size={20} className="text-primary" />
                                            Background Pattern
                                        </h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            {[
                                                { id: 'grid', label: 'Grid', desc: 'Cyberpunk', class: 'bg-pattern-grid' },
                                                { id: 'dots', label: 'Dots', desc: 'Minimal', class: 'bg-pattern-dots' },
                                                { id: 'cross', label: 'Cross', desc: 'Technical', class: 'bg-pattern-cross' },
                                                { id: 'waves', label: 'Waves', desc: 'Fluid', class: 'bg-pattern-waves' },
                                                { id: 'none', label: 'None', desc: 'Clean', class: '' },
                                            ].map((pattern) => (
                                                <button
                                                    key={pattern.id}
                                                    onClick={() => updateSettings({ backgroundPattern: pattern.id as any })}
                                                    className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${settings.backgroundPattern === pattern.id
                                                        ? 'border-primary bg-primary/10 text-foreground ring-2 ring-primary/30'
                                                        : 'border-surface-elevated hover:border-primary/30 text-foreground-muted hover:text-foreground'
                                                        }`}
                                                >
                                                    <div className={`w-full h-16 rounded-lg border border-surface-elevated/50 overflow-hidden relative ${settings.theme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                        {pattern.id !== 'none' && (
                                                            <div className={`absolute inset-0 ${pattern.class} opacity-50`} />
                                                        )}
                                                        {settings.backgroundPattern === pattern.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-6 h-6 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs font-medium">{pattern.label}</div>
                                                        <div className="text-[10px] opacity-60">{pattern.desc}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </section>



                                    <div className="border-t border-surface-elevated" />

                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Zap size={20} className="text-warning" />
                                            Automation
                                        </h2>
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-surface-elevated hover:border-warning/30 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <Download size={20} className="text-warning" />
                                                <div>
                                                    <div className="font-medium text-foreground">Auto-fetch metadata</div>
                                                    <div className="text-sm text-foreground-muted">Automatically grab title/image when pasting links</div>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.autoFetchMetadata}
                                                    onChange={(e) => updateSettings({ autoFetchMetadata: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-12 h-7 bg-surface-elevated rounded-full peer-checked:bg-warning transition-colors" />
                                                <div className="absolute left-1 top-1 w-5 h-5 bg-foreground-muted rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-background" />
                                            </div>
                                        </label>
                                    </section>
                                </>
                            )}

                            {/* Layout Tab */}
                            {activeTab === 'layout' && (
                                <>
                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Settings2 size={20} className="text-accent" />
                                            Visuals & Motion
                                        </h2>
                                        <div className="space-y-4">
                                            {/* Layout Style */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: 'masonry', label: 'Masonry', desc: 'Pinterest Style', icon: <LayoutList size={20} /> },
                                                    { id: 'strict-grid', label: 'Strict Grid', desc: 'Uniform Squares', icon: <Grid3X3 size={20} /> },
                                                ].map((layout) => (
                                                    <button
                                                        key={layout.id}
                                                        onClick={() => updateSettings({ layoutStyle: layout.id as any })}
                                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${settings.layoutStyle === layout.id
                                                            ? 'border-accent bg-accent/10 text-foreground'
                                                            : 'border-surface-elevated hover:border-accent/30 text-foreground-muted hover:text-foreground'
                                                            }`}
                                                    >
                                                        <span className={settings.layoutStyle === layout.id ? 'text-accent' : ''}>{layout.icon}</span>
                                                        <div>
                                                            <div className="font-medium text-sm">{layout.label}</div>
                                                            <div className="text-[10px] opacity-70">{layout.desc}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Corner Radius & Reduce Motion */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="p-4 rounded-xl border border-surface-elevated bg-surface-elevated/30">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="font-medium text-sm text-foreground">Corner Radius</div>
                                                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${settings.cornerRadius === 'rounded' ? 'bg-primary/20 text-primary' : 'bg-surface-elevated border border-white/10 text-foreground-muted'}`}>
                                                            {settings.cornerRadius === 'rounded' ? 'Rounded' : 'Sharp'}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 bg-surface-elevated rounded-lg p-1">
                                                        <button
                                                            onClick={() => updateSettings({ cornerRadius: 'rounded' })}
                                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${settings.cornerRadius === 'rounded'
                                                                ? 'bg-background text-foreground shadow-sm'
                                                                : 'text-foreground-muted hover:text-foreground'
                                                                }`}
                                                        >
                                                            Rounded
                                                        </button>
                                                        <button
                                                            onClick={() => updateSettings({ cornerRadius: 'sharp' })}
                                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${settings.cornerRadius === 'sharp'
                                                                ? 'bg-background text-foreground shadow-sm'
                                                                : 'text-foreground-muted hover:text-foreground'
                                                                }`}
                                                        >
                                                            Sharp
                                                        </button>
                                                    </div>
                                                </div>

                                                <label className="flex items-center justify-between p-4 rounded-xl border border-surface-elevated hover:border-warning/30 transition-colors cursor-pointer bg-surface-elevated/30">
                                                    <div className="flex items-center gap-3">
                                                        <LayoutGrid size={20} className="text-warning" />
                                                        <div>
                                                            <div className="font-medium text-sm text-foreground">Reduce Motion</div>
                                                            <div className="text-[10px] text-foreground-muted">Disable animations</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.reduceMotion}
                                                            onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-10 h-6 bg-surface-elevated border border-white/10 rounded-full peer-checked:bg-warning transition-colors" />
                                                        <div className="absolute left-1 top-1 w-4 h-4 bg-foreground-muted rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-background" />
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between p-4 rounded-xl border border-surface-elevated hover:border-primary/30 transition-colors cursor-pointer bg-surface-elevated/30">
                                                    <div className="flex items-center gap-3">
                                                        <PanelTop size={20} className="text-primary" />
                                                        <div>
                                                            <div className="font-medium text-sm text-foreground">Sticky Header</div>
                                                            <div className="text-[10px] text-foreground-muted">Keep header visible on scroll</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.stickyHeader}
                                                            onChange={(e) => updateSettings({ stickyHeader: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-10 h-6 bg-surface-elevated border border-white/10 rounded-full peer-checked:bg-primary transition-colors" />
                                                        <div className="absolute left-1 top-1 w-4 h-4 bg-foreground-muted rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-background" />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="border-t border-surface-elevated" />
                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <LayoutGrid size={20} className="text-accent" />
                                            Card Density
                                        </h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: 'comfort' as CardDensity, label: 'Comfort', desc: 'Larger cards with more detail', icon: <LayoutGrid size={24} /> },
                                                { value: 'compact' as CardDensity, label: 'Compact', desc: 'Smaller cards, more visible', icon: <LayoutList size={24} /> },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => updateSettings({ cardDensity: option.value })}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${settings.cardDensity === option.value
                                                        ? 'border-accent bg-accent/10 text-foreground'
                                                        : 'border-surface-elevated hover:border-accent/30 text-foreground-muted hover:text-foreground'
                                                        }`}
                                                >
                                                    <span className={settings.cardDensity === option.value ? 'text-accent' : ''}>{option.icon}</span>
                                                    <div>
                                                        <div className="font-medium">{option.label}</div>
                                                        <div className="text-sm opacity-70">{option.desc}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="border-t border-surface-elevated" />

                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Grid3X3 size={20} className="text-primary" />
                                            Grid Columns
                                        </h2>
                                        <div className="p-5 rounded-xl border border-surface-elevated bg-surface-elevated/30">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-foreground-muted">Cards per row (desktop)</span>
                                                <span className="text-2xl font-bold text-primary">{settings.gridColumns}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-sm text-foreground-muted font-medium">2</span>
                                                <input
                                                    type="range"
                                                    min={2}
                                                    max={4}
                                                    value={settings.gridColumns}
                                                    onChange={(e) => updateSettings({ gridColumns: Number(e.target.value) as 2 | 3 | 4 })}
                                                    className="flex-1 h-2 bg-surface-elevated rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                                                />
                                                <span className="text-sm text-foreground-muted font-medium">4</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {[2, 3, 4].map((num) => (
                                                    <button
                                                        key={num}
                                                        onClick={() => updateSettings({ gridColumns: num as 2 | 3 | 4 })}
                                                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${settings.gridColumns === num
                                                            ? 'bg-primary text-background'
                                                            : 'bg-surface-elevated text-foreground-muted hover:text-foreground'
                                                            }`}
                                                    >
                                                        {num} Columns
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <div className="border-t border-surface-elevated" />

                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <List size={20} className="text-success" />
                                            Default View
                                        </h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: 'grid' as DefaultView, label: 'Grid View', icon: <Grid3X3 size={24} /> },
                                                { value: 'list' as DefaultView, label: 'List View', icon: <List size={24} /> },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => updateSettings({ defaultView: option.value })}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${settings.defaultView === option.value
                                                        ? 'border-success bg-success/10 text-foreground'
                                                        : 'border-surface-elevated hover:border-success/30 text-foreground-muted hover:text-foreground'
                                                        }`}
                                                >
                                                    <span className={settings.defaultView === option.value ? 'text-success' : ''}>{option.icon}</span>
                                                    <span className="font-medium">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="border-t border-surface-elevated" />

                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <ExternalLink size={20} className="text-accent" />
                                            Link Behavior
                                        </h2>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-4 rounded-xl border border-surface-elevated hover:border-accent/30 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <ExternalLink size={20} className="text-accent" />
                                                    <div>
                                                        <div className="font-medium text-foreground">Open links in new tab</div>
                                                        <div className="text-sm text-foreground-muted">Links open in a new browser tab</div>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.openLinksInNewTab}
                                                        onChange={(e) => updateSettings({ openLinksInNewTab: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-12 h-7 bg-surface-elevated rounded-full peer-checked:bg-accent transition-colors" />
                                                    <div className="absolute left-1 top-1 w-5 h-5 bg-foreground-muted rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-background" />
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-4 rounded-xl border border-surface-elevated hover:border-primary/30 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <PlusCircle size={20} className="text-primary" />
                                                    <div>
                                                        <div className="font-medium text-foreground">Show Add Button</div>
                                                        <div className="text-sm text-foreground-muted">Floating button in bottom-right corner</div>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.showFloatingAddButton}
                                                        onChange={(e) => updateSettings({ showFloatingAddButton: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-12 h-7 bg-surface-elevated rounded-full peer-checked:bg-primary transition-colors" />
                                                    <div className="absolute left-1 top-1 w-5 h-5 bg-foreground-muted rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-background" />
                                                </div>
                                            </label>
                                        </div>
                                    </section>
                                </>
                            )}

                            {/* Data Tab */}
                            {activeTab === 'data' && (
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
                                                    {isImporting ? 'Importing...' : 'Import browser bookmarks'}
                                                </div>
                                                <div className="text-sm text-foreground-muted">Upload HTML bookmarks file</div>
                                            </div>
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".html,.htm"
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
                                        </div>
                                    </section>

                                    <div className="border-t border-surface-elevated" />

                                    <section>
                                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Settings2 size={20} className="text-warning" />
                                            Reset
                                        </h2>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Reset all settings to defaults?')) {
                                                    resetSettings();
                                                    showToast('Settings reset to defaults', 'success');
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 p-4 rounded-xl border border-surface-elevated hover:border-warning/30 hover:bg-warning/5 transition-all text-left"
                                        >
                                            <Settings2 size={24} className="text-warning" />
                                            <div>
                                                <div className="font-medium text-foreground">Reset settings</div>
                                                <div className="text-sm text-foreground-muted">Restore all settings to defaults</div>
                                            </div>
                                        </button>
                                    </section>
                                </>
                            )}

                            {/* About Tab */}
                            {activeTab === 'about' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center justify-center p-8 bg-surface-elevated/30 rounded-2xl border border-surface-elevated text-center relative overflow-hidden">
                                        {/* Background decoration */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                                        <div className="w-24 h-24 bg-gradient-to-br from-surface-elevated to-surface border border-white/10 rounded-2xl flex items-center justify-center shadow-xl mb-6 relative z-10">
                                            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>

                                        <h3 className="text-3xl font-bold text-foreground mb-2 relative z-10">Linkedit</h3>
                                        <p className="text-foreground-muted mb-6 relative z-10">v{packageInfo.version || '0.1.0'}</p>

                                        <div className="flex flex-wrap justify-center gap-2 relative z-10 mb-8">
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">Next.js 15</span>
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">React 19</span>
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">Tailwind CSS</span>
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">TypeScript</span>
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">Firebase</span>
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">Framer Motion</span>
                                            <span className="px-3 py-1 rounded-full bg-surface-elevated border border-white/5 text-xs font-medium text-foreground-muted">Lucide Icons</span>
                                        </div>

                                        <div className="flex gap-3 relative z-10">
                                            <a
                                                href="https://github.com/sponsors/CyberSphinxxx"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary text-primary font-medium hover:bg-primary/10 transition-all hover:scale-105"
                                            >
                                                <Heart size={16} className="fill-current" />
                                                Sponsor
                                            </a>
                                            <a
                                                href="https://github.com/CyberSphinxxx/Linkedit"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-white/5 text-foreground font-medium transition-all"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                Star Repo
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Github & Issues links */}
                                        <a
                                            href="https://github.com/CyberSphinxxx/Linkedit/issues"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col gap-1 p-4 rounded-xl border border-surface-elevated hover:border-warning/50 hover:bg-surface-elevated/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-foreground font-medium">
                                                    <AlertTriangle size={20} />
                                                    Report an Issue
                                                </div>
                                                <ExternalLink size={16} className="text-foreground-muted group-hover:text-warning transition-colors" />
                                            </div>
                                            <span className="text-sm text-foreground-muted">Found a bug? Let us know!</span>
                                        </a>

                                        <a
                                            href="https://github.com/CyberSphinxxx/Linkedit/releases"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col gap-1 p-4 rounded-xl border border-surface-elevated hover:border-success/50 hover:bg-surface-elevated/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-foreground font-medium">
                                                    <List size={20} />
                                                    Changelog & Releases
                                                </div>
                                                <ExternalLink size={16} className="text-foreground-muted group-hover:text-success transition-colors" />
                                            </div>
                                            <span className="text-sm text-foreground-muted">See what's new in v{packageInfo.version}</span>
                                        </a>
                                    </div>

                                    <div className="p-6 rounded-xl border border-surface-elevated bg-surface-elevated/20">
                                        <div className="flex flex-col md:flex-row gap-8 justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Connect</h4>
                                                <div className="flex gap-3">
                                                    <a href="https://twitter.com/CyberSphinxxx" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                                        </svg>
                                                    </a>
                                                    <a href="mailto:contact@johnlemargonzales.com" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </a>
                                                    <a href="https://github.com/CyberSphinxxx" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Credits</h4>
                                                <div className="grid grid-cols-1 gap-2 text-sm">
                                                    <div>
                                                        <div className="text-foreground-muted mb-1">Created & Developed by</div>
                                                        <div className="font-medium text-foreground text-base">John Lemar Gonzales</div>
                                                        <div className="text-xs text-primary mt-0.5">@CyberSphinxxx</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>


                    </div>
                </div>
            </main >
        </div >
    );
}
