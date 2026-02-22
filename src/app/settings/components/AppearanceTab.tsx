'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Palette, PlusCircle, Check, Heart, ShoppingBag, Grid3X3, Zap, Download } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { getThemeById } from '@/lib/themes';

export function AppearanceTab() {
    const router = useRouter();
    const { settings, updateSettings } = useSettings();

    return (
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

                    <div className="w-full sm:w-px h-px sm:h-24 bg-surface-elevated mx-0 sm:mx-2 my-4 sm:my-0" />

                    <div className="flex flex-col gap-2 min-w-0 sm:min-w-[140px] w-full sm:w-auto">
                        <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-1 text-center sm:text-left">Quick Switch</div>
                        <div className="flex justify-center sm:justify-start gap-3">
                            {['light', 'oled'].map(id => {
                                const t = getThemeById(id);
                                if (!t) return null;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => updateSettings({ theme: id as any })}
                                        title={t.label}
                                        className={`w-12 h-12 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all ${settings.theme === id
                                            ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-[0_0_15px_-3px_rgba(68,214,44,0.3)]'
                                            : 'border-surface-elevated hover:bg-surface-elevated hover:scale-105'
                                            }`}
                                        style={{ background: t.previewColor }}
                                    >
                                        {React.cloneElement(t.icon as any, {
                                            size: 18,
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
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
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
    );
}
