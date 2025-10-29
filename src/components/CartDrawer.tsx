'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ArrowLeftIcon, 
  MinusIcon, 
  PlusIcon, 
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TruckIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import BankOffers from './BankOffers';
import OffersPopup from './OffersPopup';
import { Product } from '@/lib/shopify';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, isLoading, updateCartItem, removeFromCart, addToCart } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [isCancellationExpanded, setIsCancellationExpanded] = useState(false);
  const [isOffersPopupOpen, setIsOffersPopupOpen] = useState(false);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Fetch recommended products
  useEffect(() => {
    if (isOpen && cart && cart.lines.nodes.length > 0) {
      setIsLoadingRecommended(true);
      fetch('/api/products?first=3')
        .then(res => res.json())
        .then(data => {
          if (data.nodes) {
            // Filter out products already in cart
            const cartProductIds = cart.lines.nodes.map(item => item.merchandise.product.id);
            const filtered = data.nodes.filter((product: Product) => 
              !cartProductIds.includes(product.id)
            );
            setRecommendedProducts(filtered.slice(0, 3));
          }
        })
        .catch(err => console.error('Error fetching recommended products:', err))
        .finally(() => setIsLoadingRecommended(false));
    }
  }, [isOpen, cart]);

  const handleDirectCheckout = () => {
    if (cart?.checkoutUrl) {
      setIsRedirecting(true);
      window.location.href = cart.checkoutUrl;
    }
  };

  const handleAddRecommendedProduct = async (product: Product) => {
    if (product.variants.nodes.length > 0) {
      await addToCart(product.variants.nodes[0].id);
    }
  };

  const calculateDiscount = () => {
    if (!cart || cart.lines.nodes.length === 0) return 0;
    // Calculate discount based on MRP vs subtotal
    // For demo, we'll use a 37% discount calculation
    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    const mrp = subtotal * 1.37; // Assuming 37% discount from MRP
    return mrp - subtotal;
  };

  const totalItems = cart?.lines.nodes.length || 0;
  const subtotal = parseFloat(cart?.cost.subtotalAmount.amount || '0');
  const total = parseFloat(cart?.cost.totalAmount.amount || '0');
  const discount = calculateDiscount();
  const deliveryFee = 49;
  const finalTotal = subtotal; // Use the actual Shopify subtotal, not subtracting discount

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex  w-full max-w-[450px]">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-full h-full flex flex-col bg-white">
                    {/* Header */}
                  <div className="flex items-center p-[20px] gap-[12px]">
                          <button
                      type="button"
                            onClick={onClose}
                      className=" text-black hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_3586_104562)">
                          <path d="M5 12H19" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5 12L11 18" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5 12L11 6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_3586_104562">
                            <rect width="24" height="24" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                          </button>
                    <Dialog.Title className="text-[20px] text-black font-medium leading-[1]">
                        Your Cart
                      </Dialog.Title>
                        </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto bg-[#f7f7f7] p-[20px] pt-[24px] pb-[150px]">
                      {cart && cart.lines.nodes.length > 0 ? (
                        <>
                          {/* Review Your Order Section */}
                        <div className="mb-[24px]">
                          <div className="flex justify-between items-center mb-[10px]">
                            <h2 className="text-[16px] font-medium leading-[1] text-black">Review Your Order</h2>
                            <span className="text-[13px] text-[#999999] leading-[1]">{totalItems} Item{totalItems !== 1 ? 's' : ''}</span>
                      </div>

                          <div className="bg-white rounded-[14px] p-[14px]">
                            {cart.lines.nodes.map((item) => {
                              const itemPrice = parseFloat(item.merchandise.price.amount);
                              const itemTotal = itemPrice * item.quantity;
                              // For demo, assume 37% discount (you can adjust based on actual data)
                              const originalPrice = itemPrice * 1.37;
                              
                              // Debug: Log variant info to help troubleshoot
                              if (process.env.NODE_ENV === 'development') {
                                console.log('Cart line item:', {
                                  lineId: item.id,
                                  variantId: item.merchandise.id,
                                  variantTitle: item.merchandise.title,
                                  selectedOptions: item.merchandise.selectedOptions,
                                  productId: item.merchandise.product.id,
                                  quantity: item.quantity
                                });
                              }
                              
                              return (
                                <div key={item.id} className="flex gap-[8px] mb-4 last:mb-0">
                                    {/* Product Image */}
                                  <div className="flex-shrink-0">
                                    <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden bg-[#f7f7f7]">
                                      <Image
                                        src={
                                          item.merchandise.image?.url || 
                                          item.merchandise.product.images?.nodes?.[0]?.url || 
                                          '/placeholder-product.jpg'
                                        }
                                        alt={
                                          item.merchandise.image?.altText || 
                                          item.merchandise.product.images?.nodes?.[0]?.altText || 
                                          item.merchandise.product.title
                                        }
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>

                                    {/* Product Details */}
                                  <div className="flex justify-between gap-[8px]">
                                    <div className='py-[6px] flex flex-col justify-between'>
                                      <h3 className="text-[14px] font-medium text-black leading-[1] line-clamp-2">
                                            {item.merchandise.product.title}
                                        </h3>
                                      <p className="text-[10px] text-[#a3a3a3] leading-[1]">
                                        {item.merchandise.selectedOptions && item.merchandise.selectedOptions.length > 0 ? (
                                          item.merchandise.selectedOptions.map((option, idx) => (
                                            <span key={option.name}>
                                              {option.name}: {option.value}{idx < item.merchandise.selectedOptions!.length - 1 ? ' / ' : ''}
                                            </span>
                                          ))
                                        ) : item.merchandise.title.includes('Size') ? (
                                          <span>Size: {item.merchandise.title.split('Size: ')[1]?.split(' /')[0] || item.merchandise.title}</span>
                                        ) : (
                                          <span>Size: {item.merchandise.title || 'M'}</span>
                                        )}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-[8px] justify-between">
                                      {/* Quantity Selector */}
                                      <div className="flex items-center justify-between w-[64px] gap-auto bg-white border-[1px] border-[#dddddd] shadow-sm rounded-[8px] p-[4px]">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const newQuantity = item.quantity - 1;
                                            if (newQuantity <= 0) {
                                              removeFromCart(item.id);
                                            } else {
                                              updateCartItem(item.id, newQuantity);
                                            }
                                          }}
                                          className="text-black hover:text-gray-600 disabled:opacity-50 cursor-pointer"
                                          disabled={isLoading}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <g clip-path="url(#clip0_3586_104330)">
                                              <path d="M3.75024 9H14.2502" stroke="black" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_3586_104330">
                                                <rect width="18" height="18" fill="white"/>
                                              </clipPath>
                                            </defs>
                                          </svg>
                                        </button>
                                        <span className="text-[16px] font-medium text-[#6b6b6b] leading-[1] text-center">
                                            {item.quantity}
                                          </span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            updateCartItem(item.id, item.quantity + 1);
                                          }}
                                          className="text-black hover:text-gray-600 disabled:opacity-50 cursor-pointer"
                                          disabled={isLoading}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <g clip-path="url(#clip0_3586_104334)">
                                              <path d="M9 3.75003V14.25" stroke="black" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
                                              <path d="M3.75024 9H14.2502" stroke="black" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_3586_104334">
                                                <rect width="18" height="18" fill="white"/>
                                              </clipPath>
                                            </defs>
                                          </svg>
                                        </button>
                                      </div>

                                      {/* Price and Delete */}
                                      <div className="flex w-[50px] items-center">
                                        <div className="text-right w-full">
                                          <div className="text-[12px] text-[#9d9d9d] leading-[1] mb-[4px] line-through">
                                            {formatPrice((originalPrice * item.quantity).toString(), item.merchandise.price.currencyCode)}
                                          </div>
                                          <div className="text-[14px] font-bold text-[#2AA62B] leading-[1]">
                                            {formatPrice((itemTotal).toString(), item.merchandise.price.currencyCode)}
                                          </div>
                                        </div>
                                       
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          </div>

                          {/* You might love these too! Section */}
                        {/* {recommendedProducts.length > 0 && (
                            <div className="mb-6">
                              <h2 className="text-base font-bold text-black mb-4">You might love these too!</h2>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                {recommendedProducts.map((product) => {
                                  const hasDiscount = product.compareAtPriceRange && 
                                  parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 
                                  parseFloat(product.priceRange.minVariantPrice.amount);
                                const originalPrice = hasDiscount 
                                  ? parseFloat(product.compareAtPriceRange!.minVariantPrice.amount)
                                  : parseFloat(product.priceRange.minVariantPrice.amount);
                                const currentPrice = parseFloat(product.priceRange.minVariantPrice.amount);
                                  
                                  return (
                                  <div key={product.id} className="flex-shrink-0 w-[280px] bg-white rounded-[14px] border border-gray-100 p-4">
                                    <div className="w-full h-32 rounded-[12px] overflow-hidden bg-gray-100 mb-3">
                                      <Image
                                        src={product.media?.nodes?.[0] && 'image' in product.media.nodes[0] 
                                          ? product.media.nodes[0].image.url 
                                          : '/placeholder-product.jpg'}
                                        alt={product.media?.nodes?.[0] && 'image' in product.media.nodes[0]
                                          ? product.media.nodes[0].image.altText || product.title
                                          : product.title}
                                          width={280}
                                        height={128}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    <h3 className="text-sm font-bold text-black mb-2 line-clamp-2">
                                      {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between mb-3">
                                      <div>
                                        {hasDiscount && (
                                          <div className="text-xs text-gray-400 line-through mb-1">
                                            {formatPrice(originalPrice.toString(), product.priceRange.minVariantPrice.currencyCode)}
                                          </div>
                                        )}
                                        <div className="text-sm font-bold text-black">
                                          {formatPrice(currentPrice.toString(), product.priceRange.minVariantPrice.currencyCode)}
                                        </div>
                                      </div>
                                      </div>
                                      <button
                                        onClick={() => handleAddRecommendedProduct(product)}
                                      disabled={isLoading || !product.availableForSale}
                                      className="w-full bg-black text-white py-2 px-4 rounded-[8px] text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                      >
                                        ADD
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                        )} */}

                          {/* Offers Section */}
                        <div className="mb-[24px]">
                          <h2 className="text-[16px] font-medium leading-[1] text-black mb-[10px]">Offers</h2>
                          <div className="bg-white rounded-[14px] h-[60px] px-[20px] w-full shadow-sm">
                            <button 
                              className="w-full h-full flex items-center justify-between"
                              onClick={() => setIsOffersPopupOpen(true)}
                            >
                              <div className="flex items-center gap-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                                <path d="M12.2204 0.779297C13.2618 0.779297 14.2591 1.19485 14.9912 1.93063L15.8443 2.78374C16.1188 3.05663 16.49 3.20996 16.8771 3.2103H18.0993C19.1366 3.2103 20.1314 3.62236 20.8649 4.35583C21.5984 5.08931 22.0104 6.08412 22.0104 7.12141V8.34363C22.0104 8.72985 22.1644 9.10141 22.4345 9.37396L23.2876 10.2271C23.6529 10.5903 23.9428 11.0222 24.1407 11.4978C24.3386 11.9734 24.4406 12.4834 24.4408 12.9986C24.4411 13.5137 24.3395 14.0238 24.1421 14.4996C23.9446 14.9754 23.655 15.4075 23.2901 15.7711L22.437 16.6242C22.1641 16.8987 22.0108 17.2699 22.0104 17.657V18.8792C22.0104 19.9165 21.5984 20.9113 20.8649 21.6448C20.1314 22.3782 19.1366 22.7903 18.0993 22.7903H16.8771C16.4912 22.7906 16.121 22.943 15.8468 23.2144L14.9936 24.0675C14.6304 24.4328 14.1986 24.7227 13.7229 24.9206C13.2473 25.1185 12.7373 25.2205 12.2222 25.2207C11.707 25.2209 11.1969 25.1194 10.7211 24.9219C10.2453 24.7244 9.81322 24.4349 9.44965 24.07L8.59654 23.2169C8.32205 22.944 7.95082 22.7906 7.56376 22.7903H6.34154C5.30424 22.7903 4.30944 22.3782 3.57596 21.6448C2.84249 20.9113 2.43042 19.9165 2.43042 18.8792V17.657C2.43009 17.2711 2.27771 16.9009 2.00631 16.6266L1.1532 15.7735C0.787932 15.4103 0.498022 14.9784 0.300121 14.5028C0.10222 14.0272 0.000227517 13.5172 3.80211e-07 13.002C-0.000226756 12.4869 0.101316 11.9768 0.298798 11.501C0.496279 11.0252 0.785809 10.5931 1.15076 10.2295L2.00387 9.37641C2.27676 9.10192 2.43009 8.73069 2.43042 8.34363V7.12141L2.43654 6.89896C2.49334 5.90176 2.92952 4.96408 3.65562 4.2782C4.38172 3.59233 5.34271 3.21024 6.34154 3.2103H7.56376C7.94962 3.20996 8.31981 3.05759 8.59409 2.78619L9.4472 1.93307C9.81061 1.56749 10.2427 1.27736 10.7186 1.07935C11.1946 0.881344 11.7049 0.779372 12.2204 0.779297ZM15.2638 14.2103C14.7775 14.2103 14.3112 14.4035 13.9674 14.7473C13.6236 15.0911 13.4304 15.5574 13.4304 16.0436C13.4304 16.5299 13.6236 16.9962 13.9674 17.34C14.3112 17.6838 14.7775 17.877 15.2638 17.877C15.75 17.877 16.2163 17.6838 16.5601 17.34C16.9039 16.9962 17.0971 16.5299 17.0971 16.0436C17.0971 15.5574 16.9039 15.0911 16.5601 14.7473C16.2163 14.4035 15.75 14.2103 15.2638 14.2103ZM16.739 8.4573C16.5098 8.22817 16.199 8.09945 15.8749 8.09945C15.5508 8.09945 15.24 8.22817 15.0108 8.4573L7.67742 15.7906C7.45479 16.0211 7.33159 16.3299 7.33438 16.6503C7.33716 16.9708 7.4657 17.2774 7.69231 17.504C7.91892 17.7306 8.22547 17.8591 8.54593 17.8619C8.8664 17.8647 9.17513 17.7415 9.40565 17.5189L16.739 10.1855C16.9681 9.95632 17.0968 9.6455 17.0968 9.32141C17.0968 8.99732 16.9681 8.6865 16.739 8.4573ZM9.15265 8.09919C8.66642 8.09919 8.2001 8.29234 7.85628 8.63616C7.51247 8.97997 7.31931 9.44629 7.31931 9.93252C7.31931 10.4187 7.51247 10.8851 7.85628 11.2289C8.2001 11.5727 8.66642 11.7659 9.15265 11.7659C9.63888 11.7659 10.1052 11.5727 10.449 11.2289C10.7928 10.8851 10.986 10.4187 10.986 9.93252C10.986 9.44629 10.7928 8.97997 10.449 8.63616C10.1052 8.29234 9.63888 8.09919 9.15265 8.09919Z" fill="#3F855B"/>
                              </svg>
                                <span className="text-[16px] font-semibold text-black">View All Offers</span>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g opacity="0.9" clip-path="url(#clip0_3586_104442)">
                                  <path d="M9 18L15 12L9 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_3586_104442">
                                    <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)"/>
                                  </clipPath>
                                </defs>
                              </svg>
                            </button>
                            </div>
                          </div>

                          {/* Price Breakdown Section */}
                        <div className="mb-[24px]">
                          <h2 className="text-[16px] font-medium leading-[1] text-black mb-[10px]">Price Breakdown</h2>
                          <div className="bg-white rounded-[14px] shadow-sm p-[14px] space-y-[20px]">
                              <div className="flex justify-between text-[16px] text-black ">
                                <span className="leading-none font-medium">MRP:</span>
                                <span className="text-black font-semibold leading-none">
                                  {formatPrice((subtotal + discount).toString(), cart.cost.subtotalAmount.currencyCode)}
                                </span>
                              </div>
                            <div className="flex justify-between text-[16px] text-black ">
                              <span className="leading-none font-medium">Delivery Fee:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-black font-semibold leading-none line-through">
                                  {formatPrice(deliveryFee.toString(), cart.cost.subtotalAmount.currencyCode)}
                                </span>
                                <span className="text-[#2AA62B] leading-none  font-medium">Free</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-[16px] text-black ">
                                <div className="flex items-center gap-2">
                                <span className="leading-none font-medium">Discount:</span>
                                <div className="bg-[#DAF1E3] p-[6px] rounded-[6px] flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clip-path="url(#clip0_3586_105722)">
                                      <path d="M8.00675 1.3407C8.57475 1.3407 9.11875 1.56737 9.51808 1.9687L9.98342 2.43403C10.1331 2.58288 10.3356 2.66651 10.5468 2.6667H11.2134C11.7792 2.6667 12.3218 2.89146 12.7219 3.29154C13.122 3.69161 13.3468 4.23424 13.3468 4.80003V5.4667C13.3468 5.67737 13.4307 5.88003 13.5781 6.0287L14.0434 6.49403C14.2427 6.69217 14.4008 6.92772 14.5087 7.18714C14.6167 7.44657 14.6723 7.72477 14.6724 8.00575C14.6726 8.28674 14.6172 8.56499 14.5095 8.82451C14.4017 9.08403 14.2438 9.31972 14.0447 9.51803L13.5794 9.98337C13.4306 10.1331 13.3469 10.3356 13.3468 10.5467V11.2134C13.3468 11.7792 13.122 12.3218 12.7219 12.7219C12.3218 13.1219 11.7792 13.3467 11.2134 13.3467H10.5468C10.3363 13.3469 10.1344 13.43 9.98475 13.578L9.51942 14.0434C9.32128 14.2426 9.08573 14.4007 8.82631 14.5087C8.56688 14.6166 8.28868 14.6723 8.00769 14.6724C7.72671 14.6725 7.44846 14.6171 7.18894 14.5094C6.92942 14.4017 6.69373 14.2438 6.49542 14.0447L6.03008 13.5794C5.88036 13.4305 5.67787 13.3469 5.46675 13.3467H4.80008C4.23429 13.3467 3.69167 13.1219 3.29159 12.7219C2.89151 12.3218 2.66675 11.7792 2.66675 11.2134V10.5467C2.66657 10.3362 2.58345 10.1343 2.43542 9.9847L1.97008 9.51937C1.77085 9.32123 1.61271 9.08568 1.50477 8.82625C1.39682 8.56683 1.34119 8.28863 1.34106 8.00764C1.34094 7.72665 1.39633 7.44841 1.50405 7.18889C1.61176 6.92936 1.76969 6.69368 1.96875 6.49537L2.43408 6.03003C2.58293 5.88031 2.66657 5.67782 2.66675 5.4667V4.80003L2.67008 4.6787C2.70107 4.13477 2.93898 3.6233 3.33504 3.24919C3.73109 2.87508 4.25527 2.66667 4.80008 2.6667H5.46675C5.67722 2.66652 5.87914 2.5834 6.02875 2.43537L6.49408 1.97003C6.69231 1.77062 6.928 1.61237 7.18759 1.50436C7.44719 1.39636 7.72558 1.34074 8.00675 1.3407ZM9.66675 8.6667C9.40153 8.6667 9.14718 8.77206 8.95964 8.95959C8.77211 9.14713 8.66675 9.40148 8.66675 9.6667C8.66675 9.93192 8.77211 10.1863 8.95964 10.3738C9.14718 10.5613 9.40153 10.6667 9.66675 10.6667C9.93197 10.6667 10.1863 10.5613 10.3739 10.3738C10.5614 10.1863 10.6667 9.93192 10.6667 9.6667C10.6667 9.40148 10.5614 9.14713 10.3739 8.95959C10.1863 8.77206 9.93197 8.6667 9.66675 8.6667ZM10.4714 5.5287C10.3464 5.40372 10.1769 5.33351 10.0001 5.33351C9.82331 5.33351 9.65377 5.40372 9.52875 5.5287L5.52875 9.5287C5.40731 9.65443 5.34012 9.82283 5.34163 9.99763C5.34315 10.1724 5.41327 10.3396 5.53687 10.4632C5.66048 10.5869 5.82769 10.657 6.00248 10.6585C6.17728 10.66 6.34568 10.5928 6.47142 10.4714L10.4714 6.47136C10.5964 6.34635 10.6666 6.17681 10.6666 6.00003C10.6666 5.82326 10.5964 5.65372 10.4714 5.5287ZM6.33342 5.33337C6.0682 5.33337 5.81385 5.43872 5.62631 5.62626C5.43877 5.81379 5.33342 6.06815 5.33342 6.33337C5.33342 6.59858 5.43877 6.85294 5.62631 7.04047C5.81385 7.22801 6.0682 7.33337 6.33342 7.33337C6.59863 7.33337 6.85299 7.22801 7.04052 7.04047C7.22806 6.85294 7.33342 6.59858 7.33342 6.33337C7.33342 6.06815 7.22806 5.81379 7.04052 5.62626C6.85299 5.43872 6.59863 5.33337 6.33342 5.33337Z" fill="#2AA62B"/>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_3586_105722">
                                        <rect width="16" height="16" fill="white"/>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  <span className="text-black text-[14px] leading-none">Applied</span>
                                </div>
                              </div>
                              <span className="text-[#2AA62B] font-medium">
                               -{formatPrice(discount.toString(), cart.cost.subtotalAmount.currencyCode)}
                                  </span>
                                </div>
                            <div className="flex justify-between text-[16px] text-black ">
                              <span className="leading-none font-medium">Total Price:</span>
                              <span className="text-black font-semibold leading-none">
                                {formatPrice(finalTotal.toString(), cart.cost.subtotalAmount.currencyCode)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Cancellation Policy Section */}
                        <div className="mb-[24px] ">
                          <div className="bg-white rounded-[14px] shadow-sm p-[20px]">
                            <button
                              onClick={() => setIsCancellationExpanded(!isCancellationExpanded)}
                              className="w-full flex items-center justify-between"
                            >
                              <span className="text-[16px] font-medium text-black">Cancellation Policy</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M11.9993 13.1711L7.0496 8.22131L5.6354 9.63551L11.9993 15.9995L18.3633 9.63551L16.9491 8.22131L11.9993 13.1711Z" fill="black"/>
                              </svg>
                            </button>
                            {isCancellationExpanded && (
                              <div className="pt-[20px] text-[14px] leading-none  text-[#808080]">
                                <ul className="list-disc list-inside space-y-[2px]">
                                  <li>Orders can be canceled before they are shipped.</li>
                                  <li>Once dispatched, cancellations are not allowed.</li>
                                  <li>You will receive a confirmation email or SMS once your cancellation request is processed.</li>
                                  <li>If your payment was made online, a refund will be processed within 7 working days.</li>
                                </ul>
                              </div>
                            )}
                          </div>
                          </div>
                        </>
                          ) : (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 text-gray-400 mb-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                  />
                                </svg>
                              </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-sm text-gray-500 mb-6">Start adding some items to your cart.</p>
                        <button
                          onClick={onClose}
                          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                        >
                          Continue Shopping
                        </button>
                            </div>
                          )}
                    </div>

                    {/* Sticky Footer */}
                    {cart && cart.lines.nodes.length > 0 && (
                    <div className="fixed w-full max-w-[450px] bottom-0 right-0 bg-white border-t border-gray-200 p-[20px] z-10">
                      <div className="flex items-center justify-between mb-[8px]">
                          <div className="flex items-center gap-2">
                          <span className="text-[16px] font-semibold leading-[1] text-black">Total Price</span>
                          {discount > 0 && (
                            <div className="bg-[#DAF1E3] px-[6px] py-[4px] rounded-[6px] flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <g clip-path="url(#clip0_3586_105722)">
                                      <path d="M8.00675 1.3407C8.57475 1.3407 9.11875 1.56737 9.51808 1.9687L9.98342 2.43403C10.1331 2.58288 10.3356 2.66651 10.5468 2.6667H11.2134C11.7792 2.6667 12.3218 2.89146 12.7219 3.29154C13.122 3.69161 13.3468 4.23424 13.3468 4.80003V5.4667C13.3468 5.67737 13.4307 5.88003 13.5781 6.0287L14.0434 6.49403C14.2427 6.69217 14.4008 6.92772 14.5087 7.18714C14.6167 7.44657 14.6723 7.72477 14.6724 8.00575C14.6726 8.28674 14.6172 8.56499 14.5095 8.82451C14.4017 9.08403 14.2438 9.31972 14.0447 9.51803L13.5794 9.98337C13.4306 10.1331 13.3469 10.3356 13.3468 10.5467V11.2134C13.3468 11.7792 13.122 12.3218 12.7219 12.7219C12.3218 13.1219 11.7792 13.3467 11.2134 13.3467H10.5468C10.3363 13.3469 10.1344 13.43 9.98475 13.578L9.51942 14.0434C9.32128 14.2426 9.08573 14.4007 8.82631 14.5087C8.56688 14.6166 8.28868 14.6723 8.00769 14.6724C7.72671 14.6725 7.44846 14.6171 7.18894 14.5094C6.92942 14.4017 6.69373 14.2438 6.49542 14.0447L6.03008 13.5794C5.88036 13.4305 5.67787 13.3469 5.46675 13.3467H4.80008C4.23429 13.3467 3.69167 13.1219 3.29159 12.7219C2.89151 12.3218 2.66675 11.7792 2.66675 11.2134V10.5467C2.66657 10.3362 2.58345 10.1343 2.43542 9.9847L1.97008 9.51937C1.77085 9.32123 1.61271 9.08568 1.50477 8.82625C1.39682 8.56683 1.34119 8.28863 1.34106 8.00764C1.34094 7.72665 1.39633 7.44841 1.50405 7.18889C1.61176 6.92936 1.76969 6.69368 1.96875 6.49537L2.43408 6.03003C2.58293 5.88031 2.66657 5.67782 2.66675 5.4667V4.80003L2.67008 4.6787C2.70107 4.13477 2.93898 3.6233 3.33504 3.24919C3.73109 2.87508 4.25527 2.66667 4.80008 2.6667H5.46675C5.67722 2.66652 5.87914 2.5834 6.02875 2.43537L6.49408 1.97003C6.69231 1.77062 6.928 1.61237 7.18759 1.50436C7.44719 1.39636 7.72558 1.34074 8.00675 1.3407ZM9.66675 8.6667C9.40153 8.6667 9.14718 8.77206 8.95964 8.95959C8.77211 9.14713 8.66675 9.40148 8.66675 9.6667C8.66675 9.93192 8.77211 10.1863 8.95964 10.3738C9.14718 10.5613 9.40153 10.6667 9.66675 10.6667C9.93197 10.6667 10.1863 10.5613 10.3739 10.3738C10.5614 10.1863 10.6667 9.93192 10.6667 9.6667C10.6667 9.40148 10.5614 9.14713 10.3739 8.95959C10.1863 8.77206 9.93197 8.6667 9.66675 8.6667ZM10.4714 5.5287C10.3464 5.40372 10.1769 5.33351 10.0001 5.33351C9.82331 5.33351 9.65377 5.40372 9.52875 5.5287L5.52875 9.5287C5.40731 9.65443 5.34012 9.82283 5.34163 9.99763C5.34315 10.1724 5.41327 10.3396 5.53687 10.4632C5.66048 10.5869 5.82769 10.657 6.00248 10.6585C6.17728 10.66 6.34568 10.5928 6.47142 10.4714L10.4714 6.47136C10.5964 6.34635 10.6666 6.17681 10.6666 6.00003C10.6666 5.82326 10.5964 5.65372 10.4714 5.5287ZM6.33342 5.33337C6.0682 5.33337 5.81385 5.43872 5.62631 5.62626C5.43877 5.81379 5.33342 6.06815 5.33342 6.33337C5.33342 6.59858 5.43877 6.85294 5.62631 7.04047C5.81385 7.22801 6.0682 7.33337 6.33342 7.33337C6.59863 7.33337 6.85299 7.22801 7.04052 7.04047C7.22806 6.85294 7.33342 6.59858 7.33342 6.33337C7.33342 6.06815 7.22806 5.81379 7.04052 5.62626C6.85299 5.43872 6.59863 5.33337 6.33342 5.33337Z" fill="#2AA62B"/>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_3586_105722">
                                        <rect width="16" height="16" fill="white"/>
                                      </clipPath>
                                    </defs>
                                  </svg>
                              <span className="text-[#187019] text-[12px] font-semibold leading-none">
                                {formatPrice(discount.toString(), cart.cost.subtotalAmount.currencyCode)} applied!
                              </span>
                            </div>
                            )}
                          </div>
                        <span className="text-[16px] font-semibold leading-[1] text-black">
                          {formatPrice(finalTotal.toString(), cart.cost.subtotalAmount.currencyCode)}
                          </span>
                        </div>
                      
                          <button
                            onClick={handleDirectCheckout}
                            disabled={isRedirecting || !cart?.checkoutUrl}
                        className="w-full h-[56px] bg-[#FCD00B] text-black p-[12px] rounded-[12px] text-[20px] font-semibold shadow-sm hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-[12px]"
                          >
                            {isRedirecting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                Redirecting...
                            </div>
                            ) : (
                            'Proceed to Checkout'
                            )}
                          </button>

                      <div className="flex items-center justify-center gap-[24px] text-[12px] leading-[1] font-medium text-[#252525]">
                        <div className="flex items-center gap-[8px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <g clip-path="url(#clip0_3586_104530)">
                            <path d="M4.16669 14.1667C4.16669 14.6087 4.34228 15.0326 4.65484 15.3452C4.9674 15.6577 5.39133 15.8333 5.83335 15.8333C6.27538 15.8333 6.6993 15.6577 7.01186 15.3452C7.32443 15.0326 7.50002 14.6087 7.50002 14.1667C7.50002 13.7246 7.32443 13.3007 7.01186 12.9882C6.6993 12.6756 6.27538 12.5 5.83335 12.5C5.39133 12.5 4.9674 12.6756 4.65484 12.9882C4.34228 13.3007 4.16669 13.7246 4.16669 14.1667Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.5 14.1667C12.5 14.6087 12.6756 15.0326 12.9882 15.3452C13.3007 15.6577 13.7246 15.8333 14.1667 15.8333C14.6087 15.8333 15.0326 15.6577 15.3452 15.3452C15.6577 15.0326 15.8333 14.6087 15.8333 14.1667C15.8333 13.7246 15.6577 13.3007 15.3452 12.9882C15.0326 12.6756 14.6087 12.5 14.1667 12.5C13.7246 12.5 13.3007 12.6756 12.9882 12.9882C12.6756 13.3007 12.5 13.7246 12.5 14.1667Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.16669 14.1667H2.50002V10.8334M1.66669 4.16669H10.8334V14.1667M7.50002 14.1667H12.5M15.8334 14.1667H17.5V9.16669M17.5 9.16669H10.8334M17.5 9.16669L15 5.00002H10.8334" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2.5 7.5H5.83333" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_3586_104530">
                              <rect width="20" height="20" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                            <span>Hassle Free Shipping</span>
                          </div>
                        <div className="flex items-center gap-[8px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <g clip-path="url(#clip0_3586_104538)">
                            <path d="M10 17.5L3.33337 13.75V6.25L10 2.5L16.6667 6.25V10" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 10L16.6667 6.25" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 10V17.5" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 10L3.33337 6.25" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.3333 15H12.5" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 12.5L12.5 15L15 17.5" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.3333 4.375L6.66663 8.125" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_3586_104538">
                              <rect width="20" height="20" fill="white"/>
                            </clipPath>
                          </defs>
                            </svg>
                            <span>7-Day Easy Returns</span>
                        </div>
                        </div>
                      </div>
                    )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Offers Popup */}
      <OffersPopup
        isOpen={isOffersPopupOpen}
        onClose={() => setIsOffersPopupOpen(false)}
      />
    </Transition.Root>
  );
}
