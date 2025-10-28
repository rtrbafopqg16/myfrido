'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/shopify';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  console.log('ProductCard: Rendering product:', product.title);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);
  const { addToCart } = useCart();


  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.availableForSale || product.variants.nodes.length === 0) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product.variants.nodes[0].id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleDirectCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.availableForSale || product.variants.nodes.length === 0) return;
    
    setIsDirectCheckout(true);
    try {
      // Add to cart first
      await addToCart(product.variants.nodes[0].id);
      
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

  const hasDiscount = product.compareAtPriceRange && 
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount);

  const discountPercentage = hasDiscount ? 
    Math.round(((parseFloat(product.compareAtPriceRange!.minVariantPrice.amount) - parseFloat(product.priceRange.minVariantPrice.amount)) / parseFloat(product.compareAtPriceRange!.minVariantPrice.amount)) * 100) : 0;

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <Link href={`/products/${product.handle}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 relative">
            <OptimizedImage
              src={product.media?.nodes?.[0] && 'image' in product.media.nodes[0] ? product.media.nodes[0].image.url : '/placeholder-product.jpg'}
              alt={product.media?.nodes?.[0] && 'image' in product.media.nodes[0] ? product.media.nodes[0].image.altText || product.title : product.title}
              width={400}
              height={400}
              optimization="productCard"
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>

          {/* Quick Add to Cart and Buy Now Buttons */}
          <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.availableForSale || isAddingToCart}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isAddingToCart ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
            <button
              onClick={handleDirectCheckout}
              disabled={!product.availableForSale || isDirectCheckout}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isDirectCheckout ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  <span>Buying...</span>
                </>
              ) : (
                <>
                  <span>Buy Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compareAtPriceRange!.minVariantPrice.amount, product.compareAtPriceRange!.minVariantPrice.currencyCode)}
                </span>
              )}
            </div>
            
            {!product.availableForSale && (
              <span className="text-sm text-red-500 font-medium">Sold Out</span>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
