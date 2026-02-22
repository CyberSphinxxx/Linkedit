import React from 'react';
import { Palette, LayoutGrid, Database, Info } from 'lucide-react';

export type SettingsTab = 'appearance' | 'layout' | 'data' | 'about';

export interface TabConfig {
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
    description: string;
}

export const tabs: TabConfig[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette size={20} />, description: 'Theme & visual settings' },
    { id: 'layout', label: 'Layout', icon: <LayoutGrid size={20} />, description: 'Grid & card preferences' },
    { id: 'data', label: 'Data & Import', icon: <Database size={20} />, description: 'Export, import, cleanup' },
    { id: 'about', label: 'About', icon: <Info size={20} />, description: 'Version & developer info' },
];
