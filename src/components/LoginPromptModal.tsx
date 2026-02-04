'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
    const { signInWithGoogle } = useAuth();
    const router = useRouter();

    if (!isOpen) return null;

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            onClose();
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-surface border border-surface-elevated rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Decorative top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 text-3xl">
                            🧠
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Save to your Brain
                        </h2>
                        <p className="text-foreground-muted text-sm leading-relaxed">
                            You need to be logged in to save links to your personal collection.
                            Join LinkedIT to start building your second brain.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleSignIn}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-neutral-800 font-medium hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
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
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full px-6 py-4 rounded-xl border border-surface-elevated text-foreground-muted font-medium hover:text-foreground transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-foreground-muted/50 mt-8 uppercase tracking-widest font-semibold">
                        One-click sign up • Secure & Free
                    </p>
                </div>
            </div>
        </div>
    );
}
