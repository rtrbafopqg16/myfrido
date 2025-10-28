'use client';

import React from 'react';

interface StickyButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAddingToCart: boolean;
  isDirectCheckout: boolean;
  disabled?: boolean;
}

export default function StickyButtons({
  onAddToCart,
  onBuyNow,
  isAddingToCart,
  isDirectCheckout,
  disabled = false
}: StickyButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex gap-3">
          {/* ADD TO CART Button */}
          <button
            onClick={onAddToCart}
            disabled={disabled || isAddingToCart}
            className="flex-1 bg-black text-white font-semibold py-3 px-4 rounded-lg uppercase text-sm tracking-wide hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
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

          {/* BUY NOW Button */}
          <button
            onClick={onBuyNow}
            disabled={disabled || isDirectCheckout}
            className="flex-1 bg-yellow-400 text-black font-semibold py-3 px-4 rounded-lg uppercase text-sm tracking-wide hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {isDirectCheckout ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              'Buy Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
