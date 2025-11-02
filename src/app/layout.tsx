import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buy Frido Orthotics Posture Corrector | Posture Corrector",
  description: "A lightning-fast D2C e-commerce website built with Next.js, Shopify, and Sanity CMS",
  keywords: ["e-commerce", "D2C", "shopify", "nextjs", "sanity"],
  authors: [{ name: "D2C Store" }],
  openGraph: {
    title: "Buy Frido Orthotics Posture Corrector | Posture Corrector",
    description: "A lightning-fast D2C e-commerce website built with Next.js, Shopify, and Sanity CMS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Frido Orthotics Posture Corrector | Posture Corrector",
    description: "A lightning-fast D2C e-commerce website built with Next.js, Shopify, and Sanity CMS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <head>
        {/* Preconnect/DNS-Prefetch to critical origins for faster product loads */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        {/* Shopify Storefront GraphQL and Sanity API domains (runtime via env) */}
        {process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && (
          <link rel="preconnect" href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`} crossOrigin="anonymous" />
        )}
        {process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && (
          <link rel="dns-prefetch" href={`//${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`} />
        )}
        {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && (
          <link rel="preconnect" href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io`} crossOrigin="anonymous" />
        )}
        {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && (
          <link rel="dns-prefetch" href={`//${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io`} />
        )}
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className={`${outfit.className} antialiased bg-gray-50`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
