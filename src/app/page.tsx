'use client';

import LinkInput from '@/components/LinkInput';
import Header from '@/components/Header';
import { useLinks } from '@/context/LinksContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardPreview from '@/components/DashboardPreview';
import BentoGrid from '@/components/BentoGrid';
import HeroBackground from '@/components/HeroBackground';

export default function Home() {
  const { addLink } = useLinks();
  const { user, loading } = useAuth();
  const router = useRouter();

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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-32 pt-24">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">Save, Organize, & </span>
            <span className="text-gradient">Visualize</span>
            <br />
            <span className="text-foreground">Your Links</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground-muted max-w-xl mx-auto">
            Transform your scattered bookmarks into a beautiful, searchable library.
            <br />
            Capture videos, images, and articles with a single click.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl text-center"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <LinkInput onSave={handleSave} />

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-foreground-muted hover:text-primary text-sm font-medium transition-colors flex items-center gap-2 group"
            >
              <span>Try it out — No account needed</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </motion.div>

        {/* Visual Preview */}
        <DashboardPreview />

        {/* Features Bento Grid */}
        <BentoGrid />
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center text-foreground-muted text-sm">
        <p>
          Built for visual thinkers • Open Source •{' '}
          <a
            href="https://github.com"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
