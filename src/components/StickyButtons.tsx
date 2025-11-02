'use client';

import React from 'react';

interface StickyButtonsProps {
  onAddToCart: () => void;
  isAddingToCart: boolean;
  disabled?: boolean;
}

export default function StickyButtons({
  onAddToCart,
  isAddingToCart,
  disabled = false
}: StickyButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3">
        <button
          onClick={onAddToCart}
          disabled={disabled || isAddingToCart}
          className="w-full h-[56px] bg-[#FFD100] text-black font-semibold rounded-[16px] uppercase text-[20px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding...
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
}
