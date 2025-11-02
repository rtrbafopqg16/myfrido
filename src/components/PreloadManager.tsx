'use client';

import { useEffect, useRef, useState } from 'react';

interface PreloadManagerProps {
  images: string[];
  priority?: boolean;
  onPreloadComplete?: (loadedCount: number, totalCount: number) => void;
}

// Detect user's connection and device capabilities
function getConnectionInfo() {
  if (typeof navigator === 'undefined') return { slowConnection: false, mobile: false };
  
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const userAgent = navigator.userAgent;
  
  return {
    slowConnection: connection ? 
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) : 
      false,
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    effectiveType: connection?.effectiveType || '4g'
  };
}

export function PreloadManager({ images, priority = false, onPreloadComplete }: PreloadManagerProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const preloadRefs = useRef<Map<string, HTMLImageElement>>(new Map());
  const [connectionInfo] = useState(() => getConnectionInfo());

  useEffect(() => {
    if (!images.length) return;

    // Smart preloading based on connection
    const shouldPreload = !connectionInfo.slowConnection && !connectionInfo.mobile;
    const maxPreloadCount = connectionInfo.slowConnection ? 2 : connectionInfo.mobile ? 3 : images.length;

    if (!shouldPreload && !priority) {
      console.log('Skipping preload due to slow connection or mobile device');
      return;
    }

    let loadedCount = 0;
    const totalCount = Math.min(maxPreloadCount, images.length);

    const preloadImage = (url: string, index: number) => {
      if (loadedImages.has(url)) return;

      const img = new Image();
      preloadRefs.current.set(url, img);

      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, url]));
        loadedCount++;
        onPreloadComplete?.(loadedCount, totalCount);
      };

      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        loadedCount++;
        onPreloadComplete?.(loadedCount, totalCount);
      };

      // Set priority loading only for critical images
      if (priority && index < 3) {
        img.fetchPriority = 'high';
      }

      img.src = url;
    };

    // Preload images with smart limits
    images.slice(0, maxPreloadCount).forEach((url, index) => {
      preloadImage(url, index);
    });

    // Cleanup function
    return () => {
      preloadRefs.current.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
      preloadRefs.current.clear();
    };
  }, [images, priority, onPreloadComplete, loadedImages, connectionInfo]);

  return null;
}

// Hook for managing image preloading with smart strategies
export function useImagePreloader() {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [connectionInfo] = useState(() => getConnectionInfo());

  const preloadImages = (urls: string[], priority = false) => {
    // Skip preloading on slow connections unless priority
    if (connectionInfo.slowConnection && !priority) {
      console.log('Skipping preload due to slow connection');
      return;
    }

    const newUrls = urls.filter(url => !preloadedImages.has(url));
    if (!newUrls.length) return;

    // Limit preloading based on connection
    const maxPreload = connectionInfo.slowConnection ? 1 : 
                      connectionInfo.mobile ? 3 : 
                      newUrls.length;

    const urlsToPreload = newUrls.slice(0, maxPreload);
    let loadedCount = 0;
    const totalCount = urlsToPreload.length;

    urlsToPreload.forEach((url, index) => {
      const img = new Image();
      
      // Only set high priority for first few images
      if (priority && index < 2) {
        img.fetchPriority = 'high';
      }

      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]));
        loadedCount++;
        setLoadingProgress((loadedCount / totalCount) * 100);
      };

      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        loadedCount++;
        setLoadingProgress((loadedCount / totalCount) * 100);
      };

      img.src = url;
    });
  };

  const isPreloaded = (url: string) => preloadedImages.has(url);

  return {
    preloadImages,
    isPreloaded,
    loadingProgress,
    preloadedCount: preloadedImages.size,
    connectionInfo
  };
}

