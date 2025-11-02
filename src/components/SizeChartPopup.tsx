'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import OptimizedImage from './OptimizedImage';

interface Tab {
  tabName: string;
  image: {
    url: string;
    alt?: string;
  };
  description?: string;
}

interface SizeChartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  defaultTab?: number;
}

export default function SizeChartPopup({ isOpen, onClose, tabs, defaultTab = 0 }: SizeChartPopupProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [shouldLoadImages, setShouldLoadImages] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab(defaultTab);
      // Defer image loading until popup is actually opened
      // Small delay to ensure popup animation starts smoothly
      const timer = setTimeout(() => {
        setShouldLoadImages(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      // Reset image loading state when closed to save memory
      setShouldLoadImages(false);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultTab]);

  // Preload next tab image when activeTab changes (but only if images should be loaded)
  useEffect(() => {
    if (!shouldLoadImages || !tabs || tabs.length === 0) return;
    
    // Preload adjacent tab images for smoother switching
    const nextTabIndex = (activeTab + 1) % tabs.length;
    const prevTabIndex = activeTab === 0 ? tabs.length - 1 : activeTab - 1;
    
    [nextTabIndex, prevTabIndex].forEach(tabIndex => {
      const tab = tabs[tabIndex];
      if (tab?.image?.url && typeof window !== 'undefined') {
        const img = document.createElement('img');
        img.src = tab.image.url;
      }
    });
  }, [activeTab, shouldLoadImages, tabs]);

  if (!isOpen || !tabs || tabs.length === 0) return null;

  const currentTab = tabs[activeTab];

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-t-[24px] md:rounded-[24px] w-full max-w-md mx-auto max-h-[90vh] overflow-hidden animate-slide-up md:animate-none p-[20px] flex flex-col gap-[20px]">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10  ">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-medium text-black leading-none">Size Chart</h2>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#clip0_5850_6131)">
                        <path d="M18 6L6 18" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 6L18 18" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_5850_6131">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                    </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="sticky  bg-white z-10  border-b border-[#f0f0f0]">
            <div className="flex gap-8">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`py-[12px] text-[14px] leading-none w-[50%] font-medium transition-colors relative ${
                    activeTab === index
                      ? 'text-[#307FE2]'
                      : 'text-black hover:text-gray-700'
                  }`}
                >
                  {tab.tabName}
                  {activeTab === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#307FE2] " />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="">
            {/* Image */}
            <div className="bg-gray-50 ">
              {shouldLoadImages ? (
                <img
                  src={currentTab.image.url}
                  alt={currentTab.image.alt || currentTab.tabName}
                  className="w-full h-auto object-contain"
                  style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              )}
            </div>

            {/* Description */}
            {currentTab.description && (
              <p className="text-[14px] text-[#636363] mt-[16px] leading-none">
                {currentTab.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-black text-white text-[18px] font-medium h-[56px] rounded-[16px] hover:bg-gray-900 transition-colors"
          >
            Back to shopping
          </button>
        </div>
      </div>
    </div>
  );
}

