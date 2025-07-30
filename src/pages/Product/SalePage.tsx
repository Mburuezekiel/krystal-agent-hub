// src/pages/SalePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getPromotionalProducts, Product } from '@/services/product-service';
import { ProductCard } from '@/components/common/ProductCard';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';

const SalePage: React.FC = () => {
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, wasOffline } = useNetworkStatus();

  const fetchSaleProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const products = await getPromotionalProducts();

      if (Array.isArray(products)) {
        setSaleProducts(products);
      } else {
        console.error("getPromotionalProducts did not return an array:", products);
        if (!isOnline) {
          setError('You are offline. Please check your internet connection.');
        } else {
          setError("Failed to load sale items: Data format error.");
        }
      }
    } catch (err: any) {
      console.error('Error fetching sale products:', err);
      if (!isOnline) {
        setError('You are offline. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to load sale items. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  // Auto-reload when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && error) {
      fetchSaleProducts();
    }
  }, [isOnline, wasOffline, error]);

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-[#F8F8F8] p-4 text-[#222222]">
        <Loader2 className="h-12 w-12 animate-spin text-[#D81E05] mb-4" />
        <p className="text-xl md:text-2xl font-semibold">Loading sale items...</p>
        <p className="text-gray-600 mt-2">Please wait a moment.</p>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-[#F8F8F8] p-4 text-[#222222]">
        {!isOnline ? <WifiOff className="h-12 w-12 text-gray-500 mb-4" /> : <AlertCircle className="h-12 w-12 text-red-500 mb-4" />}
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-red-600">Error Loading Sale Items</h1>
        <p className="text-lg text-red-500 text-center max-w-md">{error}</p>
        {isOnline && (
          <Button onClick={fetchSaleProducts} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md px-6 py-3 font-semibold">
            Retry
          </Button>
        )}
        {!isOnline && (
          <div className="flex items-center text-gray-500 text-sm mt-4">
            <WifiOff className="h-4 w-4 mr-2" />
            Will automatically retry when connection is restored
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] font-inter">
       <nav className="text-sm text-gray-600 mb-6">
              <ol className="list-none p-0 inline-flex flex-wrap">
                <li className="flex items-center">
                  <Link to="/" className="text-[#D81E05] hover:underline text-xs sm:text-sm">Home</Link>
                  <span className="mx-1 sm:mx-2">/</span>
                </li>
                <li className="flex items-center text-gray-800 text-xs sm:text-sm">
                  Flash Sale
                </li>
              </ol>
            </nav>
      {/* Increased bottom padding for scrolling past bottom navigation */}
      <div className="pb-20 md:pb-24 lg:pb-28"> {/* Added padding-bottom */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#D81E05]">All Sale Items</h1>
        {saleProducts.length === 0 ? (
          <p className="text-center text-lg text-gray-700 py-10">No sale items at the moment. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalePage;