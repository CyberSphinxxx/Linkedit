'use client';

import {
    Folder, FolderOpen, Briefcase, Book, Bookmark, Star, Heart, Code,
    Music, Video, Image, FileText, Globe, Link, Lightbulb, Rocket, Zap,
    Trophy, Target, Flag, Home, Users, GraduationCap, FlaskConical, Inbox,
    Gamepad2, Palette, Coffee, Camera, ShoppingBag,
    LucideIcon
} from 'lucide-react';
import { CollectionIconName } from '@/types/collection';

// Map icon names to components
const iconMap: Record<CollectionIconName, LucideIcon> = {
    'folder': Folder,
    'folder-open': FolderOpen,
    'briefcase': Briefcase,
    'book': Book,
    'bookmark': Bookmark,
    'star': Star,
    'heart': Heart,
    'code': Code,
    'music': Music,
    'video': Video,
    'image': Image,
    'file-text': FileText,
    'globe': Globe,
    'link': Link,
    'lightbulb': Lightbulb,
    'rocket': Rocket,
    'zap': Zap,
    'trophy': Trophy,
    'target': Target,
    'flag': Flag,
    'home': Home,
    'users': Users,
    'graduation-cap': GraduationCap,
    'flask-conical': FlaskConical,
    'inbox': Inbox,
    'gamepad-2': Gamepad2,
    'palette': Palette,
    'coffee': Coffee,
    'camera': Camera,
    'shopping-bag': ShoppingBag,
};

interface CollectionIconProps {
    name: string;
    size?: number;
    className?: string;
}

export default function CollectionIcon({ name, size = 16, className = '' }: CollectionIconProps) {
    const IconComponent = iconMap[name as CollectionIconName] || Folder;
    return <IconComponent size={size} className={className} />;
}

export { iconMap };
