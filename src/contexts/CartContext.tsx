'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem } from '@/lib/shopify';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: { merchandiseId: string; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { lineId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateCartItem: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, error: null, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_ITEM':
      return { ...state, isLoading: true };
    case 'UPDATE_ITEM':
      return { ...state, isLoading: true };
    case 'REMOVE_ITEM':
      return { ...state, isLoading: true };
    case 'CLEAR_CART':
      return { ...state, cart: null, isLoading: false };
    default:
      return state;
  }
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify-cart-id');
    if (savedCartId) {
      loadCart(savedCartId);
    }
  }, []);

  const loadCart = async (cartId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`/api/cart/${encodeURIComponent(cartId)}`);
      if (response.ok) {
        const cart = await response.json();
        console.log('Cart loaded successfully:', cart); // Debug log
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'SET_LOADING', payload: false });
      } else {
        console.log('Cart not found, creating new one'); // Debug log
        // Cart not found, create new one
        await createNewCart();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createNewCart = async () => {
    try {
      const response = await fetch('/api/cart', { method: 'POST' });
      if (response.ok) {
        const { cart } = await response.json();
        console.log('New cart created successfully:', cart); // Debug log
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'SET_LOADING', payload: false });
        localStorage.setItem('shopify-cart-id', cart.id);
      } else {
        throw new Error('Failed to create cart');
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create cart' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (merchandiseId: string, quantity: number = 1) => {
    try {
      dispatch({ type: 'ADD_ITEM', payload: { merchandiseId, quantity } });
      
      let cartId = state.cart?.id;
      if (!cartId) {
        await createNewCart();
        cartId = state.cart?.id;
      }

      if (!cartId) {
        throw new Error('No cart available');
      }

      const response = await fetch(`/api/cart/${encodeURIComponent(cartId)}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchandiseId, quantity }),
      });

      if (response.ok) {
        const { cart } = await response.json();
        console.log('Cart after adding item:', cart);
        console.log('Cart line items:', cart.lines.nodes);
        dispatch({ type: 'SET_CART', payload: cart });
      } else {
        const errorData = await response.json();
        console.error('Failed to add item to cart:', errorData);
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    try {
      // If quantity is 0 or less, remove the item instead
      if (quantity <= 0) {
        await removeFromCart(lineId);
        return;
      }

      dispatch({ type: 'UPDATE_ITEM', payload: { lineId, quantity } });
      
      if (!state.cart?.id) {
        throw new Error('No cart available');
      }

      const response = await fetch(`/api/cart/${encodeURIComponent(state.cart.id)}/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity }),
      });

      if (response.ok) {
        const { cart } = await response.json();
        dispatch({ type: 'SET_CART', payload: cart });
      } else {
        throw new Error('Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
    }
  };

  const removeFromCart = async (lineId: string) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: lineId });
      
      if (!state.cart?.id) {
        throw new Error('No cart available');
      }

      const response = await fetch(`/api/cart/${encodeURIComponent(state.cart.id)}/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      });

      if (response.ok) {
        const { cart } = await response.json();
        dispatch({ type: 'SET_CART', payload: cart });
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('shopify-cart-id');
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    }
  };

  const getCartItemCount = (): number => {
    return state.cart?.totalQuantity || 0;
  };

  const getCartTotal = (): number => {
    return parseFloat(state.cart?.cost.totalAmount.amount || '0');
  };

  const refreshCart = async (): Promise<void> => {
    const savedCartId = localStorage.getItem('shopify-cart-id');
    if (savedCartId) {
      await loadCart(savedCartId);
    } else {
      await createNewCart();
    }
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
