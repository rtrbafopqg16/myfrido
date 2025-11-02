'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface OptimizedVideoProps {
  sources: {
    url: string;
    format: string;
    mimeType: string;
  }[];
  previewImage?: {
    url: string;
    altText?: string;
  };
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function OptimizedVideo({
  sources,
  previewImage,
  alt = 'Product video',
  width = 600,
  height = 600,
  className = '',
  autoplay = false,
  muted = true,
  loop = false,
}: OptimizedVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If video has already loaded, don't show loader
    if (hasLoadedRef.current) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Check if video is already cached/ready
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
      setIsLoaded(true);
      setIsLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsLoading(false);
      hasLoadedRef.current = true;
      if (autoplay) {
        video.play().catch(console.error);
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (loop && autoplay) {
        video.play().catch(console.error);
      }
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [autoplay, loop]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  // Get the best quality video source
  const getBestSource = () => {
    // Prefer MP4 format, then fallback to others
    const mp4Source = sources.find(source => source.format === 'mp4');
    if (mp4Source) return mp4Source;
    
    // Fallback to first available source
    return sources[0];
  };

  const bestSource = getBestSource();

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-200 ${className}`}

      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        width={width}
        height={height}
        className="w-full h-full mobile-gallery-image md:object-cover"
        poster={previewImage?.url}
        preload={autoplay ? "auto" : "metadata"}
        playsInline
        muted={muted}
        loop={loop}
        autoPlay={autoplay}
      >
        {sources.map((source, index) => (
          <source
            key={index}
            src={source.url}
            type={source.mimeType}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      {!isPlaying && !autoplay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <button
            onClick={handlePlayPause}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 transform hover:scale-110"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            <PlayIcon className="h-8 w-8 text-gray-800 ml-1" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-600 rounded-full h-1">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-300"
                  style={{ 
                    width: videoRef.current 
                      ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>

            <div className="text-white text-sm">
              {videoRef.current && (
                <>
                  {Math.floor(videoRef.current.currentTime / 60)}:
                  {Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')}
                  {' / '}
                  {Math.floor(videoRef.current.duration / 60)}:
                  {Math.floor(videoRef.current.duration % 60).toString().padStart(2, '0')}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State - Only show when actually loading */}
      {isLoading && !hasLoadedRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#dddddd]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
    </div>
  );
}