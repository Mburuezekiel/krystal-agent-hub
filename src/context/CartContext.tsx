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
  isAddingToCart: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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
        setCartItems(items.map((item: any) => ({
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

    setIsAddingToCart(true);
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await addToCartApi(productId, quantity, token);
        await refreshCart();
        toast.success('Added to cart successfully!');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isLoggedIn]);

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