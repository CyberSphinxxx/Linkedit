'use client';

import { useState, useEffect, useCallback } from 'react';
import { useKeyboardShortcut } from '@/hooks';
import { useSettings } from '@/context/SettingsContext';

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'favorites';
export type ViewMode = 'grid' | 'list';

export function useDashboardUI() {
    const { settings } = useSettings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [viewMode, setViewMode] = useState<ViewMode>(settings.defaultView);
    const [showCollectionsGrid, setShowCollectionsGrid] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Default to list view on mobile
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setViewMode('list');
        }
    }, []);

    // Back to top scroll logic
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const openAddModal = useCallback(() => setIsModalOpen(true), []);
    const closeAddModal = useCallback(() => setIsModalOpen(false), []);

    // Keyboard shortcut: Press 'N' to open add modal
    useKeyboardShortcut({
        key: 'n',
        onTrigger: openAddModal,
    });

    const toggleCollectionsGrid = useCallback(() => {
        setShowCollectionsGrid(prev => !prev);
    }, []);

    const toggleSortDropdown = useCallback(() => {
        setShowSortDropdown(prev => !prev);
    }, []);

    const closeSortDropdown = useCallback(() => {
        setShowSortDropdown(false);
    }, []);

    return {
        isModalOpen,
        setIsModalOpen,
        openAddModal,
        closeAddModal,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        showCollectionsGrid,
        setShowCollectionsGrid,
        toggleCollectionsGrid,
        showSortDropdown,
        toggleSortDropdown,
        closeSortDropdown,
        showBackToTop,
        scrollToTop,
    };
}
