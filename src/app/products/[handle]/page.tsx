'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HeartIcon, ShareIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/CartContext';
import { Product, MediaImage, Video } from '@/lib/shopify';
import { urlFor } from '@/lib/sanity';
import type { ProductFeatures, ProductDescription, ProductHighlights as ProductHighlightsType, ProductFAQs as ProductFAQsType, ProductGallery as ProductGalleryType, ProductGuides } from '@/lib/sanity';
import OptimizedImage from '@/components/OptimizedImage';

import ProductGallery from '@/components/ProductGalleryOptimized';
import BankOffers from '@/components/BankOffers';
import StickyButtons from '@/components/StickyButtons';
import ProductDescriptionAccordion from '@/components/ProductDescriptionAccordion';
import ProductHighlights from '@/components/ProductHighlights';
import ProductFAQs from '@/components/ProductFAQs';
import ProductPageSkeleton from '@/components/ProductPageSkeleton';
import dynamic from 'next/dynamic';

// Lazy load popups to avoid blocking initial render
const HowToUsePopup = dynamic(() => import('@/components/HowToUsePopup'), {
  ssr: false,
  loading: () => null, // No loading indicator needed - popups only render when opened
});

const SizeChartPopup = dynamic(() => import('@/components/SizeChartPopup'), {
  ssr: false,
  loading: () => null, // No loading indicator needed - popups only render when opened
});

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [productFeatures, setProductFeatures] = useState<ProductFeatures | null>(null);
  const [productDescription, setProductDescription] = useState<ProductDescription | null>(null);
  const [productHighlights, setProductHighlights] = useState<ProductHighlightsType | null>(null);
  const [productFAQs, setProductFAQs] = useState<ProductFAQsType | null>(null);
  const [productGallery, setProductGallery] = useState<ProductGalleryType | null>(null);
  const [productGuides, setProductGuides] = useState<ProductGuides | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCombo, setSelectedCombo] = useState<'single' | 'double'>('single');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);

  useEffect(() => {
    const fetchProductAndFeatures = async () => {
      if (!params.handle) return;

      try {
        // Start both API calls in parallel for better performance
        const [shopifyResponse, sanityResponse] = await Promise.allSettled([
          fetch(`/api/products/${params.handle}`),
          fetch(`/api/sanity/${params.handle}?type=all`, {
            // Add caching headers
            headers: {
              'Cache-Control': 'max-age=300',
            },
          })
        ]);

        // Handle Shopify response
        if (shopifyResponse.status === 'fulfilled' && shopifyResponse.value.ok) {
          const data = await shopifyResponse.value.json();
          console.log('Product page - API Response:', data);
          setProduct(data);
          if (data.variants && data.variants.nodes && data.variants.nodes.length > 0) {
            setSelectedVariant(data.variants.nodes[0].id);
          }
          // Show product immediately when Shopify data is ready
          setIsLoading(false);
        }

        // Handle Sanity response (non-blocking)
        if (sanityResponse.status === 'fulfilled' && sanityResponse.value.ok) {
          const sanityData = await sanityResponse.value.json();
          console.log('Sanity data received:', sanityData);
          setProductFeatures(sanityData.features);
          setProductDescription(sanityData.description);
          setProductHighlights(sanityData.highlights);
          setProductFAQs(sanityData.faqs);
          setProductGallery(sanityData.gallery);
          setProductGuides(sanityData.guides);
        } else if (sanityResponse.status === 'rejected') {
          console.warn('Failed to fetch Sanity data:', sanityResponse.reason);
        }

      } catch (error) {
        console.error('Error fetching product or features:', error);
        setIsLoading(false);
      }
    };

    fetchProductAndFeatures();
  }, [params.handle]);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Get current variant's price info
  const getCurrentVariantPrice = () => {
    if (!product || !selectedVariant) {
      return {
        price: parseFloat(product?.priceRange.minVariantPrice.amount || '0'),
        compareAtPrice: product?.compareAtPriceRange?.minVariantPrice ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount) : null,
        currencyCode: product?.priceRange.minVariantPrice.currencyCode || 'INR'
      };
    }
    
    const variant = product.variants?.nodes?.find(v => v.id === selectedVariant);
    if (!variant) {
      return {
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        compareAtPrice: product.compareAtPriceRange?.minVariantPrice ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount) : null,
        currencyCode: product.priceRange.minVariantPrice.currencyCode
      };
    }
    
    return {
      price: parseFloat(variant.price.amount),
      compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null,
      currencyCode: variant.price.currencyCode
    };
  };

  // Combo pricing calculations
  const getComboPricing = () => {
    if (!product || !selectedVariant) {
      return {
        singlePrice: 0,
        doublePrice: 0,
        savings: 0,
        originalDoublePrice: 0,
        currencyCode: product?.priceRange.minVariantPrice.currencyCode || 'INR'
      };
    }
    
    // Get the actual selected variant's price
    const variant = product.variants?.nodes?.find(v => v.id === selectedVariant);
    if (!variant) {
      return {
        singlePrice: 0,
        doublePrice: 0,
        savings: 0,
        originalDoublePrice: 0,
        currencyCode: product.priceRange.minVariantPrice.currencyCode
      };
    }
    
    const singlePrice = parseFloat(variant.price.amount);
    const packDiscount = 99; // Fixed discount for pack of 2
    const originalDoublePrice = singlePrice * 2; // Original price for 2 units
    const finalDoublePrice = originalDoublePrice - packDiscount; // Final price for 2 units (₹99 discount)
    const savings = packDiscount; // Fixed ₹99 savings
    
    return {
      singlePrice,
      doublePrice: finalDoublePrice,
      savings,
      originalDoublePrice,
      currencyCode: variant.price.currencyCode
    };
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    // Verify the selected variant before adding
    const variant = product?.variants?.nodes?.find(v => v.id === selectedVariant);
    console.log('Adding to cart - Selected variant:', {
      variantId: selectedVariant,
      variantTitle: variant?.title,
      options: variant?.selectedOptions
    });
    
    setIsAddingToCart(true);
    try {
      await addToCart(selectedVariant, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDirectCheckout = async () => {
    if (!selectedVariant) return;
    
    setIsDirectCheckout(true);
    try {
      // Add to cart first
      await addToCart(selectedVariant, quantity);
      
      // Wait a moment for cart to update, then redirect to checkout
      setTimeout(() => {
        // Get the cart from localStorage and redirect to checkout
        const cartId = localStorage.getItem('shopify-cart-id');
        if (cartId) {
          // Fetch cart to get checkout URL
          fetch(`/api/cart/${encodeURIComponent(cartId)}`)
            .then(response => response.json())
            .then(cart => {
              if (cart.checkoutUrl) {
                window.location.href = cart.checkoutUrl;
              }
            })
            .catch(error => {
              console.error('Error getting checkout URL:', error);
              setIsDirectCheckout(false);
            });
        }
      }, 1000);
    } catch (error) {
      console.error('Error in direct checkout:', error);
      setIsDirectCheckout(false);
    }
  };

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  // Debug info
  console.log('Product page - product state:', product);
  console.log('Product page - selectedVariant:', selectedVariant);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <a href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse all products
          </a>
        </div>
      </div>
    );
  }

  // Get current variant pricing
  const currentVariantPrice = getCurrentVariantPrice();
  const pricing = getComboPricing();

  const hasDiscount = currentVariantPrice.compareAtPrice && 
    currentVariantPrice.compareAtPrice > currentVariantPrice.price;

  const discountPercentage = hasDiscount ? 
    Math.round(((currentVariantPrice.compareAtPrice! - currentVariantPrice.price) / currentVariantPrice.compareAtPrice!) * 100) : 0;

  // Get media items (images and videos)
  const mediaItems = product.media?.nodes || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        {/* Product Gallery */}
        <div className="">
            <ProductGallery product={product} sanityGallery={productGallery} />
          </div>
        <div className="p-[20px] flex flex-col gap-[20px] bg-[#fff]">
          {/* Rating and Hot Selling Section */}
            <div className="flex items-center space-x-[12px]">
            <div className="border-[1px] border-[#dddddd] rounded-[4px] p-[4px]">
                <div className="flex items-center leading-none">
                  🔥
                  <span className="text-black text-[16px] leading-none font-medium">Hot Selling</span>
                </div>
              </div>
              <div className="flex items-center gap-[4px] ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <rect width="16" height="16" fill="white"/>
  <path d="M7.9991 12.173L3.2968 14.8051L4.34702 9.51961L0.390625 5.86087L5.74198 5.22638L7.9991 0.333008L10.2562 5.22638L15.6075 5.86087L11.6512 9.51961L12.7014 14.8051L7.9991 12.173Z" fill="#22C5A0"/>
</svg>
                <span className="font-bold text-[#131313] text-[16px]">5</span>
                <span className="text-[#afafaf] text-[16px]">(29 Reviews)</span>
              </div>
              
            </div>
            
         

          {/* Product Title */}
          <div className='flex items-start justify-between'>
          <h1 className="text-[28px] font-semibold text-black leading-[1]">{product.title}</h1>

                <button
                  onClick={handleShare}
              className=" border-[1px] border-[#d9d9d9] h-[40px] w-[40px] rounded-full flex p-[10px] items-center justify-center "
                  aria-label="Share product"
                >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.9368 14.1857L7.43766 12.2771C6.82938 12.9272 5.96376 13.3334 5.00326 13.3334C3.16231 13.3334 1.66992 11.841 1.66992 10.0001C1.66992 8.15913 3.16231 6.66675 5.00326 6.66675C5.96371 6.66675 6.8293 7.07296 7.43757 7.72296L10.9368 5.81436C10.8713 5.55376 10.8366 5.28097 10.8366 5.00008C10.8366 3.15913 12.329 1.66675 14.1699 1.66675C16.0108 1.66675 17.5033 3.15913 17.5033 5.00008C17.5033 6.84103 16.0108 8.33342 14.1699 8.33342C13.2094 8.33342 12.3438 7.92717 11.7355 7.27713L8.2364 9.18575C8.30184 9.44633 8.33659 9.71916 8.33659 10.0001C8.33659 10.281 8.30185 10.5537 8.23643 10.8143L11.7356 12.723C12.3438 12.073 13.2094 11.6667 14.1699 11.6667C16.0108 11.6667 17.5033 13.1592 17.5033 15.0001C17.5033 16.841 16.0108 18.3334 14.1699 18.3334C12.329 18.3334 10.8366 16.841 10.8366 15.0001C10.8366 14.7192 10.8713 14.4463 10.9368 14.1857ZM5.00326 11.6667C5.92373 11.6667 6.66992 10.9206 6.66992 10.0001C6.66992 9.07958 5.92373 8.33342 5.00326 8.33342C4.08278 8.33342 3.33659 9.07958 3.33659 10.0001C3.33659 10.9206 4.08278 11.6667 5.00326 11.6667ZM14.1699 6.66675C15.0904 6.66675 15.8366 5.92056 15.8366 5.00008C15.8366 4.07961 15.0904 3.33341 14.1699 3.33341C13.2494 3.33341 12.5033 4.07961 12.5033 5.00008C12.5033 5.92056 13.2494 6.66675 14.1699 6.66675ZM14.1699 16.6667C15.0904 16.6667 15.8366 15.9206 15.8366 15.0001C15.8366 14.0796 15.0904 13.3334 14.1699 13.3334C13.2494 13.3334 12.5033 14.0796 12.5033 15.0001C12.5033 15.9206 13.2494 16.6667 14.1699 16.6667Z" fill="black"/>
              </svg>
                </button>
          </div>

          {/* Price Drop Banner */}
          <div className="bg-[#1ea04a] w-fit rounded-[4px] p-[4px] ">
            <div className="flex items-center">
              
              <span className="text-white font-medium text-[14px] leading-none">7% Price drop with new GST</span>
              </div>
            </div>

          {/* Pricing Section */}
          <div className="">
            <div className="flex items-center space-x-[12px]">
              <span className="text-[24px] font-semibold leading-[1] text-gray-900">
                  {formatPrice(currentVariantPrice.price.toString(), currentVariantPrice.currencyCode)}
                </span>
                {hasDiscount && (
                <div className="flex items-center space-x-[4px]">
                  <span className='text-[14px] text-[#808080]'>MRP</span>
                  <span className="text-[14px] text-[#808080] line-through">
                      {formatPrice(currentVariantPrice.compareAtPrice!.toString(), currentVariantPrice.currencyCode)}
                    </span>
                  <span className="bg-black text-white text-[13px] leading-none rounded-[4px] p-[4px] font-medium ml-[8px] ">
                    {discountPercentage}% OFF
                    </span>
                </div>
                
              )}
             <p className="text-[#808080] text-[12px]">Incl. of all taxes</p>

            </div>
          </div>

          

          {/* Payment and Offer Card */}
           <div className="bg-[#edfaf0] rounded-[14px] p-[12px] ">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-[12px] h-[12px] bg-[#16803a] rounded-full flex items-center justify-center mr-[3px]">
                    <span className="text-white text-[10px] font-bold">%</span>
                  </div>
                  <span className="text-[#16803a] text-[12px] font-medium">10% Cashback*</span>
                </div>
                <div className='flex items-center gap-[4px]'>
                <p className="text-[#99b6a0] text-[14px] "><strong className='text-[#000]'>₹281/month</strong> at <b className='text-[#000]'>0% EMI</b> on</p>
                <div className="flex items-center h-[11px]">
                  <img src="https://cdn.shopify.com/s/files/1/0553/0419/2034/files/UPI_Logo_nopadding_54e42ac1-1693-4bfa-b2df-f7b1aaf09dbb.png" alt="UPI" className='h-full' />
                </div>
                </div>
                
              </div>
              <div className="h-[38px] pl-[20px] border-l border-[#ddd]">
              <img src="https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Frido_Pay_Later_LOGO_1.png" alt="payLater" className='h-[38px]' />

              </div>
              </div>
            </div>

          {/* Feature Highlights */}
          {productFeatures && productFeatures.features && productFeatures.features.length > 0 && (
            <div className="">
              <div className="flex justify-between">
                {productFeatures.features.map((feature, index) => (
                  <div key={feature._key} className="flex flex-col items-center w-fit">
                    <div className="w-[44px] h-[44px] overflow-hidden rounded-full bg-[#f7f7f7] flex items-center justify-center mb-[12px]">
                      {feature.icon ? (
                        typeof feature.icon === 'string' ? (
                          // Handle URL string (from Shopify CDN)
                          <img
                            src={feature.icon}
                            alt={feature.title}
                            className="w-full h-full"
                          />
                        ) : (
                          // Handle Sanity image asset
                          <OptimizedImage
                            src={urlFor(feature.icon).width(32).height(32).url()}
                            alt={feature.title}
                            width={32}
                            height={32}
                            className="w-full h-full"
                          />
                        )
                      ) : (
                        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-[#7e7e7e] text-[14px] leading-[1] text-center w-fit">{feature.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )} 


          {/* Size Selection */}
            {product.options && product.options.length > 0 && (
            <div className="bg-white rounded-[14px] p-[12px] border border-[#f0f0f0]">
                {product.options.map((option) => (
                <div key={option.id}>
                    <p className="text-[#bcbcbc] font-light text-[14px] mb-[8px]">{option.name}: <span className="font-regular text-[14px] text-[#636363]">
                      {selectedVariant && product.variants?.nodes?.find(v => 
                        v.id === selectedVariant && v.selectedOptions.some(so => so.name === option.name)
                      )?.selectedOptions.find(so => so.name === option.name)?.value || option.values[0]}
                    </span></p>
                  <div className="flex space-x-[8px]">
                    {option.values.map((value, index) => (
                        <button
                          key={value}
                        onClick={() => {
                          // Get currently selected variant to preserve other options
                          const currentVariant = product.variants?.nodes?.find(v => v.id === selectedVariant);
                          
                          // Find the variant that matches ALL selected options
                          // First, build a map of what options should be selected
                          const optionsToMatch = new Map<string, string>();
                          
                          // Preserve other options from current selection
                          if (currentVariant) {
                            currentVariant.selectedOptions.forEach(opt => {
                              if (opt.name !== option.name) {
                                optionsToMatch.set(opt.name, opt.value);
                              }
                            });
                          }
                          
                          // Set the new option value
                          optionsToMatch.set(option.name, value);
                          
                          // Find variant that matches ALL options
                          const variant = product.variants?.nodes?.find(v => {
                            // Check if variant has all the required options
                            return Array.from(optionsToMatch.entries()).every(([optName, optValue]) => 
                              v.selectedOptions.some(so => so.name === optName && so.value === optValue)
                            ) && v.selectedOptions.length === optionsToMatch.size;
                          });
                          
                          if (variant) {
                            setSelectedVariant(variant.id);
                            console.log('Selected variant:', variant.id, variant.selectedOptions);
                          } else {
                            console.warn('No variant found matching options:', Array.from(optionsToMatch.entries()));
                          }
                        }}
                        className={`w-[40px] h-[40px] border-[1px] rounded-full flex items-center justify-center mb-[12px] ${
                          selectedVariant && product.variants?.nodes?.find(v => 
                            v.id === selectedVariant && v.selectedOptions.some(so => so.name === option.name && so.value === value)
                          ) 
                            ? 'border-[#FFD100] bg-[#FFFAE6]' 
                            : 'border-[#f0f0f0]'
                        }`}
                      >
                        <span className="text-black text-[16px] font-medium">{value}</span>
                        </button>
                      ))}
                    </div>
                  <div className="flex items-center justify-between bg-[#EAF2FC] rounded-[12px] p-[12px]">
                    <div className="flex items-center gap-[6px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <g clip-path="url(#clip0_1730_8514)">
                        <path d="M9 14.9062C9 15.372 8.616 15.75 8.14275 15.75H3.85725C3.74556 15.7509 3.63479 15.7298 3.53126 15.6878C3.42773 15.6459 3.33347 15.584 3.25387 15.5057C3.17427 15.4273 3.11088 15.3341 3.06732 15.2312C3.02376 15.1284 3.00088 15.0179 3 14.9062V3C3 2.80109 3.07902 2.61032 3.21967 2.46967C3.36032 2.32902 3.55109 2.25 3.75 2.25H8.14275C8.616 2.25 9 2.628 9 3.09375V14.9062Z" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 6.75H7.5" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 4.5H6.75" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 9H6.75" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 13.5H6.75" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 11.25H7.5" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.75 2.25H12.75" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14.25 2.25V15.75" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.75 15.75H12.75" stroke="#307FE2" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_1730_8514">
                          <rect width="18" height="18" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="text-[#307FE2] text-[14px] font-medium leading-none underline">{option.name} Guide</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M14.25 9H3.75" stroke="#7AADEC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14.25 9L9.75 13.5" stroke="#7AADEC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14.25 9L9.75 4.5" stroke="#7AADEC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {/* Combo Offer Section */}
          {product && (
            <div className="flex flex-col gap-[12px] bg-white rounded-[14px] p-[12px] border border-[#f0f0f0]">
               <p className="text-[#bcbcbc] font-light text-[14px]">Combo Offer: <span className="font-medium text-[#636363]">{selectedCombo === 'single' ? 'Buy 1 unit' : 'Buy 2 units'}</span></p>
              
              {(() => {
                return (
                  <>
                    {/* Buy 1 Unit Option */}
                    <div 
                      className={`rounded-[14px] px-[12px] py-[16px] border cursor-pointer transition-all ${
                        selectedCombo === 'single' 
                          ? 'border-[#FFD100] bg-[#FFFAE6]' 
                            : 'border-[#f0f0f0]'
                      }`}
                      onClick={() => {
                        setSelectedCombo('single');
                        setQuantity(1);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-normal text-black text-[14px]">Buy 1 Unit</span>
                        <span className="font-medium text-black text-[18px]">
                          {formatPrice(pricing.singlePrice.toString(), pricing.currencyCode)}
                        </span>
                      </div>
                    </div>

                    {/* Buy 2 Units Option */}
                    <div className="relative">
                      <div 
                        className={`rounded-[12px] px-[12px] py-[16px] border cursor-pointer transition-all ${
                          selectedCombo === 'double' 
                            ? 'border-[#FFD100] bg-[#FFFAE6]' 
                            : 'border-[#f0f0f0]'
                        }`}
                        onClick={() => {
                          setSelectedCombo('double');
                          setQuantity(2);
                        }}
                      >
                        {/* Best Seller Badge */}
                        <div className="absolute -top-[8px] left-[12px] bg-black text-white text-[10px] font-bold px-[8px] py-[2px] rounded-[4px]">
                          Best Seller 40% OFF
                        </div>
                        
                        <div className="flex justify-between items-center ">
                          <span className="font-normal text-black text-[14px]">Buy 2 Units</span>
                          <div className="flex flex-col items-end">
                            <span className="text-[#4CAF50] text-[14px] leading-[1] mb-[4px] font-medium">
                              SAVE {formatPrice(pricing.savings.toString(), pricing.currencyCode)}
                            </span>
                            <span className="font-semibold leading-[1] text-[18px] text-black">
                              {formatPrice(pricing.doublePrice.toString(), pricing.currencyCode)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            )}

          {/* Bank Offers Section */}
          <BankOffers 
            orientation="horizontal"
            maxWidth="full"
            className=""
          />
          <div className='flex flex-col gap-[12px]'>
            {/* How to Use Card */}
            <div 
              onClick={() => setIsHowToUseOpen(true)}
              className="bg-gradient-to-r from-[#E7F2FF] to-[#F7FAFF] rounded-[8px] p-[6px] flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-[8px]">
                <div className="w-[40px] h-[40px] bg-white rounded-[8px] flex items-center justify-center">
                  <PlayIcon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-[#506073] text-[16px] font-medium">How to Use?</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_3301_6291)">
                  <path d="M7 17L17 7" stroke="#506073" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 16V7H8" stroke="#506073" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3301_6291">
                    <rect width="24" height="24" fill="white" transform="matrix(1 0 0 -1 0 24)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Measure your perfect fit Card */}
            <div 
              onClick={() => setIsSizeChartOpen(true)}
              className="bg-gradient-to-r from-[#E7F2FF] to-[#F7FAFF] rounded-[8px] p-[6px] flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-[8px]">
                <div className="w-[44px] h-[44px] bg-white rounded-[8px] flex items-center justify-center overflow-hidden">
                  <OptimizedImage src="https://cdn.shopify.com/s/files/1/0553/0419/2034/files/PostureCorrector_HowtoMeasure.jpg" alt="Measure your perfect fit" width={44} height={44} />
                </div>
                <span className="text-[#506073] text-[16px] font-medium">Measure your perfect fit</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_3301_6291)">
                  <path d="M7 17L17 7" stroke="#506073" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 16V7H8" stroke="#506073" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3301_6291">
                    <rect width="24" height="24" fill="white" transform="matrix(1 0 0 -1 0 24)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          

          {/* Service Guarantees Section */}
          <div className="flex justify-between items-center ">
            {/* 7-Day Free Returns */}
            <div className="flex flex-col items-center gap-[8px]">
         
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <g clip-path="url(#clip0_1896_912)">
                  <path d="M18 31.5L6 24.75V11.25L18 4.5L30 11.25V18" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 18L30 11.25" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 18V31.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 18L6 11.25" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M33 27H22.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M27 22.5L22.5 27L27 31.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M24 7.875L12 14.625" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_1896_912">
                    <rect width="36" height="36" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              
              <span className="text-[#808080] text-[14px] font-medium leading-[1] text-center">7-Day Free Returns</span>
            </div>

            {/* Free Doorstep Delivery */}
            <div className="flex flex-col items-center gap-[8px]">
            
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <g clip-path="url(#clip0_1896_923)">
                  <path d="M7.5 25.5C7.5 26.2956 7.81607 27.0587 8.37868 27.6213C8.94129 28.1839 9.70435 28.5 10.5 28.5C11.2956 28.5 12.0587 28.1839 12.6213 27.6213C13.1839 27.0587 13.5 26.2956 13.5 25.5C13.5 24.7044 13.1839 23.9413 12.6213 23.3787C12.0587 22.8161 11.2956 22.5 10.5 22.5C9.70435 22.5 8.94129 22.8161 8.37868 23.3787C7.81607 23.9413 7.5 24.7044 7.5 25.5Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22.5 25.5C22.5 26.2956 22.8161 27.0587 23.3787 27.6213C23.9413 28.1839 24.7044 28.5 25.5 28.5C26.2956 28.5 27.0587 28.1839 27.6213 27.6213C28.1839 27.0587 28.5 26.2956 28.5 25.5C28.5 24.7044 28.1839 23.9413 27.6213 23.3787C27.0587 22.8161 26.2956 22.5 25.5 22.5C24.7044 22.5 23.9413 22.8161 23.3787 23.3787C22.8161 23.9413 22.5 24.7044 22.5 25.5Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.5 25.5H4.5V19.5M3 7.5H19.5V25.5M13.5 25.5H22.5M28.5 25.5H31.5V16.5M31.5 16.5H19.5M31.5 16.5L27 9H19.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.5 13.5H10.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_1896_923">
                    <rect width="36" height="36" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              
              <span className="text-[#808080] text-[14px] font-medium leading-[1] text-center">Free Doorstep Delivery</span>
                </div>

            {/* Safe & Secure Payments */}
            <div className="flex flex-col items-center gap-[8px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M19.5 31.5H10.5C9.70435 31.5 8.94129 31.1839 8.37868 30.6213C7.81607 30.0587 7.5 29.2956 7.5 28.5V19.5C7.5 18.7044 7.81607 17.9413 8.37868 17.3787C8.94129 16.8161 9.70435 16.5 10.5 16.5H25.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.5 24C16.5 24.3978 16.658 24.7794 16.9393 25.0607C17.2206 25.342 17.6022 25.5 18 25.5C18.3978 25.5 18.7794 25.342 19.0607 25.0607C19.342 24.7794 19.5 24.3978 19.5 24C19.5 23.6022 19.342 23.2206 19.0607 22.9393C18.7794 22.658 18.3978 22.5 18 22.5C17.6022 22.5 17.2206 22.658 16.9393 22.9393C16.658 23.2206 16.5 23.6022 16.5 24Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 16.5V10.5C12 8.9087 12.6321 7.38258 13.7574 6.25736C14.8826 5.13214 16.4087 4.5 18 4.5C19.5913 4.5 21.1174 5.13214 22.2426 6.25736C23.3679 7.38258 24 8.9087 24 10.5V16.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M31.5 22.5H27.75C27.1533 22.5 26.581 22.7371 26.159 23.159C25.7371 23.581 25.5 24.1533 25.5 24.75C25.5 25.3467 25.7371 25.919 26.159 26.341C26.581 26.7629 27.1533 27 27.75 27H29.25C29.8467 27 30.419 27.2371 30.841 27.659C31.2629 28.081 31.5 28.6533 31.5 29.25C31.5 29.8467 31.2629 30.419 30.841 30.841C30.419 31.2629 29.8467 31.5 29.25 31.5H25.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M28.5 31.5V33M28.5 21V22.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
              <span className="text-[#808080] text-[14px] font-medium leading-[1] text-center">Safe & Secure Payments</span>
            </div>
          </div>
   
          


          {/* Product Description Accordion */}
          <ProductDescriptionAccordion
            description={productDescription?.description || product?.description}
            productDetails={productDescription?.productDetails}
            returnsAndRefunds={productDescription?.returnsAndRefunds}
            careInstructions={productDescription?.careInstructions}
            className="mb-6"
          />

            {/* Product Highlights */}
            {productHighlights && (
            <ProductHighlights
              title={productHighlights.title}
              highlights={productHighlights.highlights}
              className="mb-6"
            />
          )}

          {/* Product FAQs */}
          {productFAQs && (
            <ProductFAQs
              title={productFAQs.title}
              faqs={productFAQs.faqs}
              className="mb-6"
            />
          )}

  
        </div>
      </div>

      {/* Popups */}
      <HowToUsePopup
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
        videoUrl={productGuides?.howToUse?.videoUrl || 'https://cdn.shopify.com/videos/c/o/v/77427aa5e95b487c85a330da1e3a81fe.mp4'}
        productTitle={product?.title || ''}
      />

      <SizeChartPopup
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        tabs={
          productGuides?.sizeChart?.tabs?.map(tab => ({
            tabName: tab.tabName,
            image: {
              url: tab.image ? urlFor(tab.image).width(800).url() : 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/PostureCorrector_HowtoMeasure.jpg',
              alt: tab.image?.alt
            },
            description: tab.description
          })) || [
            {
              tabName: 'Product Dimensions',
              image: {
                url: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/SizeGuide_PC_1.png',
                alt: 'Product Dimensions'
              },
              description: ''
            },
            {
              tabName: 'How to Measure',
              image: {
                url: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/PostureCorrector_HowtoMeasure.jpg',
                alt: 'How to Measure'
              },
              description: 'Measure around the widest part of your chest with a tape measure for the perfect fit posture support.'
            }
          ]
        }
      />

      {/* Sticky Buttons */}
      <StickyButtons
        onAddToCart={handleAddToCart}
        onBuyNow={handleDirectCheckout}
        isAddingToCart={isAddingToCart}
        isDirectCheckout={isDirectCheckout}
        disabled={!product.availableForSale}
      />
    </div>
  );
}