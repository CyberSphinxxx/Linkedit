'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Deep space background */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20"
            />
            <motion.div
                animate={{
                    x: [0, -50, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] opacity-20"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"
                style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />

            {/* Floating Particles - Only render on client with suppressed hydration warning for random values if necessary, 
                but here we use simple initial values and animate to random. 
                Actually, simpler fix: use an empty array initially and populate in useEffect, OR justify mismatch suppression.
                
                Better approach: Client-side only rendering for particles.
            */}
            <ParticleContainer />
        </div>
    );
}

function ParticleContainer() {
    return (
        <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
                <Particle key={i} />
            ))}
        </div>
    );
}

function Particle() {
    // Random values generated on render will cause hydration mismatch.
    // We must generate them in useEffect or use a stable seed.
    // Using simple stable initial state then animating to random is another way.

    // For this fix, let's use the standard "useEffect to set mounted" trick or just suppress hydration warning if it's purely visual.
    // However, suppressHydrationWarning doesn't work deep in the tree easily.

    // Let's use the robust "useEffect" approach to generate random values.
    const [style, setStyle] = useState({
        x: 0,
        y: 0,
        scale: 0,
        duration: 0,
        size: 0
    });

    useEffect(() => {
        setStyle({
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 10 + 10,
            size: Math.random() * 4 + 1
        });
    }, []);

    if (!style.duration) return null; // Don't render until hydrated with random values

    return (
        <motion.div
            className="absolute bg-white rounded-full opacity-20"
            initial={{
                x: style.x + "%",
                y: style.y + "%",
                scale: style.scale,
            }}
            animate={{
                y: [null, Math.random() * -100],
                opacity: [0.2, 0],
            }}
            transition={{
                duration: style.duration,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{
                width: style.size + "px",
                height: style.size + "px",
            }}
        />
    );
}
