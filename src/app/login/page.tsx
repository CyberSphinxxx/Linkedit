'use client';

import { motion, Variants, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import HeroBackground from '@/components/HeroBackground';
import { Video, Image as ImageIcon, FileText, Link2, Zap, Shield, Smartphone, Youtube, Instagram, Twitter, Linkedin, Github, Globe, Twitch, Figma, Chrome, Slack } from 'lucide-react';

export default function LoginPage() {
    const { signInWithGoogle, user, loading } = useAuth();
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);

    // Brand Logos
    const logos = [
        { Icon: Youtube, color: "hover:text-red-500" },
        { Icon: Instagram, color: "hover:text-pink-500" },
        { Icon: Twitter, color: "hover:text-blue-400" },
        { Icon: Linkedin, color: "hover:text-blue-600" },
        { Icon: Github, color: "hover:text-white" },
        { Icon: Twitch, color: "hover:text-purple-400" },
        { Icon: Figma, color: "hover:text-purple-400" },
        { Icon: Chrome, color: "hover:text-yellow-400" },
        { Icon: Slack, color: "hover:text-amber-400" },
        { Icon: Globe, color: "hover:text-green-400" },
        // Custom Pinterest
        {
            Icon: ({ className }: { className?: string }) => (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="24" height="24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 4.99 3.166 9.255 7.6 11.171-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.65 0-5.789 2.738-5.789 5.592 0 1.108.426 2.297.96 2.942.105.128.12.242.089.375-.098.408-.316 1.289-.359 1.467-.057.236-.188.288-.432.174-1.614-.751-2.622-3.111-2.622-5.013 0-4.08 2.969-7.834 8.567-7.834 4.498 0 7.995 3.206 7.995 7.485 0 4.467-2.817 8.067-6.726 8.067-1.313 0-2.548-.683-2.972-1.492l-.813 3.097c-.294 1.132-1.092 2.55-1.626 3.414C9.453 23.868 10.702 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
            ),
            color: "hover:text-red-600"
        },
        // Custom Spotify
        {
            Icon: ({ className }: { className?: string }) => (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="24" height="24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
            ),
            color: "hover:text-green-500"
        }
    ];

    const handleGoogleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            setIsSigningIn(false);
        }
    };

    const [headlineIndex, setHeadlineIndex] = useState(0);
    const headlines = ["Access forever.", "Find instantly.", "Organize easily."];

    useEffect(() => {
        const interval = setInterval(() => {
            setHeadlineIndex((prev) => (prev + 1) % headlines.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Redirect if already logged in - MOVED BELOW HOOKS to prevent hook order violation
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [loading, user, router]);

    if (!loading && user) {
        return null;
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "circOut" } }
    };

    const floatingCardVariants: Variants = {
        animate: (i: number) => ({
            y: [0, -15, 0],
            rotate: [0, i % 2 === 0 ? 2 : -2, 0],
            transition: {
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
            }
        }),
        hover: {
            scale: 1.05,
            rotate: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
            <HeroBackground />

            {/* Left side - Branding & Features */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative z-10 glass-panel border-r border-white/5">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-surface-elevated to-surface border border-white/10 shadow-xl group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(68,214,44,0.3)] transition-all duration-300">
                            <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">LinkedIT</span>
                    </Link>
                </motion.div>

                {/* Visual Showcase */}
                <div className="relative w-full max-w-lg mx-auto py-12 perspective-1000">
                    <motion.div
                        className="relative z-10 space-y-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight h-24">
                            Save once,<br />
                            <motion.span
                                key={headlineIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="text-gradient block"
                            >
                                {headlines[headlineIndex]}
                            </motion.span>
                        </h2>
                        <p className="text-foreground-muted text-lg">
                            The intelligent bookmark manager for visual thinkers.
                        </p>

                        {/* Works With Marquee */}
                        <div className="mt-16">
                            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-6 opacity-60 pl-1">
                                Save content from anywhere
                            </p>
                            <div className="flex overflow-hidden w-full relative" style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}>
                                <motion.div
                                    className="flex gap-12 items-center flex-nowrap"
                                    animate={{ x: "-50%" }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    style={{ width: "max-content" }}
                                >
                                    {[...logos, ...logos].map((logo, i) => (
                                        <div key={i} className={`flex items-center justify-center text-foreground-muted/40 hover:text-foreground-muted ${logo.color} transition-all duration-300 hover:scale-110`}>
                                            <logo.Icon className="w-6 h-6" />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Cards Visualization */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
                        {/* Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full opacity-30" />

                        {/* Mock Card 1 - Video (Top Right) */}
                        <motion.div
                            custom={1}
                            variants={floatingCardVariants}
                            animate="animate"
                            whileHover="hover"
                            className="absolute -top-16 -right-8 w-44 p-3 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto cursor-pointer"
                            style={{ rotate: 12 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded bg-blue-500/20 text-blue-400"><Video size={14} /></div>
                                <div className="h-2 w-16 bg-white/10 rounded-full" />
                            </div>
                            <div className="h-20 rounded-lg bg-black/40 mb-2 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
                            </div>
                        </motion.div>

                        {/* Mock Card 2 - Image (Top Left) */}
                        <motion.div
                            custom={2}
                            variants={floatingCardVariants}
                            animate="animate"
                            whileHover="hover"
                            className="absolute -top-10 -left-16 w-44 p-3 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto cursor-pointer"
                            style={{ rotate: -12 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded bg-green-500/20 text-green-400"><ImageIcon size={14} /></div>
                                <div className="h-2 w-16 bg-white/10 rounded-full" />
                            </div>
                            <div className="h-20 rounded-lg bg-black/40 mb-2 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-emerald-500/20" />
                            </div>
                        </motion.div>

                        {/* Mock Card 3 - Link (Bottom Right) */}
                        <motion.div
                            custom={3}
                            variants={floatingCardVariants}
                            animate="animate"
                            whileHover="hover"
                            className="absolute top-24 -right-20 w-44 p-3 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto cursor-pointer"
                            style={{ rotate: 6 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded bg-orange-500/20 text-orange-400"><Link2 size={14} /></div>
                                <div className="h-2 w-12 bg-white/10 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-white/5 rounded-full" />
                                <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                            </div>
                            <div className="mt-3 h-14 rounded-lg bg-black/40 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-red-500/10" />
                            </div>
                        </motion.div>

                        {/* Mock Card 4 - File (Bottom Left) */}
                        <motion.div
                            custom={4}
                            variants={floatingCardVariants}
                            animate="animate"
                            whileHover="hover"
                            className="absolute top-32 -left-12 w-44 p-3 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto cursor-pointer"
                            style={{ rotate: -8 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded bg-pink-500/20 text-pink-400"><FileText size={14} /></div>
                                <div className="h-2 w-12 bg-white/10 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-white/5 rounded-full" />
                                <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                                <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-4 text-sm text-foreground-muted">
                        <div className="flex -space-x-2">
                            {/* Safe, privacy-friendly placeholder avatars */}
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center overflow-hidden
                                        ${i === 1 ? 'bg-gradient-to-tr from-blue-500 to-purple-500' : ''}
                                        ${i === 2 ? 'bg-gradient-to-tr from-green-500 to-emerald-500' : ''}
                                        ${i === 3 ? 'bg-gradient-to-tr from-orange-500 to-red-500' : ''}
                                        ${i === 4 ? 'bg-gradient-to-tr from-pink-500 to-rose-500' : ''}
                                    `}
                                />
                            ))}
                        </div>
                        <p>Join the community.</p>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center p-8 relative z-10 glass-panel lg:bg-transparent">
                {/* Mobile logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-surface-elevated to-surface border border-white/10 group-hover:border-primary/50 transition-all duration-300">
                            <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">LinkedIT</span>
                    </Link>
                </div>

                {/* Login card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative"
                >

                    <div className="relative bg-surface/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group/card">

                        {/* Animated Border Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-foreground-muted">
                                Sign in to access your collection
                            </p>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading || isSigningIn}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-50 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSigningIn ? (
                                <svg className="w-5 h-5 animate-spin text-gray-900" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            <span>Continue with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-surface/50 backdrop-blur-xl px-4 text-foreground-muted rounded-full">Or</span>
                            </div>
                        </div>

                        {/* Continue as Guest */}
                        <div>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                <span>Continue as Guest</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <p className="text-center text-xs text-foreground-muted mt-3">
                                No account needed. Data saved locally.
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-xs text-foreground-muted">
                                By signing in, you agree to our{' '}
                                <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                            </p>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-3 gap-2 mt-8 py-6 border-t border-white/5 relative z-10">
                        <div className="text-center group cursor-default">
                            <div className="w-10 h-10 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                                <Zap size={18} className="text-blue-400" />
                            </div>
                            <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold group-hover:text-blue-400 transition-colors">Fast</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="w-10 h-10 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                                <Shield size={18} className="text-green-400" />
                            </div>
                            <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold group-hover:text-green-400 transition-colors">Secure</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="w-10 h-10 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                                <Smartphone size={18} className="text-purple-400" />
                            </div>
                            <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold group-hover:text-purple-400 transition-colors">Mobile</p>
                        </div>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}



