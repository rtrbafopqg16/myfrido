import { useState, useRef, useEffect } from 'react';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
}

// Shopify image optimization function
function optimizeShopifyImage(src: string, width: number, height: number, quality: number | string): string {
  try {
    const url = new URL(src);
    
    // Shopify CDN optimization parameters
    const params = new URLSearchParams(url.search);
    
    // Add optimization parameters
    params.set('width', width.toString());
    params.set('height', height.toString());
    
    // Convert quality to Shopify format (0-100)
    if (typeof quality === 'number') {
      params.set('quality', Math.min(100, Math.max(0, quality)).toString());
    } else {
      params.set('quality', quality);
    }
    
    // Add format optimization
    params.set('format', 'webp');
    
    return `${url.origin}${url.pathname}?${params.toString()}`;
  } catch (error) {
    console.error('Error optimizing Shopify image:', error);
    return src;
  }
}

// Generate srcset for Shopify images
export function generateShopifySrcSet(src: string, baseWidth: number, quality: number | string): string {
  const sizes = [150, 300, 600, 900, 1200, 1800];
  const srcsetEntries: string[] = [];
  
  sizes.forEach(size => {
    if (size <= baseWidth * 2) { // Only include sizes up to 2x the base width
      const optimizedUrl = optimizeShopifyImage(src, size, size, quality);
      srcsetEntries.push(`${optimizedUrl} ${size}w`);
    }
  });
  
  return srcsetEntries.join(', ');
}

// Generate responsive image sources for different screen sizes
export function generateResponsiveImageSources(
  baseImageUrl: string,
  sizes: { mobile: number; tablet: number; desktop: number }
) {
  return {
    mobile: optimizeShopifyImage(baseImageUrl, sizes.mobile, sizes.mobile, 95),
    tablet: optimizeShopifyImage(baseImageUrl, sizes.tablet, sizes.tablet, 95),
    desktop: optimizeShopifyImage(baseImageUrl, sizes.desktop, sizes.desktop, 98)
  };
}

// Generate srcSet for responsive images
export function generateSrcSet(imageUrl: string, sizes: number[]): string {
  return sizes
    .map(size => {
      const optimizedUrl = optimizeShopifyImage(imageUrl, size, size, 95);
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

// Preload critical images
export function preloadImage(src: string, priority: boolean = false) {
  if (typeof window !== 'undefined' && priority) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
}

// Image optimization for different use cases
export const IMAGE_OPTIMIZATIONS = {
  // Product card images
  productCard: {
    mobile: { width: 300, height: 300, quality: 95 },
    tablet: { width: 400, height: 400, quality: 95 },
    desktop: { width: 500, height: 500, quality: 98 }
  },
  
  // Hero images
  hero: {
    mobile: { width: 600, height: 400, quality: 95 },
    tablet: { width: 900, height: 600, quality: 98 },
    desktop: { width: 1200, height: 800, quality: 98 }
  },
  
  // Gallery images
  gallery: {
    mobile: { width: 400, height: 400, quality: 95 },
    tablet: { width: 600, height: 600, quality: 98 },
    desktop: { width: 800, height: 800, quality: 98 }
  },
  
  // Thumbnail images
  thumbnail: {
    mobile: { width: 100, height: 100, quality: 90 },
    tablet: { width: 150, height: 150, quality: 90 },
    desktop: { width: 200, height: 200, quality: 95 }
  }
} as const;

// Generate optimized image URL with caching
export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width: number;
    height: number;
    quality?: number | string;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  }
): string {
  // Use Shopify optimization for Shopify CDN URLs
  if (originalUrl.includes('cdn.shopify.com')) {
    return optimizeShopifyImage(
      originalUrl, 
      options.width, 
      options.height, 
      options.quality || 95
    );
  }
  
  // For other URLs, return as-is
  return originalUrl;
}

// Image lazy loading with intersection observer
export function useLazyImage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { imgRef, isLoaded, isInView, setIsLoaded };
}

// WebP support detection
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

// Generate appropriate image format based on browser support
export function getOptimalFormat(): 'auto' | 'webp' | 'avif' | 'jpg' {
  if (typeof window === 'undefined') return 'auto';
  
  // Check for AVIF support (most modern)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }
  
  // Check for WebP support
  if (supportsWebP()) {
    return 'webp';
  }
  
  // Fallback to auto (let Cloudinary decide)
  return 'auto';
}

