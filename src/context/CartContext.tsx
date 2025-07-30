/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addToCartApi, getCartApi } from '@/services/product-service';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  isAddingToCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addingToCartProducts, setAddingToCartProducts] = useState<Set<string>>(new Set());
  const { isLoggedIn } = useAuth();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const refreshCart = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        const response = await getCartApi(token);
        const items = response.cart?.items || [];
        setCartItems(items.map((item: { product: { _id: string }; quantity: number }) => ({
          productId: item.product._id,
          quantity: item.quantity
        })));
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to cart');
      return;
    }

    setAddingToCartProducts(prev => new Set(prev).add(productId));
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await addToCartApi(productId, quantity, token);
        await refreshCart();
        toast.success('Added to cart successfully!');
      }
    } catch (error: unknown) {
      console.error('Error adding to cart:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'data' in (error as any).response &&
        typeof (error as any).response.data === 'object' &&
        (error as any).response.data !== null &&
        'message' in (error as any).response.data
      ) {
        toast.error((error as any).response.data.message || 'Failed to add to cart');
      } else {
        toast.error('Failed to add to cart');
      }
    } finally {
      setAddingToCartProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const isAddingToCart = (productId: string) => {
    return addingToCartProducts.has(productId);
  };

  useEffect(() => {
    refreshCart();
  }, [isLoggedIn, refreshCart]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, refreshCart, isAddingToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};