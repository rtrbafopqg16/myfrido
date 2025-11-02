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
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-t-[24px] md:rounded-[24px] w-full max-w-md mx-auto max-h-[90vh] overflow-hidden animate-slide-up md:animate-none shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-gray-900">Size Chart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="sticky top-[73px] bg-white z-10 px-5 pt-4 border-b border-gray-200">
            <div className="flex gap-8">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`pb-3 text-[16px] font-medium transition-colors relative ${
                    activeTab === index
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.tabName}
                  {activeTab === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            {/* Image */}
            <div className="bg-gray-50 rounded-[16px] overflow-hidden mb-5">
              {shouldLoadImages ? (
                <OptimizedImage
                  src={currentTab.image.url}
                  alt={currentTab.image.alt || currentTab.tabName}
                  width={600}
                  height={600}
                  quality={95}
                  optimization="gallery"
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 600px"
                  loading="eager"
                  priority={false}
                />
              ) : (
                <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              )}
            </div>

            {/* Description */}
            {currentTab.description && (
              <p className="text-[16px] text-gray-700 leading-relaxed">
                {currentTab.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5">
          <button
            onClick={onClose}
            className="w-full bg-black text-white text-[16px] font-semibold py-4 rounded-[12px] hover:bg-gray-900 transition-colors"
          >
            Back to shopping
          </button>
        </div>
      </div>
    </div>
  );
}

