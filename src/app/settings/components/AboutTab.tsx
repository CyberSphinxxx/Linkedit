'use client';

import React from 'react';
import { Heart, List, AlertTriangle, ExternalLink } from 'lucide-react';
import packageInfo from '../../../../package.json';

export function AboutTab() {
    return (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between">
                    <div className="flex-1 border-b sm:border-b-0 border-surface-elevated pb-6 sm:pb-0">
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Connect</h4>
                        <div className="flex flex-wrap gap-3">
                            {/* Email */}
                            <a href="mailto:johnlemargonzales@gmail.com" className="p-3 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>

                            {/* Discord */}
                            <a href="https://discord.com/invite/74jFFFgjNT" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 00-7.651 0 11.898 11.898 0 00-.613-1.1588.077.077 0 00-.0793-.0371 19.7038 19.7038 0 00-4.8852 1.5152.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/in/john-lemar-gonzales-28011b28b" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
                                </svg>
                            </a>

                            <a href="https://github.com/CyberSphinxxx" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-surface-elevated hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]">
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
    );
}
