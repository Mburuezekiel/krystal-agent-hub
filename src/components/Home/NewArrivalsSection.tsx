// src/components/sections/NewArrivalsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getNewArrivals, Product } from '@/services/product-service'; // Import from service

const NewArrivalsSection: React.FC = () => {
  const newArrivals: Product[] = getNewArrivals(6); // Get top 6 new arrivals

  return (
    <section>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]"> {/* Krystal Dark */}
        New In
      </h2>
      <div className='bg-gray-200'>
        <br/>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
        {newArrivals.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="group block">
            <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardContent className="p-0">
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span> 
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-medium text-[#222222] mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    {product.oldPrice && (
                      <p className="text-xs text-gray-500 line-through">
                        KES {product.oldPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-base font-semibold text-[#D81E05]"> {/* Krystal Red */}
                      KES {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        {/* Ensure no whitespace/comments between Button and Link */}
      <Button asChild size="lg" className="..."><Link to="/new-in">View All New In</Link></Button>
      </div>
      <br/>
      </div>
    </section>
    
  );
};

export default NewArrivalsSection;

