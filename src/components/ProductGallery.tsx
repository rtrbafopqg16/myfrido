'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Product, MediaImage, Video } from '@/lib/shopify';
import OptimizedImage from './OptimizedImage';
import OptimizedVideo from './OptimizedVideo';

interface ProductGalleryProps {
  product: Product;
  className?: string;
}

export default function ProductGallery({ product, className = '' }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const mainMediaRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Get media items from product
  const mediaItems = product.media?.nodes || [];
  
  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, mediaItems.length]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, mediaItems.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
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

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile-first: Main Media Display */}
      <div className="relative">
        <div
          ref={mainMediaRef}
          className="relative aspect-square  w-full overflow-hidden bg-gray-200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Media Content */}
          <div className="relative h-full w-full">
            {(() => {
              if ('image' in currentMedia) {
                // It's a MediaImage
                return (
                  <OptimizedImage
                    src={currentMedia.image.url}
                    alt={currentMedia.image.altText || product.title}
                    width={600}
                    height={600}
                    quality={98}
                    optimization="gallery"
                    priority={true}
                    className="h-full w-full mobile-gallery-image md:object-cover object-center transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  />
                );
              } else if ('sources' in currentMedia) {
                // It's a Video
                return (
                  <OptimizedVideo
                    sources={currentMedia.sources}
                    previewImage={currentMedia.previewImage}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="h-full w-full mobile-gallery-image md:object-cover"
                    autoplay={true}
                    muted={true}
                    loop={true}
                  />
                );
              }
              return null;
            })()}
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
      </div>

      {/* Thumbnail Strip - Desktop Only */}
      {mediaItems.length > 1 && (
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
                  {(() => {
                    if ('image' in media) {
                      // It's a MediaImage
                      return (
                        <OptimizedImage
                          src={media.image.url}
                          alt={media.image.altText || product.title}
                          width={80}
                          height={80}
                          quality={90}
                          optimization="thumbnail"
                          className="h-full w-full object-cover object-center"
                          sizes="80px"
                        />
                      );
                    } else if ('sources' in media) {
                      // It's a Video - show preview image
                      return (
                        <div className="relative h-full w-full">
                          {media.previewImage ? (
                            <OptimizedImage
                              src={media.previewImage.url}
                              alt={media.previewImage.altText || product.title}
                              width={80}
                              height={80}
                              quality={90}
                              optimization="thumbnail"
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
                      );
                    }
                    return null;
                  })()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}