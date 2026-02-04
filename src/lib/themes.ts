/**
 * Centralized Theme Configuration
 * 
 * To add a new theme:
 * 1. Add a new entry to the THEMES array below
 * 2. Add corresponding CSS variables in globals.css under [data-theme="your-theme-id"]
 */

import { Monitor, Moon, Sun, Circle, Waves, TreePine, Sunset, Flower2, Stars, Heart } from 'lucide-react';
import React from 'react';

export interface ThemeConfig {
    /** Unique identifier used in CSS [data-theme="..."] selector */
    id: string;
    /** Display name shown in settings */
    label: string;
    /** Brief description */
    description: string;
    /** Lucide icon component */
    icon: React.ReactNode;
    /** Preview color for theme selector */
    previewColor: string;
    /** Whether this theme follows system preference */
    isSystem?: boolean;
    /** Color scheme for native elements ('light' | 'dark') */
    colorScheme: 'light' | 'dark';
}

/**
 * All available themes.
 * The first non-system theme is used as default.
 */
export const THEMES: ThemeConfig[] = [
    {
        id: 'system',
        label: 'System',
        description: 'Match device',
        icon: React.createElement(Monitor, { size: 20 }),
        previewColor: 'linear-gradient(135deg, #0a0a0f 50%, #f8fafc 50%)',
        isSystem: true,
        colorScheme: 'dark',
    },
    {
        id: 'dark',
        label: 'Cyberpunk',
        description: 'Neon & grid',
        icon: React.createElement(Moon, { size: 20 }),
        previewColor: '#00f0ff',
        colorScheme: 'dark',
    },
    {
        id: 'light',
        label: 'Light',
        description: 'Clean & bright',
        icon: React.createElement(Sun, { size: 20 }),
        previewColor: '#0284c7',
        colorScheme: 'light',
    },
    {
        id: 'oled',
        label: 'OLED Black',
        description: 'Pure black',
        icon: React.createElement(Circle, { size: 20, fill: 'currentColor' }),
        previewColor: '#00f0ff',
        colorScheme: 'dark',
    },
    {
        id: 'ocean',
        label: 'Ocean',
        description: 'Deep blue',
        icon: React.createElement(Waves, { size: 20 }),
        previewColor: '#0ea5e9',
        colorScheme: 'dark',
    },
    {
        id: 'forest',
        label: 'Forest',
        description: 'Nature green',
        icon: React.createElement(TreePine, { size: 20 }),
        previewColor: '#22c55e',
        colorScheme: 'dark',
    },
    {
        id: 'sunset',
        label: 'Sunset',
        description: 'Warm orange',
        icon: React.createElement(Sunset, { size: 20 }),
        previewColor: '#f97316',
        colorScheme: 'dark',
    },
    {
        id: 'lavender',
        label: 'Lavender',
        description: 'Soft purple',
        icon: React.createElement(Flower2, { size: 20 }),
        previewColor: '#a855f7',
        colorScheme: 'dark',
    },
    {
        id: 'midnight',
        label: 'Midnight',
        description: 'Deep purple',
        icon: React.createElement(Stars, { size: 20 }),
        previewColor: '#6366f1',
        colorScheme: 'dark',
    },
    {
        id: 'rose',
        label: 'Rose',
        description: 'Soft pink',
        icon: React.createElement(Heart, { size: 20 }),
        previewColor: '#f43f5e',
        colorScheme: 'dark',
    },
];

/** All valid theme IDs */
export type ThemeId = typeof THEMES[number]['id'];

/** Get theme config by ID */
export function getThemeById(id: string): ThemeConfig | undefined {
    return THEMES.find(t => t.id === id);
}

/** Get default theme (first non-system theme) */
export function getDefaultTheme(): ThemeConfig {
    return THEMES.find(t => !t.isSystem) ?? THEMES[1];
}

/** Check if a theme ID is valid */
export function isValidThemeId(id: string): id is ThemeId {
    return THEMES.some(t => t.id === id);
}
