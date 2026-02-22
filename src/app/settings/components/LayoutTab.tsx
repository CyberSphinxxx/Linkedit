'use client';

import React from 'react';
import { Settings2, LayoutGrid, LayoutList, Grid3X3, PanelTop, List, ExternalLink, PlusCircle } from 'lucide-react';
import { useSettings, CardDensity, DefaultView } from '@/context/SettingsContext';

export function LayoutTab() {
    const { settings, updateSettings } = useSettings();

    return (
        <>
            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings2 size={20} className="text-accent" />
                    Visuals & Motion
                </h2>
                <div className="space-y-4">
                    {/* Layout Style */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
    );
}
