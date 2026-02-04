'use client';

import LinkInput from '@/components/LinkInput';
import Header from '@/components/Header';
import { useLinks } from '@/context/LinksContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="relative min-h-screen flex flex-col bg-grid">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'var(--primary)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'var(--accent)', animationDelay: '-3s' }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">Your </span>
            <span className="text-gradient">Second Brain</span>
            <br />
            <span className="text-foreground">for the Internet</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground-muted max-w-xl mx-auto">
            Save links, scrape their soul, tag them, and find them instantly.
            <br />
            No more tab fatigue.
          </p>
        </motion.div>

        {/* Link input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <LinkInput onSave={handleSave} />
        </motion.div>

        {/* Feature hints */}
        <div className="flex flex-wrap justify-center gap-6 mt-16 text-sm text-foreground-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Auto-extract metadata</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Visual gallery view</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Smart tagging</span>
          </div>
        </div>
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
