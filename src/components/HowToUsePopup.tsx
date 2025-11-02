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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Defer video loading until popup is actually opened
      // Small delay to ensure popup animation starts smoothly
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
        setKey(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      // Reset video loading state when closed to save memory
      setShouldLoadVideo(false);
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
        className="absolute inset-0 bg-black opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-black  w-full max-w-md mx-auto h-full overflow-hidden animate-slide-up md:animate-none  shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 p-[20px] ">
          <div className="flex items-center justify-between">

            <button
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clip-path="url(#clip0_1906_1688)">
                  <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5 12L11 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5 12L11 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_1906_1688">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative h-full flex  justify-center items-center bg-black">
          {shouldLoadVideo ? (
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
          ) : (
            <div className="aspect-video w-full bg-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          <div className='absolute bottom-[20vh] right-[20px] flex flex-col gap-[20px]'>
          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className=" w-[40px] h-[40px] bg-[#00000050]  rounded-full flex items-center justify-center transition-all"
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
            className=" w-[40px] h-[40px] bg-[#00000050] hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
              <g clip-path="url(#clip0_1906_1669)">
                <path d="M2.81836 11.5455C2.81836 12.2688 3.1057 12.9625 3.61716 13.474C4.12862 13.9854 4.82231 14.2728 5.54563 14.2728C6.26895 14.2728 6.96264 13.9854 7.47411 13.474C7.98557 12.9625 8.2729 12.2688 8.2729 11.5455C8.2729 10.8222 7.98557 10.1285 7.47411 9.61704C6.96264 9.10557 6.26895 8.81824 5.54563 8.81824C4.82231 8.81824 4.12862 9.10557 3.61716 9.61704C3.1057 10.1285 2.81836 10.8222 2.81836 11.5455Z" stroke="white" stroke-width="1.13636" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.7275 6.09092C13.7275 6.81424 14.0149 7.50793 14.5263 8.01939C15.0378 8.53086 15.7315 8.81819 16.4548 8.81819C17.1781 8.81819 17.8718 8.53086 18.3833 8.01939C18.8947 7.50793 19.1821 6.81424 19.1821 6.09092C19.1821 5.3676 18.8947 4.67391 18.3833 4.16245C17.8718 3.65098 17.1781 3.36365 16.4548 3.36365C15.7315 3.36365 15.0378 3.65098 14.5263 4.16245C14.0149 4.67391 13.7275 5.3676 13.7275 6.09092Z" stroke="white" stroke-width="1.13636" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.7275 17C13.7275 17.7233 14.0149 18.417 14.5263 18.9285C15.0378 19.4399 15.7315 19.7273 16.4548 19.7273C17.1781 19.7273 17.8718 19.4399 18.3833 18.9285C18.8947 18.417 19.1821 17.7233 19.1821 17C19.1821 16.2767 18.8947 15.583 18.3833 15.0715C17.8718 14.56 17.1781 14.2727 16.4548 14.2727C15.7315 14.2727 15.0378 14.56 14.5263 15.0715C14.0149 15.583 13.7275 16.2767 13.7275 17Z" stroke="white" stroke-width="1.13636" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10.3636L14 7.27271" stroke="white" stroke-width="1.13636" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 12.7273L14 15.8182" stroke="white" stroke-width="1.13636" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_1906_1669">
                  <rect width="21.8182" height="21.8182" fill="white" transform="translate(0.0908203 0.636353)"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          </div>
          
        </div>

        {/* Product Info */}
        {/* <div className="p-5 border-t border-gray-100">
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
        </div> */}
      </div>
    </div>
  );
}

