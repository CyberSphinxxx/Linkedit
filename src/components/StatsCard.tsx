'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
    icon: ReactNode;
    label: string;
    value: number;
    color?: 'primary' | 'accent' | 'success' | 'warning';
    delay?: number;
}

export default function StatsCard({ icon, label, value, color = 'primary', delay = 0 }: StatsCardProps) {
    const colorClasses = {
        primary: 'from-primary/20 to-primary/5 border-primary/20',
        accent: 'from-accent/20 to-accent/5 border-accent/20',
        success: 'from-success/20 to-success/5 border-success/20',
        warning: 'from-warning/20 to-warning/5 border-warning/20',
    };

    const iconColorClasses = {
        primary: 'text-primary',
        accent: 'text-accent',
        success: 'text-success',
        warning: 'text-warning',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            className={`
        relative overflow-hidden rounded-xl p-4
        bg-gradient-to-br ${colorClasses[color]}
        border backdrop-blur-sm
        hover:scale-[1.02] transition-transform
      `}
        >
            <div className="flex items-center gap-3">
                <div className={`text-2xl ${iconColorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-foreground-muted uppercase tracking-wide">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}
