import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LinksProvider } from "@/context/LinksContext";
import { CollectionsProvider } from "@/context/CollectionsContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CursorGlow from "@/components/CursorGlow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#00E5FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.linkedit.online'),
  title: {
    default: "LinkedIT - Your Second Brain for the Internet",
    template: "%s | LinkedIT",
  },
  description: "Save links, scrape their soul, tag them, and find them instantly. A visual-first personal archive for reels, memes, and articles.",
  keywords: ["bookmark manager", "link organizer", "save links", "visual bookmarks", "second brain", "knowledge base"],
  authors: [{ name: "LinkedIT" }],
  creator: "LinkedIT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.linkedit.online",
    siteName: "LinkedIT",
    title: "LinkedIT - Your Second Brain for the Internet",
    description: "Save links, scrape their soul, tag them, and find them instantly. Transform your scattered bookmarks into a beautiful, searchable library.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkedIT - Your Second Brain for the Internet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIT - Your Second Brain for the Internet",
    description: "Save links, scrape their soul, tag them, and find them instantly. Transform your scattered bookmarks into a beautiful, searchable library.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.linkedit.online",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LinkedIT",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <SettingsProvider>
            <AuthProvider>
              <CollectionsProvider>
                <LinksProvider>
                  <ToastProvider>
                    <CursorGlow />
                    {children}
                  </ToastProvider>
                </LinksProvider>
              </CollectionsProvider>
            </AuthProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
