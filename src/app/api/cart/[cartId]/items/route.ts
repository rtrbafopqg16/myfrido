import { NextRequest, NextResponse } from 'next/server';
import { addToCart, updateCartLines, removeFromCart } from '@/lib/shopify';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params;
    const decodedCartId = decodeURIComponent(cartId);
    
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { merchandiseId, quantity } = requestBody;
    
    const result = await addToCart(decodedCartId, [{ merchandiseId, quantity }]);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return NextResponse.json(
        { error: result.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: result.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params;
    const decodedCartId = decodeURIComponent(cartId);
    const { lineId, quantity } = await request.json();
    
    const result = await updateCartLines(decodedCartId, [{ id: lineId, quantity }]);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return NextResponse.json(
        { error: result.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: result.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params;
    const decodedCartId = decodeURIComponent(cartId);
    const { lineId } = await request.json();
    
    const result = await removeFromCart(decodedCartId, [lineId]);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return NextResponse.json(
        { error: result.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: result.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
