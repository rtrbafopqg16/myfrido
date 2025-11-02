'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateSrcSet, getOptimalFormat, IMAGE_OPTIMIZATIONS } from '@/lib/imageOptimization';

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
    }
    
    // Add format optimization
    params.set('format', 'webp');
    
    // Add crop mode
    params.set('crop', 'center');
    
    // Rebuild URL with optimized parameters
    url.search = params.toString();
    return url.toString();
  } catch (error) {
    console.error('Error optimizing Shopify image:', error);
    return src; // Return original URL if optimization fails
  }
}

// Generate srcset for Shopify images
function generateShopifySrcSet(src: string, baseWidth: number, quality: number | string): string {
  try {
    const url = new URL(src);
    const params = new URLSearchParams(url.search);
    
    // Remove existing width/height parameters
    params.delete('width');
    params.delete('height');
    
    // Add quality and format
    if (typeof quality === 'number') {
      params.set('quality', Math.min(100, Math.max(0, quality)).toString());
    }
    params.set('format', 'webp');
    params.set('crop', 'center');
    
    // Generate different sizes for srcset
    const sizes = [
      { width: Math.round(baseWidth * 0.5), descriptor: `${Math.round(baseWidth * 0.5)}w` },
      { width: Math.round(baseWidth * 0.75), descriptor: `${Math.round(baseWidth * 0.75)}w` },
      { width: baseWidth, descriptor: `${baseWidth}w` },
      { width: Math.round(baseWidth * 1.25), descriptor: `${Math.round(baseWidth * 1.25)}w` },
      { width: Math.round(baseWidth * 1.5), descriptor: `${Math.round(baseWidth * 1.5)}w` },
      { width: Math.round(baseWidth * 2), descriptor: `${Math.round(baseWidth * 2)}w` }
    ];
    
    const srcsetUrls = sizes.map(({ width, descriptor }) => {
      const srcsetParams = new URLSearchParams(params);
      srcsetParams.set('width', width.toString());
      srcsetParams.set('height', width.toString()); // Assuming square aspect ratio
      
      const srcsetUrl = new URL(src);
      srcsetUrl.search = srcsetParams.toString();
      return `${srcsetUrl.toString()} ${descriptor}`;
    });
    
    return srcsetUrls.join(', ');
  } catch (error) {
    console.error('Error generating Shopify srcset:', error);
    return '';
  }
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  optimization?: keyof typeof IMAGE_OPTIMIZATIONS;
  onClick?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 95,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  placeholder = 'blur',
  blurDataURL,
  loading = 'lazy',
  optimization = 'productCard',
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [srcset, setSrcset] = useState<string>('');
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate optimized image URLs when in view (or immediately if priority/eager)
  useEffect(() => {
    if (!isInView && !priority && loading !== 'eager') return;
    
    const generateOptimizedUrls = () => {
      try {
        // For Shopify CDN URLs, use Shopify's native optimization
        if (src.includes('cdn.shopify.com')) {
          const optimizedUrl = optimizeShopifyImage(src, width, height, quality);
          const srcsetUrl = generateShopifySrcSet(src, width, quality);
          setOptimizedSrc(optimizedUrl);
          setSrcset(srcsetUrl);
          return;
        }
        
        // For other URLs, use them as-is
        setOptimizedSrc(src);
      } catch (error) {
        console.error('Error generating optimized image URL:', error);
        setHasError(true);
      }
    };
    
    generateOptimizedUrls();
  }, [isInView, src, width, height, quality, priority, loading]);


  // Generate blur placeholder
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = Math.round((10 * height) / width);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        
        onClick={onClick}
      >
        <div className="text-gray-400 text-sm">Image failed to load</div>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      
      onClick={onClick}
    >
      {isInView && optimizedSrc && (
        <img
          src={optimizedSrc}
          srcSet={srcset || undefined}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            objectPosition: 'center',
            width: className.includes('h-auto') ? '100%' : '100%',
            height: className.includes('h-auto') ? 'auto' : '100%',
            objectFit: className.includes('object-contain') ? 'contain' : 
                      className.includes('object-cover') ? 'cover' : 
                      className.includes('object-fill') ? 'fill' : 'cover'
          }}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}

// Preload critical images
export function PreloadImage({ src, priority = false }: { src: string; priority?: boolean }) {
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }
  }, [src, priority]);

  return null;
}

// Image gallery component
export function ImageGallery({ 
  images, 
  alt, 
  className = '' 
}: { 
  images: string[]; 
  alt: string; 
  className?: string; 
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main image */}
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden ">
        <OptimizedImage
          src={images[selectedIndex]}
          alt={alt}
          width={600}
          height={600}
          priority={true}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg ${
                selectedIndex === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} ${index + 1}`}
                width={100}
                height={100}
                optimization="thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

