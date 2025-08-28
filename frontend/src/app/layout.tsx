import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto, Open_Sans, Playfair_Display, Merriweather, Poppins, Montserrat } from "next/font/google";
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

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TikTok Slideshow Generator - AI-Powered Content Creation",
  description: "Create engaging TikTok slideshow content with AI-powered prompts, customizable backgrounds, gradients, typography, and professional design tools. Perfect for content creators and marketers.",
  keywords: ["TikTok", "slideshow", "AI", "content creation", "social media", "marketing", "design tools"],
  authors: [{ name: "TikTok Slideshow Generator" }],
  creator: "TikTok Slideshow Generator",
  publisher: "TikTok Slideshow Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TikTok Slideshow Generator - AI-Powered Content Creation",
    description: "Create engaging TikTok slideshow content with AI-powered prompts, customizable backgrounds, gradients, typography, and professional design tools.",
    url: 'http://localhost:3000',
    siteName: 'TikTok Slideshow Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TikTok Slideshow Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TikTok Slideshow Generator - AI-Powered Content Creation",
    description: "Create engaging TikTok slideshow content with AI-powered prompts and professional design tools.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${playfairDisplay.variable} ${merriweather.variable} ${poppins.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
