'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    ReactNode,
} from 'react';
import { THEMES, getThemeById, isValidThemeId, type ThemeId } from '@/lib/themes';

export type ThemePreference = ThemeId;
export type CardDensity = 'comfort' | 'compact';
export type DefaultView = 'grid' | 'list';
export type BackgroundPattern = 'none' | 'grid' | 'dots' | 'cross' | 'waves';
export type LayoutStyle = 'masonry' | 'strict-grid';
export type CornerRadius = 'sharp' | 'rounded';

export interface Settings {
    theme: ThemePreference;
    cardDensity: CardDensity;
    defaultView: DefaultView;
    openLinksInNewTab: boolean;
    backgroundPattern: BackgroundPattern;
    layoutStyle: LayoutStyle;
    cornerRadius: CornerRadius;
    reduceMotion: boolean;
    autoFetchMetadata: boolean;
    gridColumns: 2 | 3 | 4;
    showFloatingAddButton: boolean;
    stickyHeader: boolean;
    favoriteThemes: string[];
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => void;
    resetSettings: () => void;
    toggleFavoriteTheme: (themeId: string) => void;
}

const DEFAULT_SETTINGS: Settings = {
    theme: 'dark',
    cardDensity: 'comfort',
    defaultView: 'grid',
    openLinksInNewTab: true,
    backgroundPattern: 'grid',
    layoutStyle: 'masonry',
    cornerRadius: 'rounded',
    reduceMotion: false,
    autoFetchMetadata: true,
    gridColumns: 3,
    showFloatingAddButton: true,
    stickyHeader: true,
    favoriteThemes: [],
};

const STORAGE_KEY = 'linkedit-settings';

const SettingsContext = createContext<SettingsContextType | null>(null);

// Helper to get resolved theme (handles 'system' preference)
function getResolvedTheme(themeId: ThemePreference): string {
    if (themeId === 'system') {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark';
    }
    return themeId;
}

// Apply theme to document
function applyTheme(themeId: ThemePreference) {
    if (typeof document !== 'undefined') {
        const resolved = getResolvedTheme(themeId);
        document.documentElement.setAttribute('data-theme', resolved);

        // Get color scheme from theme config
        const themeConfig = getThemeById(resolved);
        const colorScheme = themeConfig?.colorScheme ?? 'dark';
        document.documentElement.style.colorScheme = colorScheme;
    }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);

                // DATA MIGRATION: Convert boolean showGrid to string backgroundPattern
                // This handles legacy settings from before the update
                if ('showGrid' in parsed && !parsed.backgroundPattern) {
                    parsed.backgroundPattern = parsed.showGrid ? 'grid' : 'none';
                    delete parsed.showGrid;
                }

                // Validate theme ID from storage
                if (parsed.theme && !isValidThemeId(parsed.theme)) {
                    parsed.theme = 'dark'; // Fallback to default if invalid
                }

                // Ensure new defaults are present for existing users
                const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
                setSettings(mergedSettings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
        setIsHydrated(true);
    }, []);

    // Apply theme whenever settings change
    useEffect(() => {
        if (isHydrated) {
            applyTheme(settings.theme);
        }
    }, [settings.theme, isHydrated]);

    // Listen for system theme changes when using 'system' preference
    useEffect(() => {
        if (settings.theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings.theme]);

    // Persist settings to localStorage
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (error) {
                console.error('Failed to save settings:', error);
            }
        }
    }, [settings, isHydrated]);

    const updateSettings = useCallback((updates: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
    }, []);

    const toggleFavoriteTheme = useCallback((themeId: string) => {
        setSettings(prev => {
            const favorites = prev.favoriteThemes || [];
            const isFavorite = favorites.includes(themeId);
            const newFavorites = isFavorite
                ? favorites.filter(id => id !== themeId)
                : [...favorites, themeId];

            return { ...prev, favoriteThemes: newFavorites };
        });
    }, []);

    const contextValue = useMemo(() => ({
        settings,
        updateSettings,
        resetSettings,
        toggleFavoriteTheme,
    }), [settings, updateSettings, resetSettings, toggleFavoriteTheme]);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
