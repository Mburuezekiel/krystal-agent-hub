import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/services/product-service'; // Import the Product interface
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react'; // Import Heart icon

// Function to retrieve wishlist from localStorage
const getWishlist = (): Product[] => {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
};

// Function to remove product from wishlist in localStorage
const removeProductFromWishlist = (productId: string) => {
  let wishlist: Product[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
  wishlist = wishlist.filter(item => item._id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  return wishlist;
};

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    setWishlistItems(getWishlist());
  }, []);

  const handleRemoveFromWishlist = (productId: string) => {
    const updatedWishlist = removeProductFromWishlist(productId);
    setWishlistItems(updatedWishlist);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-[#D81E05] hover:underline">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800">
            Wishlist
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#222222]">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-700 mb-4">Your wishlist is empty. Start adding some favorites!</p>
          <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product._id} className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <Link to={`/product/${product._id}`} className="group block">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x400/E0E0E0/666666?text=Image+Error`;
                        e.currentTarget.onerror = null;
                      }}
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
                          KES {product.oldPrice.toFixed(2)}</p>
                      )}
                      <p className="text-base font-semibold text-[#D81E05]">
                        KES {product.price.toFixed(2)}
                      </p>
                    </div>
                    {/* New: Remove from Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigating to product details
                        handleRemoveFromWishlist(product._id);
                      }}
                      className="mt-2 inline-flex items-center justify-center p-2 rounded-full bg-white text-[#D81E05] hover:bg-gray-100 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-[#D81E05]" /> {/* Filled heart to indicate it's in wishlist */}
                      <span className="sr-only">Remove from Wishlist</span>
                    </button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;