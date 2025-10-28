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

// Smart gallery preloader with adaptive strategies
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

  useEffect(() => {
    if (!mediaItems.length) return;

    // Extract all image URLs
    const imageUrls: string[] = [];
    
    mediaItems.forEach(media => {
      if (media.type === 'image' && media.image?.url) {
        imageUrls.push(media.image.url);
      }
      if (media.type === 'video' && media.previewImage?.url) {
        imageUrls.push(media.previewImage.url);
      }
    });

    // Smart preloading strategy
    if (connectionInfo.slowConnection) {
      // On slow connections: only preload current + next image
      const currentUrl = imageUrls[currentIndex];
      const nextUrl = imageUrls[(currentIndex + 1) % imageUrls.length];
      preloadImages([currentUrl, nextUrl].filter(Boolean), true);
    } else if (connectionInfo.mobile) {
      // On mobile: preload current + 2 adjacent images
      const adjacentUrls = [
        imageUrls[currentIndex],
        imageUrls[(currentIndex + 1) % imageUrls.length],
        imageUrls[currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1]
      ].filter(Boolean);
      preloadImages(adjacentUrls, true);
    } else {
      // On fast connections: preload all images
      preloadImages(imageUrls, true);
      
      // Also preload thumbnail versions
      const thumbnailUrls = imageUrls.map(url => 
        url.replace(/w=\d+/, 'w=80').replace(/h=\d+/, 'h=80')
      );
      preloadImages(thumbnailUrls, false);
    }

  }, [mediaItems, preloadImages, connectionInfo]);

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (mediaItems.length <= 1 || connectionInfo.slowConnection) return;

    const adjacentUrls: string[] = [];
    
    // Get next and previous images
    const nextIndex = (currentIndex + 1) % mediaItems.length;
    const prevIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1;

    [nextIndex, prevIndex].forEach(index => {
      const media = mediaItems[index];
      if (media.type === 'image' && media.image?.url) {
        adjacentUrls.push(media.image.url);
      }
    });

    if (adjacentUrls.length) {
      preloadImages(adjacentUrls, true);
    }
  }, [currentIndex, mediaItems, preloadImages, connectionInfo]);

  return null;
}