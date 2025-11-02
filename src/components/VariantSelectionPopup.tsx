'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Product } from '@/lib/shopify';

interface VariantSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (variantIds: string[]) => void;
  isAddingToCart: boolean;
}

export default function VariantSelectionPopup({
  isOpen,
  onClose,
  product,
  onConfirm,
  isAddingToCart
}: VariantSelectionPopupProps) {
  const [unit1Variant, setUnit1Variant] = useState<string>('');
  const [unit2Variant, setUnit2Variant] = useState<string>('');

  // Get size option name
  const sizeOptionName = product?.options?.find(opt => 
    opt.name.toLowerCase().includes('size') || 
    opt.name.toLowerCase().includes('s/m/l') ||
    opt.values.length <= 10 // Assume it's size if it has reasonable number of values
  )?.name || product?.options?.[0]?.name || 'Size';

  // Get size option values
  const sizeValues = product?.options?.find(opt => opt.name === sizeOptionName)?.values || [];

  useEffect(() => {
    if (isOpen && product) {
      // Initialize with first available variant for each unit
      if (product.variants?.nodes && product.variants.nodes.length > 0) {
        const firstVariant = product.variants.nodes[0];
        setUnit1Variant(firstVariant.id);
        
        // For unit 2, try to find a different variant if possible
        const secondVariant = product.variants.nodes.length > 1 
          ? product.variants.nodes[1] 
          : firstVariant;
        setUnit2Variant(secondVariant.id);
      }
      
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product]);

  // Get variant ID based on selected size for a unit
  const getVariantBySize = (size: string, currentVariantId: string) => {
    if (!product?.variants?.nodes) return currentVariantId;
    
    // Try to find variant with this size
    const variant = product.variants.nodes.find(v => {
      const sizeOption = v.selectedOptions.find(opt => opt.name === sizeOptionName);
      return sizeOption?.value === size;
    });
    
    return variant?.id || currentVariantId;
  };

  // Get current size for a variant
  const getSizeForVariant = (variantId: string) => {
    if (!product?.variants?.nodes) return '';
    const variant = product.variants.nodes.find(v => v.id === variantId);
    if (!variant) return '';
    
    const sizeOption = variant.selectedOptions.find(opt => opt.name === sizeOptionName);
    return sizeOption?.value || '';
  };

  const handleSizeSelect = (unit: 1 | 2, size: string) => {
    if (unit === 1) {
      const variantId = getVariantBySize(size, unit1Variant);
      setUnit1Variant(variantId);
    } else {
      const variantId = getVariantBySize(size, unit2Variant);
      setUnit2Variant(variantId);
    }
  };

  const handleConfirm = () => {
    if (unit1Variant && unit2Variant) {
      onConfirm([unit1Variant, unit2Variant]);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-t-[24px] md:rounded-[24px] w-full max-w-md mx-auto max-h-[90vh] overflow-hidden shadow-2xl p-[20px] flex flex-col gap-[20px]">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 ">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] tracking-[-1px] font-normal text-black">Confirm Size Selection</h2>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto ">
          {/* Unit 1 Selection */}
          <div className="mb-[20px] border border-[#f0f0f0] rounded-[14px] p-[12px]">
            <p className="text-[14px] mb-[10px] text-[#bcbcbc] ">Unit 1: <span className="text-[#636363] font-medium">{getSizeForVariant(unit1Variant) || sizeValues[0] || '-'}</span></p>

              <div className="flex gap-[8px]">
                {sizeValues.map((size) => {
                  const currentSize = getSizeForVariant(unit1Variant);
                  const isSelected = currentSize === size;
                  
                  return (
                    <button
                      key={`unit1-${size}`}
                      onClick={() => handleSizeSelect(1, size)}
                      className={`w-[40px] h-[40px] rounded-full border-[1px] flex items-center justify-center font-medium text-[16px] text-black transition-all ${
                        isSelected
                          ? 'border-[#FFD100] bg-[#FFFAE6] '
                          : 'border-[#f0f0f0] bg-white '
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
          </div>

          {/* Unit 2 Selection */}
          <div className=" border border-[#f0f0f0] rounded-[14px] p-[12px]">
          <p className="text-[14px] mb-[10px] text-[#bcbcbc] ">Unit 2: <span className="text-[#636363] font-medium">{getSizeForVariant(unit2Variant) || sizeValues[0] || '-'}</span></p>

           
              <div className="flex gap-[8px]">
                {sizeValues.map((size) => {
                  const currentSize = getSizeForVariant(unit2Variant);
                  const isSelected = currentSize === size;
                  
                  return (
                    <button
                      key={`unit2-${size}`}
                      onClick={() => handleSizeSelect(2, size)}
                      className={`w-[40px] h-[40px] rounded-full border-[1px] flex items-center justify-center font-medium text-[16px] text-black transition-all ${
                        isSelected
                          ? 'border-[#FFD100] bg-[#FFFAE6] '
                          : 'border-[#f0f0f0] bg-white '
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            
          </div>

          {/* Size Guide Link */}
          {/* <div className="bg-[#E7F2FF] rounded-[12px] p-4 mb-4">
            <button
              className="w-full flex items-center justify-between hover:bg-[#D9EBFF] transition-colors rounded-[12px] p-2"
              onClick={() => {
                // Close variant selection and open size chart
                onClose();
                // Dispatch event to open size chart - the product page will listen for this
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('openSizeChart'));
                }, 100);
              }}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g clipPath="url(#clip0_1896_912)">
                    <path d="M9 15.75L3 12.375V5.625L9 2.25L15 5.625V9" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9L15 5.625" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9V15.75" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9L3 5.625" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 13.5H11.25" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.5 11.25L11.25 13.5L13.5 15.75" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3.9375L6 7.3125" stroke="#307FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1896_912">
                      <rect width="18" height="18" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[#307FE2] text-[14px] font-medium underline">Size Guide</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M14.25 9H3.75" stroke="#7AADEC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.25 9L9.75 13.5" stroke="#7AADEC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.25 9L9.75 4.5" stroke="#7AADEC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div> */}
        </div>

        {/* Footer Button */}
        <div className="sticky bottom-0 ">
          <button
            onClick={handleConfirm}
            disabled={!unit1Variant || !unit2Variant || isAddingToCart}
            className="w-full bg-[#FFD100] text-black text-[20px] font-bold h-[56px] rounded-[16px] hover:bg-[#FFE55C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors uppercase"
          >
            {isAddingToCart ? 'Adding...' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
}

