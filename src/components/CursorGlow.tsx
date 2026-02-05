'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function CursorGlow() {
    const { settings } = useSettings();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only active for sunset-flow theme and when motion is not reduced
        if (settings.theme !== 'sunset-flow' || settings.reduceMotion) {
            setIsVisible(false);
            return;
        }

        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [settings.theme, settings.reduceMotion, isVisible]);

    if (!isVisible || settings.theme !== 'sunset-flow' || settings.reduceMotion) return null;

    return (
        <div
            className="pointer-events-none fixed z-50 transition-opacity duration-500 ease-out"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                opacity: isVisible ? 1 : 0,
            }}
        >
            {/* Core Sun */}
            <div className="w-8 h-8 bg-orange-300 rounded-full blur-[8px] opacity-40 mix-blend-screen" />

            {/* Outer Glow */}
            <div className="absolute inset-0 w-32 h-32 -translate-x-12 -translate-y-12 bg-orange-500 rounded-full blur-[40px] opacity-15 mix-blend-screen" />

            {/* Halo */}
            <div className="absolute inset-0 w-64 h-64 -translate-x-28 -translate-y-28 bg-yellow-600 rounded-full blur-[60px] opacity-10 mix-blend-overlay" />
        </div>
    );
}
