'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import Image from 'next/image';
import { Plus, Settings } from 'lucide-react';

interface HeaderProps {
    searchBar?: React.ReactNode;
    onAddClick?: () => void;
}

export default function Header({ searchBar, onAddClick }: HeaderProps) {
    const { user, loading, signOut } = useAuth();
    const { settings } = useSettings();
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

    const handleSettingsClick = () => {
        setIsDropdownOpen(false);
        router.push('/settings');
    };

    const handleSignOut = async () => {
        setIsDropdownOpen(false);
        await signOut();
        router.push('/');
    };

    return (
        <header className={`${settings.stickyHeader ? 'sticky top-0' : 'relative'} z-50 w-full transition-all duration-300 pointer-events-none`}>
            {/* The Floating Pill Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pointer-events-auto">
                <div className="w-full h-16 sm:h-20 rounded-2xl bg-surface/80 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-300">

                    {/* Logo Section */}
                    <Link href={logoHref} className="flex items-center gap-3 group shrink-0">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-surface-elevated to-surface border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(68,214,44,0.3)] transition-all duration-300">
                            <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 hidden sm:inline-block">
                            LinkedIT
                        </span>
                    </Link>

                    {/* Spacer to push content right */}
                    <div className="flex-1" />

                    {/* Search Bar Slot - Centered & Integrated */}
                    {searchBar && (
                        <div className="w-full max-w-sm md:max-w-md mr-2 transition-all duration-300">
                            {/* The customized styling for the search input should be done in the parent or via global CSS targeting this slot, 
                                but we ensure the container is centered and spaced. */}
                            {searchBar}
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Add Link Button */}
                        {onAddClick && (
                            <button
                                onClick={onAddClick}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-background font-bold text-sm hover:opacity-90 hover:shadow-[0_0_15px_-3px_rgba(68,214,44,0.4)] transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" strokeWidth={2.5} />
                                <span className="hidden sm:inline">Add Link</span>
                            </button>
                        )}

                        {/* Navigation Items */}
                        <nav className="flex items-center gap-1 hidden md:flex">
                            {!isOnDashboard && (
                                <button
                                    onClick={handleCollectionClick}
                                    className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-white/5 rounded-xl transition-all"
                                >
                                    Collection
                                </button>
                            )}
                        </nav>

                        {/* Divider - Only show if we have nav items or if we want visual separation before profile */}
                        {!isOnDashboard && <div className="h-8 w-px bg-white/10 hidden sm:block mx-1"></div>}

                        {/* User Profile */}
                        {loading ? (
                            <div className="w-10 h-10 rounded-full bg-surface-elevated animate-pulse border border-white/5" />
                        ) : isLoggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`flex items-center justify-center p-0.5 rounded-full transition-all duration-300 ring-2 ${isDropdownOpen ? 'ring-primary border-transparent' : 'ring-transparent hover:ring-white/20'}`}
                                >
                                    {user?.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            width={40}
                                            height={40}
                                            className="rounded-full border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-primary text-sm font-bold border border-white/10 hover:border-primary/50 transition-colors">
                                            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                                        </div>
                                    )}
                                </button>

                                {/* Floating Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-4 w-60 p-2 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right z-50">

                                        {/* User Info Header */}
                                        <div className="px-4 py-3 mb-2 bg-surface-elevated/50 rounded-xl border border-white/5">
                                            <p className="text-sm font-bold text-foreground truncate">
                                                {user?.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-foreground-muted truncate mt-0.5 opacity-80">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {/* Settings button removed from here since it's now in the header bar, 
                                                but can keep it for mobile or just keep it as duplicate? 
                                                Let's keep it but maybe rename "Settings" to "Preferences" or just keep as is.
                                                Actually, redundancy is fine for dropdowns. */}
                                            <button
                                                onClick={handleSettingsClick}
                                                className="w-full px-3 py-2.5 text-left text-sm text-foreground-muted hover:text-foreground hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 group"
                                            >
                                                <Settings className="w-4.5 h-4.5 group-hover:text-primary transition-colors" />
                                                Settings
                                            </button>

                                            <button
                                                onClick={handleSignOut}
                                                className="w-full px-3 py-2.5 text-left text-sm text-error/80 hover:text-error hover:bg-error/10 rounded-xl transition-all flex items-center gap-3 group"
                                            >
                                                <svg className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-primary text-background hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
