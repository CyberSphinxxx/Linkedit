'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface HeaderProps {
    onAddClick?: () => void;
    searchBar?: React.ReactNode;
}

export default function Header({ onAddClick, searchBar }: HeaderProps) {
    const { user, loading, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isLoggedIn = !!user;
    const isOnDashboard = pathname === '/dashboard';

    const logoHref = isLoggedIn ? '/dashboard' : '/';

    const handleCollectionClick = () => {
        if (!isLoggedIn) {
            router.push('/login');
        } else if (!isOnDashboard) {
            router.push('/dashboard');
        }
    };

    const handleTagsClick = () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar) {
            sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-surface-elevated bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href={logoHref} className="flex items-center gap-2 flex-shrink-0">
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
                        <span className="text-xl font-bold text-gradient hidden sm:inline">LinkEdit</span>
                    </Link>

                    {/* Search bar slot */}
                    {searchBar && <div className="flex-1 max-w-md">{searchBar}</div>}

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 flex-shrink-0">
                        {!isOnDashboard && (
                            <button
                                onClick={handleCollectionClick}
                                className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                            >
                                Collection
                            </button>
                        )}

                        {isOnDashboard && (
                            <button
                                onClick={handleTagsClick}
                                className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors hidden lg:block"
                            >
                                Tags
                            </button>
                        )}

                        {/* Add button (dashboard only) */}
                        {isOnDashboard && onAddClick && (
                            <button
                                onClick={onAddClick}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary to-accent text-background hover:opacity-90 transition-opacity flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add
                            </button>
                        )}

                        {/* Auth state */}
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-surface-elevated animate-pulse" />
                        ) : isLoggedIn ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2">
                                    {user?.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                                            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                                        </div>
                                    )}
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-surface border border-surface-elevated rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="px-4 py-2 border-b border-surface-elevated">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {user?.displayName}
                                        </p>
                                        <p className="text-xs text-foreground-muted truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full px-4 py-2 text-left text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background hover:opacity-90 transition-opacity"
                            >
                                Sign In
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