// Smart gallery preloader with aggressive strategies for smooth carousel navigation
export function GalleryPreloader({ 
  mediaItems, 
  currentIndex 
}: { 
  mediaItems: Array<{ 
    type: 'image' | 'video'; 
    image?: { url: string }; 
    previewImage?: { url: string } 
  }>; 
  currentIndex: number; 
}) {
  const { preloadImages, connectionInfo } = useImagePreloader();
  const preloadedUrls = useRef<Set<string>>(new Set());

  // Aggressive preloading when currentIndex changes - prioritize carousel images
  useEffect(() => {
    if (!mediaItems.length) return;

    // Always preload current, next, and previous images immediately
    const urlsToPreload: string[] = [];
    
    // Current image (always highest priority)
    const currentMedia = mediaItems[currentIndex];
    if (currentMedia.type === 'image' && currentMedia.image?.url) {
      urlsToPreload.push(currentMedia.image.url);
    }
    if (currentMedia.type === 'video' && currentMedia.previewImage?.url) {
      urlsToPreload.push(currentMedia.previewImage.url);
    }

    // Next 2 images (swipe forward direction - most common)
    for (let i = 1; i <= 2; i++) {
      const nextIndex = (currentIndex + i) % mediaItems.length;
      const nextMedia = mediaItems[nextIndex];
      if (nextMedia.type === 'image' && nextMedia.image?.url && !preloadedUrls.current.has(nextMedia.image.url)) {
        urlsToPreload.push(nextMedia.image.url);
      }
      if (nextMedia.type === 'video' && nextMedia.previewImage?.url && !preloadedUrls.current.has(nextMedia.previewImage.url)) {
        urlsToPreload.push(nextMedia.previewImage.url);
      }
    }

    // Previous 1 image (swipe backward)
    const prevIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1;
    const prevMedia = mediaItems[prevIndex];
    if (prevMedia.type === 'image' && prevMedia.image?.url && !preloadedUrls.current.has(prevMedia.image.url)) {
      urlsToPreload.push(prevMedia.image.url);
    }
    if (prevMedia.type === 'video' && prevMedia.previewImage?.url && !preloadedUrls.current.has(prevMedia.previewImage.url)) {
      urlsToPreload.push(prevMedia.previewImage.url);
    }

    // Preload with high priority - carousel images are critical after initial load
    if (urlsToPreload.length > 0) {
      urlsToPreload.forEach(url => {
        // Mark as preloading to avoid duplicates
        if (preloadedUrls.current.has(url)) return;
        
        const img = new Image();
        img.fetchPriority = 'high';
        img.onload = () => {
          preloadedUrls.current.add(url);
        };
        img.onerror = () => {
          // Still mark as attempted to avoid retry loops
          preloadedUrls.current.add(url);
        };
        img.src = url;
      });
      
      // Also use the hook for tracking
      preloadImages(urlsToPreload, true);
    }

  }, [currentIndex, mediaItems, preloadImages]);

  // Initial aggressive preload on mount - preload first 3-4 images immediately
  useEffect(() => {
    if (!mediaItems.length) return;

    const initialUrls: string[] = [];
    const initialCount = Math.min(4, mediaItems.length);
    
    for (let i = 0; i < initialCount; i++) {
      const media = mediaItems[i];
      if (media.type === 'image' && media.image?.url) {
        initialUrls.push(media.image.url);
      }
      if (media.type === 'video' && media.previewImage?.url) {
        initialUrls.push(media.previewImage.url);
      }
    }

    if (initialUrls.length > 0) {
      // Preload first image with highest priority, rest with high priority
      initialUrls.forEach((url, index) => {
        if (preloadedUrls.current.has(url)) return;
        
        const img = new Image();
        img.fetchPriority = index === 0 ? 'high' : 'high';
        img.onload = () => {
          preloadedUrls.current.add(url);
        };
        img.onerror = () => {
          preloadedUrls.current.add(url);
        };
        img.src = url;
      });
      
      preloadImages(initialUrls, true);
    }
  }, [mediaItems, preloadImages]);

  return null;
}