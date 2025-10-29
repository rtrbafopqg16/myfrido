'use client';

import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import OptimizedVideo from './OptimizedVideo';

interface HowToUsePopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  productTitle: string;
}

export default function HowToUsePopup({ isOpen, onClose, videoUrl, productTitle }: HowToUsePopupProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [key, setKey] = useState(0); // Key to force remount video when popup opens
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Force remount video to trigger autoplay
      setKey(prev => prev + 1);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-t-[24px] md:rounded-[24px] w-full max-w-md mx-auto max-h-[90vh] overflow-hidden animate-slide-up md:animate-none shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-gray-900">Video</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative bg-black">
          <OptimizedVideo
            key={key}
            sources={[
              {
                url: videoUrl,
                format: 'mp4',
                mimeType: 'video/mp4'
              }
            ]}
            alt={`How to use ${productTitle}`}
            width={600}
            height={800}
            className="w-full h-auto"
            autoplay={true}
            muted={isMuted}
            loop={true}
          />
          
          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 w-12 h-12 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>
          
          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `How to use ${productTitle}`,
                  url: window.location.href
                });
              }
            }}
            className="absolute bottom-20 right-4 w-12 h-12 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img 
              src="/images/product-thumbnail.png" 
              alt={productTitle}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-gray-900">{productTitle}</h3>
              <p className="text-[14px] text-gray-500 mt-1">Watch how to use this product</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

