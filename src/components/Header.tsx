'use client';

import { useState, useRef, useEffect } from 'react';
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const logoHref = isLoggedIn ? '/dashboard' : '/';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleCollectionClick = () => {
        if (!isLoggedIn) router.push('/login');
        else if (!isOnDashboard) router.push('/dashboard');
    };



    const handleSignOut = async () => {
        setIsDropdownOpen(false);
        await signOut();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link href={logoHref} className="flex items-center gap-2.5 group">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 hidden sm:inline-block">
                        LinkedIT
                    </span>
                </Link>

                {/* Search Bar Slot - Centered & Integrated */}
                {searchBar && (
                    <div className="flex-1 max-w-lg mx-auto w-full transition-all duration-300">
                        {searchBar}
                    </div>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <nav className="flex items-center gap-1">
                        {!isOnDashboard && (
                            <button
                                onClick={handleCollectionClick}
                                className="px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface-elevated"
                            >
                                Collection
                            </button>
                        )}


                    </nav>

                    {/* Add Button - Prominent CTA */}
                    {isOnDashboard && onAddClick && (
                        <button
                            onClick={onAddClick}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-background text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Link</span>
                        </button>
                    )}

                    {/* Divider */}
                    <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                    {/* User Profile */}
                    {loading ? (
                        <div className="w-9 h-9 rounded-full bg-surface-elevated animate-pulse" />
                    ) : isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-2 p-0.5 rounded-full transition-all duration-200 ring-2 ring-transparent hover:ring-white/10 ${isDropdownOpen ? 'ring-primary/20 bg-surface-elevated' : ''}`}
                            >
                                {user?.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName || 'User'}
                                        width={36}
                                        height={36}
                                        className="rounded-full border border-white/5"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary text-sm font-bold border border-white/5">
                                        {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-60 py-2 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right z-50">
                                    <div className="px-5 py-3 border-b border-white/5">
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {user?.displayName || 'User'}
                                        </p>
                                        <p className="text-xs text-foreground-muted truncate mt-0.5">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        {/* Mobile Add Button in Dropdown */}
                                        <button
                                            onClick={onAddClick}
                                            className="sm:hidden w-full px-3 py-2 text-left text-sm text-primary hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-2.5 font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New Link
                                        </button>

                                        <button
                                            onClick={() => { setIsDropdownOpen(false); }}
                                            className="w-full px-3 py-2 text-left text-sm text-foreground-muted hover:text-foreground hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2.5 cursor-not-allowed opacity-50"
                                            title="Coming soon"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </button>

                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-3 py-2 text-left text-sm text-error/80 hover:text-error hover:bg-error/10 rounded-xl transition-colors flex items-center gap-2.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-background hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
