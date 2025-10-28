import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

// Cache for storing results (in-memory cache)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for Shopify data

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
      console.error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      console.error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check cache first
    const cacheKey = `product-${handle}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Returning cached product data for ${handle}`);
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=120', // 2 minutes
          'X-Cache': 'HIT'
        }
      });
    }

    console.log(`Fetching product with handle: ${handle}`);
    const startTime = Date.now();
    const product = await getProduct(handle);
    const fetchTime = Date.now() - startTime;
    
    if (!product) {
      console.log(`Product not found for handle: ${handle}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Cache the result
    cache.set(cacheKey, { data: product, timestamp: Date.now() });

    console.log(`Successfully fetched product: ${product.title} in ${fetchTime}ms`);
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, max-age=120', // 2 minutes
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        return NextResponse.json(
          { error: 'Network error - unable to connect to Shopify' },
          { status: 503 }
        );
      }
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Authentication error' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
