import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    console.log('Environment variables:');
    console.log('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
    console.log('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION);

    const products = await getProducts(5);
    
    return NextResponse.json({
      success: true,
      productsCount: products?.nodes?.length || 0,
      products: products?.nodes || [],
      pageInfo: products?.pageInfo || null,
      hasNextPage: products?.pageInfo?.hasNextPage || false
    });
  } catch (error) {
    console.error('Shopify test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}


