import React from 'react';

export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        {/* Product Gallery Skeleton */}
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded h-20 w-20"></div>
            ))}
          </div>
        </div>

        <div className="p-[20px] flex flex-col gap-[20px] bg-[#fff]">
          {/* Rating and Hot Selling Section Skeleton */}
          <div className="flex items-center space-x-[12px] animate-pulse">
            <div className="bg-gray-200 rounded-[4px] h-6 w-24"></div>
            <div className="bg-gray-200 rounded h-4 w-20"></div>
          </div>

          {/* Product Title Skeleton */}
          <div className="flex items-start justify-between animate-pulse">
            <div className="bg-gray-200 rounded h-8 w-3/4"></div>
            <div className="bg-gray-200 rounded-full h-10 w-10"></div>
          </div>

          {/* Price Drop Banner Skeleton */}
          <div className="bg-gray-200 rounded-[4px] h-6 w-48 animate-pulse"></div>

          {/* Pricing Section Skeleton */}
          <div className="animate-pulse">
            <div className="flex items-center space-x-[12px]">
              <div className="bg-gray-200 rounded h-6 w-20"></div>
              <div className="bg-gray-200 rounded h-4 w-16"></div>
              <div className="bg-gray-200 rounded h-3 w-12"></div>
            </div>
          </div>

          {/* Payment and Offer Card Skeleton */}
          <div className="bg-gray-100 rounded-[14px] p-[12px] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="bg-gray-200 rounded h-4 w-24 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 w-32"></div>
              </div>
              <div className="bg-gray-200 rounded h-8 w-16"></div>
            </div>
          </div>

          {/* Feature Highlights Skeleton */}
          <div className="animate-pulse">
            <div className="flex justify-between">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[44px] h-[44px] bg-gray-200 rounded-full mb-[12px]"></div>
                  <div className="bg-gray-200 rounded h-3 w-16"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Size Selection Skeleton */}
          <div className="bg-white rounded-[14px] p-[12px] border border-[#f0f0f0] animate-pulse">
            <div className="bg-gray-200 rounded h-4 w-20 mb-2"></div>
            <div className="flex space-x-[8px]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Combo Offer Section Skeleton */}
          <div className="bg-white rounded-[14px] p-[12px] border border-[#f0f0f0] animate-pulse">
            <div className="bg-gray-200 rounded h-4 w-24 mb-3"></div>
            <div className="space-y-3">
              <div className="bg-gray-200 rounded-[14px] h-16"></div>
              <div className="bg-gray-200 rounded-[12px] h-16"></div>
            </div>
          </div>

          {/* Service Guarantees Section Skeleton */}
          <div className="flex justify-between items-center animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-[8px]">
                <div className="w-[36px] h-[36px] bg-gray-200 rounded"></div>
                <div className="bg-gray-200 rounded h-3 w-20"></div>
              </div>
            ))}
          </div>

          {/* Bottom spacing for sticky buttons */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Sticky Buttons Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 animate-pulse">
        <div className="max-w-md mx-auto flex space-x-3">
          <div className="flex-1 bg-gray-200 rounded-lg h-12"></div>
          <div className="flex-1 bg-gray-200 rounded-lg h-12"></div>
        </div>
      </div>
    </div>
  );
}
