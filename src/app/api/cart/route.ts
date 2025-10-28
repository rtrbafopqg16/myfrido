import { NextRequest, NextResponse } from 'next/server';
import { createCart } from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const result = await createCart();
    
    if (result.userErrors && result.userErrors.length > 0) {
      return NextResponse.json(
        { error: result.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: result.cart });
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}


