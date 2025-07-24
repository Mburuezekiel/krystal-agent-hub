// src/components/sections/NewArrivalsSection.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getNewArrivals, Product } from '@/services/product-service';
import { Loader2, AlertCircle } from 'lucide-react'; // Import icons

const NewArrivalsSection: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data = await getNewArrivals(6); // Fetches 6 new arrivals for this section
        setNewArrivals(data);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
        setError("Could not load new arrivals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // --- Loading State Render ---
  if (loading) {
    return (
      <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">New In</h2>
        <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
          <Loader2 className="h-10 w-10 animate-spin text-[#D81E05]" />
          <p className="mt-4 text-lg text-muted-foreground">Loading new arrivals...</p>
        </div>
      </section>
    );
  }

  // --- Error State Render ---
  if (error) {
    return (
      <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">New In</h2>
        <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="mt-4 text-lg text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        New In
      </h2>
      <div className='max-w-7xl mx-auto'> {/* Centering and max-width for content */}
      {newArrivals.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">No new products found at the moment.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 items-stretch"> {/* Adjusted grid columns and gap */}
            {newArrivals.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="group block flex flex-col"> {/* Added flex flex-col */}
                <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white flex flex-col h-full"> {/* Added flex flex-col h-full */}
                  <CardContent className="p-0 flex-grow-0"> {/* flex-grow-0 to prevent image area from expanding */}
                    <div className="relative w-full h-32 sm:h-40 aspect-square bg-gray-100 overflow-hidden"> {/* Responsive height */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/128x128/E0E0E0/666666?text=Image+Error`; // Smaller placeholder
                          e.currentTarget.onerror = null;
                        }}
                      />
                      {product.isNew && (
                        <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-[0.6rem] px-1 py-0.5 rounded-full font-semibold z-10">NEW</span>
                      )}
                    </div>
                  </CardContent>
                  <div className="p-2 text-center flex-grow flex flex-col justify-between min-h-[5rem] sm:min-h-[6rem]"> {/* Added flex-grow, flex-col, justify-between, and min-h */}
                    <h3 className="text-xs sm:text-sm font-medium text-[#222222] mb-0.5 line-clamp-2"> {/* Responsive font size, smaller mb */}
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mt-auto"> {/* Added mt-auto to push to bottom */}
                      {product.oldPrice && (
                        <p className="text-[0.6rem] text-gray-500 line-through"> {/* Smaller font size */}
                          KES {product.oldPrice.toFixed(2)}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-[#D81E05]"> {/* Smaller font size */}
                        KES {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
      )}
      <div className="text-center mt-8">
        <Button asChild size="lg" className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
          <Link to="/new-in">View All New In</Link>
        </Button>
      </div>
      </div> {/* Closing max-w-7xl mx-auto div */}
    </section>
  );
};

export default NewArrivalsSection;