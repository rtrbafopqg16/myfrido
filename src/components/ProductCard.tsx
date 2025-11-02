'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();
  const prefetchingRef = useRef(false);


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

  // Warm route, APIs, and first image on hover/focus
  const handlePrefetch = async () => {
    if (prefetchingRef.current) return;
    prefetchingRef.current = true;
    const href = `/products/${product.handle}`;
    try {
      // @ts-ignore app router prefetch
      router.prefetch?.(href);

      const calls: Promise<any>[] = [];
      calls.push(fetch(`/api/products/${product.handle}`, { cache: 'force-cache' }));
      calls.push(
        fetch(`/api/sanity/${product.handle}?type=all`, {
          cache: 'force-cache',
          headers: { 'Cache-Control': 'max-age=300' },
        })
      );

      const firstImageUrl = product.media?.nodes?.[0] && 'image' in product.media.nodes[0]
        ? product.media.nodes[0].image.url
        : undefined;
      if (firstImageUrl && typeof window !== 'undefined') {
        const img = document.createElement('img');
        // @ts-ignore - fetchPriority is a valid property but may not be in all TS versions
        img.fetchPriority = 'high';
        img.src = firstImageUrl;
      }

      await Promise.race([
        Promise.allSettled(calls),
        new Promise((r) => setTimeout(r, 400)),
      ]);
    } catch (_e) {
      // ignore
    }
  };


  const hasDiscount = product.compareAtPriceRange && 
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount);

  const discountPercentage = hasDiscount ? 
    Math.round(((parseFloat(product.compareAtPriceRange!.minVariantPrice.amount) - parseFloat(product.priceRange.minVariantPrice.amount)) / parseFloat(product.compareAtPriceRange!.minVariantPrice.amount)) * 100) : 0;

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <Link
        href={`/products/${product.handle}`}
        className="block"
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
      >
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 relative">
            <OptimizedImage
              src={product.media?.nodes?.[0] && 'image' in product.media.nodes[0] ? product.media.nodes[0].image.url : '/placeholder-product.jpg'}
              alt={product.media?.nodes?.[0] && 'image' in product.media.nodes[0] ? product.media.nodes[0].image.altText || product.title : product.title}
              width={400}
              height={400}
              optimization="productCard"
              priority={false}
              loading="lazy"
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

          {/* Quick Add to Cart Button */}
          <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
