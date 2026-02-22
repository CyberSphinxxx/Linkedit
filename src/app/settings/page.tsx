'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Settings2, Menu, X, Check } from 'lucide-react';
import { tabs, SettingsTab } from './components/config';

import { AppearanceTab } from './components/AppearanceTab';
import { LayoutTab } from './components/LayoutTab';
import { DataTab } from './components/DataTab';
import { AboutTab } from './components/AboutTab';

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-[100] bg-surface/80 backdrop-blur-md border-b border-surface-elevated">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 rounded-lg hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Settings2 size={24} className="text-primary" />
                                <span className="hidden xs:inline">Settings</span>
                                <span className="xs:hidden">Settings</span>
                            </h1>
                            <p className="text-sm text-foreground-muted hidden sm:block">Customize your experience</p>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2.5 rounded-xl bg-surface-elevated border border-white/5 text-primary shadow-sm hover:scale-110 active:scale-95 transition-all"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-surface border-b border-surface-elevated overflow-hidden z-[99] shadow-2xl"
                        >
                            <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all ${activeTab === tab.id
                                            ? 'bg-primary/10 text-primary border border-primary/20'
                                            : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated border border-transparent'
                                            }`}
                                    >
                                        <div className={`p-2.5 rounded-xl ${activeTab === tab.id ? 'bg-primary text-background' : 'bg-surface-elevated text-foreground-muted'}`}>
                                            {React.cloneElement(tab.icon as any, { size: 24 })}
                                        </div>
                                        <div>
                                            <div className={`font-bold text-base ${activeTab === tab.id ? 'text-primary' : 'text-foreground'}`}>{tab.label}</div>
                                            <div className="text-xs opacity-70">{tab.description}</div>
                                        </div>
                                        {activeTab === tab.id && <Check size={18} className="ml-auto text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    {/* Desktop Sidebar Navigation */}
                    <nav className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-2 text-primary">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap min-w-max lg:min-w-0 ${activeTab === tab.id
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-surface border border-surface-elevated rounded-2xl p-4 sm:p-6 space-y-6 sm:space-y-8"
                        >
                            {activeTab === 'appearance' && <AppearanceTab />}
                            {activeTab === 'layout' && <LayoutTab />}
                            {activeTab === 'data' && <DataTab />}
                            {activeTab === 'about' && <AboutTab />}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
