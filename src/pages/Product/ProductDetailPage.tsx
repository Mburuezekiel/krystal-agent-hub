// src/pages/ProductDetailPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

import { getProductById, Product } from '@/services/product-service';
import { Button } from '@/components/ui/button';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product: Product | undefined = getProductById(id || '');

  if (!product) {
    return (
      <>
       
        <div className="container mx-auto px-4 py-12 text-center text-[#222222] bg-[#F8F8F8] min-h-[60vh] flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-lg">The product you are looking for does not exist.</p>
          {/* Ensure no whitespace/comments between Button and Link */}
          <Button asChild className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
            <Link to="/">Go to Homepage</Link>
          </Button>
        </div>
      
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8]">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl font-semibold text-[#D81E05] mb-4">KES {product.price.toFixed(2)}</p>
            {product.oldPrice && (
              <p className="text-gray-500 line-through mb-2">KES {product.oldPrice.toFixed(2)}</p>
            )}
            <p className="text-gray-700 mb-6">Category: {product.category}</p>
            <p className="text-gray-700 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <Button className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
