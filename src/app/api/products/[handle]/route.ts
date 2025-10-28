import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

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

    console.log(`Fetching product with handle: ${handle}`);
    const product = await getProduct(handle);
    
    if (!product) {
      console.log(`Product not found for handle: ${handle}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(`Successfully fetched product: ${product.title}`);
    return NextResponse.json(product);
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
