'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroBackground from '@/components/HeroBackground';
import { ArrowLeft, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen relative overflow-hidden text-foreground">
            <HeroBackground />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <Link href="/login" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-accent/10 text-accent">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-8 text-foreground-muted">
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">1. Data Collection</h2>
                            <p>
                                We prioritize your privacy. Linkedit collects minimal data necessary for the service to function:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Authentication:</strong> If you sign in with Google, we store your email and profile picture solely for identification purposes.</li>
                                <li><strong>Guest Mode:</strong> If you use Guest Mode, 100% of your data is stored locally on your device (`localStorage`). We do not have access to it.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">2. Data Storage</h2>
                            <p>
                                For authenticated users, your bookmarks and collections are stored securely in our database (Firebase). We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Services</h2>
                            <p>
                                We use Google Firebase for authentication and database services. Their privacy policy can be found <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">here</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">4. Open Source</h2>
                            <p>
                                Linkedit is open-source software. You can inspect the code on GitHub to verify how your data is handled. We believe in transparency by design.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-white/10 text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
