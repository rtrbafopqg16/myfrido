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
  title: "D2C Store - Fast & Modern E-commerce",
  description: "A lightning-fast D2C e-commerce website built with Next.js, Shopify, and Sanity CMS",
  keywords: ["e-commerce", "D2C", "shopify", "nextjs", "sanity"],
  authors: [{ name: "D2C Store" }],
  openGraph: {
    title: "D2C Store - Fast & Modern E-commerce",
    description: "A lightning-fast D2C e-commerce website built with Next.js, Shopify, and Sanity CMS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "D2C Store - Fast & Modern E-commerce",
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
