// src/pages/SalePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getPromotionalProducts, Product } from '@/services/product-service';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // Ensure Button is imported if used in error state

const SalePage: React.FC = () => {
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const products = await getPromotionalProducts();

        if (Array.isArray(products)) {
          setSaleProducts(products);
        } else {
          console.error("getPromotionalProducts did not return an array:", products);
          setError("Failed to load sale items: Data format error.");
          toast.error("Failed to load sale items: Data format error.");
        }
      } catch (err: any) {
        console.error('Error fetching sale products:', err);
        setError(err.message || 'Failed to load sale items. Please try again.');
        toast.error(`Failed to load sale items: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

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
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-red-600">Error Loading Sale Items</h1>
        <p className="text-lg text-red-500 text-center max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md px-6 py-3 font-semibold">
          Retry
        </Button>
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
              <Link to={`/product/${product._id}`} key={product._id} className="group block"> {/* Use product._id */}
                <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border border-gray-100 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
                  <CardContent className="p-0 flex-grow"> {/* Added flex-grow */}
                    <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.oldPrice && (
                        <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-xs px-2 py-1 rounded-full font-semibold">SALE</span>
                      )}
                    </div>
                    <div className="p-3 text-center flex-grow flex flex-col justify-between"> {/* Added flex-grow and justify-between */}
                      <h3 className="text-sm md:text-base font-medium text-[#222222] mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-2">
                        {product.oldPrice && (
                          <p className="text-xs sm:text-sm text-gray-500 line-through">
                            KES {product.oldPrice.toFixed(2)}
                          </p>
                        )}
                        <p className="text-base sm:text-lg font-semibold text-[#D81E05]">
                          KES {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalePage;