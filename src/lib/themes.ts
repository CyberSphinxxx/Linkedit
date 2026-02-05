/**
 * Centralized Theme Configuration
 * 
 * To add a new theme:
 * 1. Add a new entry to the THEMES array below
 * 2. Add corresponding CSS variables in globals.css under [data-theme="your-theme-id"]
 */

import { Monitor, Moon, Sun, Waves, TreePine, Sunset, Flower2, Stars, Heart, Zap, Coffee, Snowflake, Ghost, Briefcase, Palette, Rocket, Code, CloudSun, Activity, Wind, Droplets, Grid, Terminal, Leaf, Flame, MountainSnow, Crown } from 'lucide-react';
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
    /** Whether the theme has animated elements */
    isAnimated?: boolean;
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
        previewColor: '#ffffff',
        colorScheme: 'light',
    },
    {
        id: 'oled',
        label: 'OLED Black',
        description: 'Pure black',
        icon: React.createElement(Moon, { size: 20 }),
        previewColor: '#000000',
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
    {
        id: 'synthwave',
        label: 'Synthwave',
        description: 'Neon retro',
        icon: React.createElement(Zap, { size: 20 }),
        previewColor: '#ff71ce',
        colorScheme: 'dark',
    },
    {
        id: 'coffee',
        label: 'Coffee',
        description: 'Warm brown',
        icon: React.createElement(Coffee, { size: 20 }),
        previewColor: '#d4a373',
        colorScheme: 'dark',
    },
    {
        id: 'nord',
        label: 'Nord',
        description: 'Cool snow',
        icon: React.createElement(Snowflake, { size: 20 }),
        previewColor: '#88c0d0',
        colorScheme: 'dark',
    },
    {
        id: 'dracula',
        label: 'Dracula',
        description: 'Vampire dark',
        icon: React.createElement(Ghost, { size: 20 }),
        previewColor: '#ff79c6',
        colorScheme: 'dark',
    },
    {
        id: 'slate',
        label: 'Slate',
        description: 'Professional',
        icon: React.createElement(Briefcase, { size: 20 }),
        previewColor: '#94a3b8',
        colorScheme: 'dark',
    },
    {
        id: 'chroma',
        label: 'Chroma',
        description: 'RGB Flow',
        icon: React.createElement(Palette, { size: 20 }),
        previewColor: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'nebula',
        label: 'Nebula',
        description: 'Cosmic Shift',
        icon: React.createElement(Rocket, { size: 20 }),
        previewColor: 'linear-gradient(45deg, #4b0082, #8a2be2)',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'matrix',
        label: 'Matrix',
        description: 'Digital Rain',
        icon: React.createElement(Code, { size: 20 }),
        previewColor: '#00ff00',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'sunset-flow',
        label: 'Sunset Flow',
        description: 'Moving Sky',
        icon: React.createElement(CloudSun, { size: 20 }),
        previewColor: 'linear-gradient(to top, #f97316, #9d4edd)',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'pulse',
        label: 'Pulse',
        description: 'Breathing Dark',
        icon: React.createElement(Activity, { size: 20 }),
        previewColor: '#ff0000',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'aurora',
        label: 'Aurora',
        description: 'Northern Lights',
        icon: React.createElement(Wind, { size: 20 }),
        previewColor: 'linear-gradient(to right, #00c6ff, #0072ff)',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'abyss',
        label: 'Abyss',
        description: 'Deep Ocean',
        icon: React.createElement(Droplets, { size: 20 }),
        previewColor: 'linear-gradient(to bottom, #000046, #1cb5e0)',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'cyberwire',
        label: 'Cyberwire',
        description: 'Neon Grid',
        icon: React.createElement(Grid, { size: 20 }),
        previewColor: 'linear-gradient(to bottom, #ff00cc, #333399)',
        colorScheme: 'dark',
        isAnimated: true,
    },
    {
        id: 'terminal',
        label: 'Terminal',
        description: 'Retro hacker',
        icon: React.createElement(Terminal, { size: 20 }),
        previewColor: '#33ff00',
        colorScheme: 'dark',
    },
    {
        id: 'mint',
        label: 'Mint',
        description: 'Fresh green',
        icon: React.createElement(Leaf, { size: 20 }),
        previewColor: '#6ee7b7',
        colorScheme: 'dark',
    },
    {
        id: 'amber',
        label: 'Amber',
        description: 'Warm glow',
        icon: React.createElement(Flame, { size: 20 }),
        previewColor: '#fbbf24',
        colorScheme: 'dark',
    },
    {
        id: 'glacier',
        label: 'Glacier',
        description: 'Ice cold',
        icon: React.createElement(MountainSnow, { size: 20 }),
        previewColor: '#bae6fd',
        colorScheme: 'dark',
    },
    {
        id: 'royal',
        label: 'Royal',
        description: 'Gold & noble',
        icon: React.createElement(Crown, { size: 20 }),
        previewColor: '#facc15',
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
