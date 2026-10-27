import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Opp Code Stock Vision — Institutional Indian Equity Research Platform",
    template: "%s | Opp Code Stock Vision"
  },
  description: "Production-grade equity research and fundamental analysis platform for Indian capital markets (NSE & BSE). Powered by OPP Code Vision Technology.",
  keywords: ["Opp Code Stock Vision", "OppCode StockVision", "Indian Stock Market", "NSE", "BSE", "Fundamental Analysis", "Equity Research"],
  authors: [{ name: "OPP Code Vision Technology" }],
  openGraph: {
    title: "Opp Code Stock Vision — Institutional Equity Research Platform",
    description: "Real-time fundamentals, 10-year financials, shareholding, and zero-fabrication analytics across 5,500+ Indian equities. Powered by OPP Code Vision Technology.",
    siteName: "Opp Code Stock Vision",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opp Code Stock Vision",
    description: "Institutional Indian Equity Research Platform. Powered by OPP Code Vision Technology.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} h-full antialiased bg-background text-on-surface`}
    >
      <body className="min-h-full flex flex-col font-inter">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
