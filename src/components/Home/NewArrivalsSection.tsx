/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, memo } from 'react'; 
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { ProductCard } from '@/components/common/ProductCard';
import { getNewArrivals, Product } from '@/services/product-service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';



const MemoizedProductCard = memo(ProductCard);

const NewArrivalsSection: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, wasOffline } = useNetworkStatus();

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getNewArrivals(6);
      setNewArrivals(data);
    } catch (err: any) {
      console.error("Failed to fetch new arrivals:", err);
      if (!isOnline) {
        setError('You are offline. Please check your internet connection.');
      } else {
        
        setError("Could not load new arrivals. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchNewArrivals();
  }, []); 

  
  useEffect(() => {
    if (isOnline && wasOffline && error) {
      
      fetchNewArrivals();
    }
  }, [isOnline, wasOffline, error]); 

  if (loading) {
    return (
      <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">New In</h2>
        <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8 max-w-7xl mx-auto">
          <Loader2 className="h-10 w-10 animate-spin text-[#D81E05]" />
          <p className="mt-4 text-lg text-muted-foreground">Loading new arrivals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">New In</h2>
        <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8 max-w-7xl mx-auto">
          {!isOnline ? (
            <WifiOff className="h-10 w-10 text-gray-500" />
          ) : (
            <AlertCircle className="h-10 w-10 text-red-500" />
          )}
          <p className="mt-4 text-lg text-gray-700 text-center">{error}</p>
          {isOnline && (
            <Button onClick={fetchNewArrivals} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white">
              Retry
            </Button>
          )}
          {!isOnline && (
            <div className="flex flex-col items-center text-gray-500 text-sm mt-4">
              <WifiOff className="h-4 w-4 mr-2" />
              <span>Will automatically retry when connection is restored.</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]"> {/* Changed text-white to text-222222 for better contrast with bg-f8f8f8 */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black"> {/* Changed heading color to black for better visibility */}
        New In
      </h2>
      <div className='max-w-7xl mx-auto'> {/* Constrains width on larger screens and centers */}
        {newArrivals.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">No new products found at the moment.</p>
            <Button onClick={fetchNewArrivals} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white">
              Try Reloading
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"> {/* Adjusted grid for more responsiveness */}
            {newArrivals.map((product) => (
              <MemoizedProductCard key={product._id} product={product} /> 
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button
            asChild
            size="lg"
            className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Link to="/new-in">View All New In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;