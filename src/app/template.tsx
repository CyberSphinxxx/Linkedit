'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * template.tsx is the standard Next.js way to handle page transitions.
 * Unlike layout.tsx, templates re-mount on every navigation, ensuring 
 * that Framer Motion animations trigger consistently and reliably.
 * 
 * Includes stabilization for sub-pixel rendering (jitter fix).
 */
export default function Template({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
        </motion.div>
    );
}
