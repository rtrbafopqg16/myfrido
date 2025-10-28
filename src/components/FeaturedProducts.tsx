'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';
import { Product } from '@/lib/shopify';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?first=8');
        console.log('FeaturedProducts: Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('FeaturedProducts: Raw data:', data);
          console.log('FeaturedProducts: data.nodes:', data.nodes);
          console.log('FeaturedProducts: data.nodes length:', data.nodes?.length);
          
          // Check if we have the right structure
          if (data.nodes) {
            console.log('FeaturedProducts: Setting products from data.nodes');
            setProducts(data.nodes);
          } else if (data.products && data.products.nodes) {
            console.log('FeaturedProducts: Setting products from data.products.nodes');
            setProducts(data.products.nodes);
          } else {
            console.log('FeaturedProducts: No products found in expected structure');
            setProducts([]);
          }
        } else {
          console.error('Failed to fetch products:', response.status);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our most popular items</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular items, carefully curated for quality and style
          </p>
        </div>

        <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-sm font-bold">DEBUG: Products count: {products.length}</p>
          <p className="text-sm">DEBUG: First product title: {products[0]?.title || 'None'}</p>
          <p className="text-sm">DEBUG: isLoading: {isLoading.toString()}</p>
        </div>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                View All Products
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
            <p className="mt-1 text-sm text-gray-500">
              We're working on adding amazing products for you.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
