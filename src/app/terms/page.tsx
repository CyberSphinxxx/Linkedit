'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroBackground from '@/components/HeroBackground';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export default function TermsPage() {
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
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-8 text-foreground-muted">
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">1. License</h2>
                            <p>
                                Linkedit is an open-source project licensed under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions stated in the license.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">2. Usage</h2>
                            <p>
                                This service is provided "as is", without warranty of any kind. You are responsible for all activity that occurs under your account. We reserve the right to modify or terminate the service for any reason, without notice at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Conduct</h2>
                            <p>
                                You agree not to use the service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">4. Disclaimer</h2>
                            <p>
                                The authors or copyright holders shall not be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
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
