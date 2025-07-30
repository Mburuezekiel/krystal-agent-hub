import React, { memo } from 'react'; // Import memo
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { Product } from '@/services/product-service'; // Assuming Product type is defined here
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const StarRating = ({ rating, size = "w-3 h-3" }: { rating: number; size?: string }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders of ProductCard
export const ProductCard: React.FC<ProductCardProps> = memo(({ product, className = "" }) => {
  const { addToCart, isAddingToCart, cartItems } = useCart(); // Get cartItems to check if product is in cart
  const { isInWishlist, addToWishlist, removeFromWishlist, isAddingToWishlist } = useWishlist();

  // Check if the product is currently in the cart
  const productInCart = cartItems.some(item => item.productId === product._id); // Assuming cartItems has productId

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productInCart && product.stock > 0) { // Prevent adding if already in cart or out of stock
      await addToCart(product._id);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const savings = product.oldPrice && product.oldPrice > product.price
    ? product.oldPrice - product.price
    : 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group h-full flex flex-col ${className}`}
    >
      <Card className="h-full border-0 shadow-none flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
          {/* Image Container */}
          <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden flex-shrink-0"> {/* Added lg:h-56 and flex-shrink-0 */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/400x400/cccccc/333333?text=Product`;
                e.currentTarget.onerror = null; // Prevent infinite loop if placeholder also fails
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10"> {/* Added z-10 to ensure badges are on top */}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
              )}
              {savings > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">SALE</span>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-sm rounded-full z-10" // Added rounded-full and z-10
              onClick={handleWishlistToggle}
              disabled={isAddingToWishlist}
            >
              {isAddingToWishlist ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-600" /> 
              ) : (
                <Heart 
                  className={`h-4 w-4 transition-colors duration-200 ${
                    isInWishlist(product._id) 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-600 hover:text-red-500" // Added hover effect
                  }`} 
                />
              )}
            </Button>

            {/* Out of Stock Overlay */}
            {product.stock < 1 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20"> {/* Increased opacity, added z-20 */}
                <span className="text-white text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 line-clamp-2 min-h-[2.5rem]"> {/* Added min-h to prevent layout shift */}
                {product.name}
              </h3>
              {product.brand && ( // Only show brand if it exists
                <p className="text-gray-600 text-xs mb-2 line-clamp-1 min-h-[1rem]"> {/* Added min-h */}
                  {product.brand}
                </p>
              )}
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <StarRating rating={Math.round(product.rating || 0)} />
                <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-base md:text-lg font-bold text-gray-900">
                  KES {product.price.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-xs text-gray-500 line-through">
                    KES {product.oldPrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock < 1 || productInCart} // Disable if already in cart
              className={`w-full ${productInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D81E05] hover:bg-[#A01A04]'} text-white transition-colors duration-200`} // Style when in cart
              size="sm"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="hidden sm:inline">Adding...</span>
                  <ShoppingCart className="h-4 w-4 sm:hidden" />
                </>
              ) : productInCart ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">In Cart</span>
                  <span className="sm:hidden">In Cart</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Add to Cart</span>
                  <ShoppingCart className="h-4 w-4 sm:hidden" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard'; // For React DevTools debugging