'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const { signInWithGoogle, user, loading } = useAuth();
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);

    // Redirect if already logged in
    if (!loading && user) {
        router.push('/dashboard');
        return null;
    }

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

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Branding & Features */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-background via-surface to-background relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl animate-pulse"
                        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', opacity: 0.15 }}
                    />
                    <div
                        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
                        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', opacity: 0.1, animationDelay: '1s' }}
                    />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-grid opacity-30" />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                        <svg
                            className="w-6 h-6 text-background"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-gradient">LinkEdit</span>
                </Link>

                {/* Features showcase */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                            Your Second Brain<br />
                            <span className="text-gradient">for the Internet</span>
                        </h2>
                        <p className="text-foreground-muted text-lg max-w-md">
                            Save links, tag them, and find them instantly. Never lose that amazing article again.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="space-y-4">
                        {[
                            { icon: '🔗', title: 'Auto-extract metadata', desc: 'Thumbnails, titles, and descriptions' },
                            { icon: '🏷️', title: 'Smart tagging', desc: 'Organize with custom tags' },
                            { icon: '🔍', title: 'Instant search', desc: 'Find anything in seconds' },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-surface-elevated hover:border-primary/30 transition-colors group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-foreground-muted">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonial / Social proof */}
                <div className="relative z-10">
                    <p className="text-foreground-muted text-sm">
                        ✨ Free & Open Source
                    </p>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center p-8 bg-background relative">
                {/* Mobile background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div
                        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
                        style={{ background: 'var(--primary)', opacity: 0.1 }}
                    />
                    <div
                        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
                        style={{ background: 'var(--accent)', opacity: 0.1 }}
                    />
                </div>

                {/* Mobile logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-background"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gradient">LinkEdit</span>
                    </Link>
                </div>

                {/* Login card */}
                <div className="w-full max-w-md relative z-10">
                    {/* Decorative gradient ring */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-xl" />

                    <div className="relative bg-surface/80 backdrop-blur-xl border border-surface-elevated rounded-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                                <svg
                                    className="w-8 h-8 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-foreground-muted">
                                Sign in to access your collection
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-elevated" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-surface px-4 text-foreground-muted">Continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading || isSigningIn}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-gray-800 font-medium hover:bg-gray-50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isSigningIn ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-center text-xs text-foreground-muted mt-6">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-primary hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
