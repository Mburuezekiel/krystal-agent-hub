/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addToWishlistApi, getWishlistApi, removeFromWishlistApi } from '@/services/product-service';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlistItems: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isAddingToWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [addingToWishlistProducts, setAddingToWishlistProducts] = useState<Set<string>>(new Set());
  const { isLoggedIn } = useAuth();

  const refreshWishlist = async () => {
    if (!isLoggedIn) {
      setWishlistItems([]);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        const response = await getWishlistApi(token);
        const items = response.wishlist?.items || [];
        setWishlistItems(items.map((item: any) => item.product._id));
      }
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to wishlist');
      return;
    }

    setAddingToWishlistProducts(prev => new Set(prev).add(productId));
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await addToWishlistApi(productId, token);
        setWishlistItems(prev => [...prev, productId]);
        toast.success('Added to wishlist!');
      }
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 409) {
        toast.info('Item already in wishlist');
        setWishlistItems(prev => prev.includes(productId) ? prev : [...prev, productId]);
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    } finally {
      setAddingToWishlistProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      toast.error('Please log in to manage wishlist');
      return;
    }

    setAddingToWishlistProducts(prev => new Set(prev).add(productId));
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await removeFromWishlistApi(productId, token);
        setWishlistItems(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    } finally {
      setAddingToWishlistProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const isAddingToWishlist = (productId: string) => {
    return addingToWishlistProducts.has(productId);
  };

  useEffect(() => {
    refreshWishlist();
  }, [isLoggedIn]);

    return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      isInWishlist, 
      addToWishlist, 
      removeFromWishlist, 
      refreshWishlist,
      isAddingToWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};