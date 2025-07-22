

// src/pages/SalePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { getPromotionalProducts, Product } from '@/services/product-service';
import { Card, CardContent } from '@/components/ui/card';

const SalePage: React.FC = () => {
  const saleProducts: Product[] = getPromotionalProducts(); // Get all promotional products

  return (
    <>
      
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8]">
        <h1 className="text-4xl font-bold text-center mb-8">All Sale Items</h1>
        {saleProducts.length === 0 ? (
          <p className="text-center text-lg">No sale items at the moment.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {saleProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
                  <CardContent className="p-0">
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
                        <p className="text-base font-semibold text-[#D81E05]">
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
    
    </>
  );
};

export default SalePage;