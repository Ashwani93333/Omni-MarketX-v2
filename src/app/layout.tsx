import type { Metadata, Viewport } from "next";
import { Geist_Mono, Sora } from "next/font/google";

import { AiChatbot } from "@/components/ai/ai-chatbot";
import { Providers } from "@/components/providers";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OmniMarketX — Social Prediction Markets",
    template: "%s · OmniMarketX",
  },
  description:
    "Discover prediction markets, trade YES/NO outcomes, and track a virtual portfolio. Trade on what you know.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://omnimarketx.example.com"
  ),
  openGraph: {
    title: "OmniMarketX — Social Prediction Markets",
    description:
      "Trade on what you know. Compete. Discuss. Discover.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f21f68",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-background font-sans">
        <Providers>
          {children}
          <AiChatbot />
        </Providers>
      </body>
    </html>
  );
}