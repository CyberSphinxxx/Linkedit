'use client';

import LinkInput from '@/components/LinkInput';
import Header from '@/components/Header';
import { useLinks } from '@/context/LinksContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardPreview from '@/components/DashboardPreview';
import BentoGrid from '@/components/BentoGrid';
import HeroBackground from '@/components/HeroBackground';
import HeroFloatingElements from '@/components/HeroFloatingElements';
import LogoCarousel from '@/components/LogoCarousel';
import ThemePreviewSection from '@/components/ThemePreviewSection';
import { useState } from 'react';

export default function Home() {
  const { addLink } = useLinks();
  const { user, loading } = useAuth();
  const router = useRouter();

  const words = ["Access forever.", "Find instantly.", "Organize easily."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSave = async (link: Parameters<typeof addLink>[0]) => {
    await addLink(link);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <HeroBackground />



      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-16 md:pt-24 md:pb-32">

        <HeroFloatingElements />

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 relative"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          {/* Radial gradient glow behind headline - mobile only */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10 md:hidden" />

          <h2 className="text-[2.75rem] sm:text-5xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-[1.15] tracking-tight min-h-[140px] sm:min-h-[160px] md:min-h-0 md:h-32">
            Save once,<br />
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-gradient block relative"
              >
                {words[index]}
                {/* Subtle glow effect for animated text - mobile only */}
                <span className="absolute inset-0 text-gradient blur-xl opacity-30 md:hidden">{words[index]}</span>
              </motion.span>
            </AnimatePresence>
          </h2>
          <p className="text-xl md:text-xl text-foreground-muted/90 max-w-xl mx-auto mt-6 px-4">
            The <span className="text-primary font-semibold">intelligent</span> bookmark manager for visual thinkers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl text-center mb-16 sm:mb-20"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <LinkInput onSave={handleSave} />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 -mx-4 sm:mx-0 px-4 sm:px-0">
            {/* Primary CTA - Clean white design */}
            <motion.button
              onClick={() => router.push('/login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white text-black font-semibold text-base transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              Login / Sign Up
            </motion.button>

            {/* Secondary CTA - Enhanced visibility */}
            <motion.button
              onClick={() => router.push('/dashboard')}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-surface-elevated/50 hover:bg-surface-elevated border border-white/5 hover:border-primary/30 text-foreground hover:text-primary text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
            >
              <span>Try Guest Mode — No account needed</span>
              <span className="group-hover:translate-x-1 transition-transform text-primary">→</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Logo Carousel */}
        <LogoCarousel />

        {/* Theme Preview Section (Hidden on mobile) */}
        <div className="hidden lg:block w-full">
          <ThemePreviewSection />
        </div>

        {/* Features Bento Grid */}
        <BentoGrid />
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/80">LinkEdit</p>
            <p className="text-xs text-foreground-muted max-w-xs">
              The intelligent bookmark manager for visual thinkers.
            </p>
            <div className="text-xs text-foreground-muted/40 mt-4">
              © {new Date().getFullYear()} LinkEdit. Open Source.
            </div>
          </div>

          <div className="flex gap-8 text-sm text-foreground-muted font-medium">
            <a
              href="https://github.com/CyberSphinxxx/Linkedit"
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
