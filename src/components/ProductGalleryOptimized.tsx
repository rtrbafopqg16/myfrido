'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Product, MediaImage, Video } from '@/lib/shopify';
import { ProductGallery as SanityGallery, SanityImage, urlFor } from '@/lib/sanity';
import OptimizedImage from './OptimizedImage';
import OptimizedVideo from './OptimizedVideo';
import { GalleryPreloader } from './PreloadManager';
import { PerformanceMonitor } from './PerformanceMonitor';
import '../styles/gallery-swipe.css';

interface ProductGalleryProps {
  product?: Product;
  sanityGallery?: SanityGallery | null;
  className?: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  image?: {
    url: string;
    altText?: string;
  };
  videoSources?: Array<{
    url: string;
    format: string;
    mimeType: string;
  }>;
  previewImage?: {
    url: string;
    altText?: string;
  };
}

export default function ProductGallery({ product, sanityGallery, className = '' }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const mainMediaRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Convert data to unified format
  const mediaItems: MediaItem[] = React.useMemo(() => {
    if (sanityGallery?.mediaItems?.length) {
      // Use Sanity gallery data
      return sanityGallery.mediaItems
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((item, index) => ({
          id: item._key || `sanity-${index}`,
          type: item.type,
          image: item.image ? {
            url: urlFor(item.image).width(800).height(800).url(),
            altText: item.image.alt || ''
          } : undefined,
          videoSources: item.videoSources?.map(source => ({
            url: source.url,
            format: source.format,
            mimeType: source.mimeType
          })),
          previewImage: item.previewImage ? {
            url: urlFor(item.previewImage).width(400).height(400).url(),
            altText: item.previewImage.alt || ''
          } : undefined
        }));
    } else if (product?.media?.nodes?.length) {
      // Fallback to Shopify data
      return product.media.nodes.map((media) => ({
        id: media.id,
        type: 'image' in media ? 'image' : 'video',
        image: 'image' in media ? {
          url: media.image.url,
          altText: media.image.altText || ''
        } : undefined,
        videoSources: 'sources' in media ? media.sources.map(source => ({
          url: source.url,
          format: source.format,
          mimeType: source.mimeType
        })) : undefined,
        previewImage: 'sources' in media && media.previewImage ? {
          url: media.previewImage.url,
          altText: media.previewImage.altText || ''
        } : undefined
      }));
    }
    return [];
  }, [sanityGallery, product]);
  
  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Enhanced touch handlers for smooth swipe animations
  const handleTouchStart = (e: React.TouchEvent) => {
    // Enable swipes by default, only disable if explicitly set to false
    if (sanityGallery?.settings?.enableSwipe === false) return;
    if (isTransitioning) return;
    if (mediaItems.length <= 1) return; // No need to swipe if only one image
    
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Enable swipes by default, only disable if explicitly set to false
    if (sanityGallery?.settings?.enableSwipe === false) return;
    if (!touchStart || isTransitioning) return;
    if (mediaItems.length <= 1) return; // No need to swipe if only one image
    
    // Prevent default scrolling behavior
    e.preventDefault();
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    
    // Update drag offset for visual feedback
    setDragOffset(diff);
    
    // Determine swipe direction
    if (Math.abs(diff) > 10) {
      setSwipeDirection(diff > 0 ? 'left' : 'right');
    }
    
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) {
      setIsDragging(false);
      setDragOffset(0);
      setSwipeDirection(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;   // Swipe left to go to next
    const isRightSwipe = distance < -minSwipeDistance; // Swipe right to go to previous

    setIsDragging(false);
    setDragOffset(0);

    if (isLeftSwipe) {
      setSwipeDirection('left');
      // Immediate transition without delay
      goToNext();
    } else if (isRightSwipe) {
      setSwipeDirection('right');
      // Immediate transition without delay
      goToPrevious();
    } else {
      // Snap back if swipe wasn't far enough
      setSwipeDirection(null);
    }
  };

  // Navigation functions with immediate carousel transitions
  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setPreviousIndex(currentIndex);
    setSwipeDirection('left'); // Next image slides in from left
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    setTimeout(() => {
      setIsTransitioning(false);
      setSwipeDirection(null);
    }, 350);
  }, [isTransitioning, mediaItems.length, currentIndex]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setPreviousIndex(currentIndex);
    setSwipeDirection('right'); // Previous image slides in from right
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
    setTimeout(() => {
      setIsTransitioning(false);
      setSwipeDirection(null);
    }, 350);
  }, [isTransitioning, mediaItems.length, currentIndex]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setPreviousIndex(currentIndex);
    // Determine swipe direction based on index change
    const direction = index > currentIndex ? 'left' : 'right';
    setSwipeDirection(direction);
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
      setSwipeDirection(null);
    }, 350);
  }, [isTransitioning, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Scroll thumbnail into view when current index changes
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  if (!mediaItems.length) {
    return (
      <div className={`aspect-square bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No media available</span>
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];
  const showThumbnails = sanityGallery?.settings?.showThumbnails !== false;
  const autoplay = sanityGallery?.settings?.autoplay !== false;

  return (
    <div className={`w-full ${className}`}>
      {/* Smart adaptive preloading for gallery images */}
      <GalleryPreloader mediaItems={mediaItems} currentIndex={currentIndex} />
      
      {/* Performance monitoring (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor />
      )}
      
      {/* Mobile-first: Main Media Display */}
      <div className="relative">
        <div
          ref={mainMediaRef}
          className={`gallery-swipe-container relative aspect-square w-full overflow-hidden ${
            isDragging ? 'dragging' : ''
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Container with Multiple Slides */}
          <div 
            className={`relative h-full w-full overflow-hidden ${
              isTransitioning ? 'pointer-events-none' : ''
            }`}
            style={{
              transform: isDragging && !isTransitioning ? `translate3d(${-dragOffset * 0.1}px, 0, 0)` : 'translate3d(0, 0, 0)',
            }}
          >
            {/* Previous Slide (exiting) */}
            {isTransitioning && previousIndex !== currentIndex && (
              <div 
                className={`gallery-slide absolute inset-0 h-full w-full ${
                  swipeDirection === 'left' ? 'animate-slide-out-left' : 'animate-slide-out-right'
                }`}
              >
                {(() => {
                  const prevMedia = mediaItems[previousIndex];
                  return prevMedia.type === 'image' && prevMedia.image ? (
                    <OptimizedImage
                      src={prevMedia.image.url}
                      alt={prevMedia.image.altText || product?.title || 'Product image'}
                      width={600}
                      height={600}
                      quality={98}
                      optimization="gallery"
                      loading="eager"
                      className="h-full w-full mobile-gallery-image md:object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    />
                  ) : prevMedia.type === 'video' && prevMedia.videoSources ? (
                    <OptimizedVideo
                      sources={prevMedia.videoSources}
                      previewImage={prevMedia.previewImage}
                      alt={product?.title || 'Product video'}
                      width={600}
                      height={600}
                      className="h-full w-full mobile-gallery-image md:object-cover"
                      autoplay={false}
                      muted={true}
                      loop={true}
                    />
                  ) : null;
                })()}
              </div>
            )}

            {/* Current Slide (entering) */}
            <div 
              className={`gallery-slide absolute inset-0 h-full w-full ${
                isTransitioning ? (
                  swipeDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
                ) : ''
              }`}
            >
              {currentMedia.type === 'image' && currentMedia.image ? (
                <OptimizedImage
                  src={currentMedia.image.url}
                  alt={currentMedia.image.altText || product?.title || 'Product image'}
                  width={600}
                  height={600}
                  quality={98}
                  optimization="gallery"
                  priority={true}
                  loading="eager"
                  className="h-full w-full mobile-gallery-image md:object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              ) : currentMedia.type === 'video' && currentMedia.videoSources ? (
                <OptimizedVideo
                  sources={currentMedia.videoSources}
                  previewImage={currentMedia.previewImage}
                  alt={product?.title || 'Product video'}
                  width={600}
                  height={600}
                  className="h-full w-full mobile-gallery-image md:object-cover"
                  autoplay={autoplay}
                  muted={true}
                  loop={true}
                />
              ) : null}
            </div>
          </div>

          
        </div>
          {/* Navigation Arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={isTransitioning}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-4 w-4 md:h-6 md:w-6" />
              </button>
              
              <button
                onClick={goToNext}
                disabled={isTransitioning}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6" />
              </button>
            </>
          )}

          {/* Pagination Indicator */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1}/{mediaItems.length}
            </div>
          )}
        </div>

      {/* Thumbnail Strip - Desktop Only */}
      {mediaItems.length > 1 && showThumbnails && (
        <div className="hidden md:block mt-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-20 space-y-2 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {mediaItems.map((media, index) => (
                <button
                  key={media.id}
                  ref={(el) => { thumbnailRefs.current[index] = el; }}
                  onClick={() => goToSlide(index)}
                  className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    currentIndex === index 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {media.type === 'image' && media.image ? (
                    <OptimizedImage
                      src={media.image.url}
                      alt={media.image.altText || product?.title || 'Product image'}
                      width={80}
                      height={80}
                      quality={90}
                      optimization="thumbnail"
                      loading="eager"
                      className="h-full w-full object-cover object-center"
                      sizes="80px"
                    />
                  ) : media.type === 'video' ? (
                    <div className="relative h-full w-full">
                      {media.previewImage ? (
                        <OptimizedImage
                          src={media.previewImage.url}
                          alt={media.previewImage.altText || product?.title || 'Product video'}
                          width={80}
                          height={80}
                          quality={90}
                          optimization="thumbnail"
                          loading="eager"
                          className="h-full w-full object-cover object-center"
                          sizes="80px"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                          <PlayIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      {/* Video indicator */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <PlayIcon className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
