import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LinksProvider } from "@/context/LinksContext";
import { CollectionsProvider } from "@/context/CollectionsContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedIT - Your Second Brain for the Internet",
  description: "Save links, scrape their soul, tag them, and find them instantly. A visual-first personal archive for reels, memes, and articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
