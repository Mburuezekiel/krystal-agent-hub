/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Product,
  getWishlistApi,
  removeFromWishlistApi,
  addToCartApi,
} from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface WishlistProduct extends Product {
}

const WishlistPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem('userToken');

  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!isLoggedIn || !authToken) {
      setWishlistItems([]);
      setLoading(false);
      setError("Please log in to view your wishlist.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWishlistApi(authToken);
      const fetchedItems: WishlistProduct[] = Array.isArray(response?.wishlist?.items)
        ? response.wishlist.items.map((item: any) => ({
            _id: item.product._id,
            name: item.product.name,
            imageUrl: item.product.imageUrl,
            price: item.product.price,
            category: item.product.category,
            brand: item.product.brand,
            stock: item.product.stock,
            rating: item.product.rating,
            numReviews: item.product.numReviews,
            description: item.product.description,
            images: item.product.images,
            specifications: item.product.specifications,
            oldPrice: item.product.oldPrice,
            isNew: item.product.isNew,
            isTrending: item.product.isTrending,
            isPromotional: item.product.isPromotional,
          }))
        : [];
      setWishlistItems(fetchedItems);
    } catch (err: any) {
      console.error("Failed to fetch wishlist:", err);
      setError(err.response?.data?.message || "Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn, authToken]);

  const handleRemoveFromWishlist = async (productId: string) => {
    const productToRemove = wishlistItems.find(p => p._id === productId);
    if (!productToRemove) return;

    if (!isLoggedIn || !authToken) {
      toast.error('Please log in to remove items from your wishlist.');
      return;
    }

    try {
      setWishlistItems(prev => prev.filter(p => p._id !== productId));
      await removeFromWishlistApi(productId, authToken);
      toast.success(`"${productToRemove.name}" removed from wishlist.`);
    } catch (err: any) {
      console.error("Error removing item from wishlist:", err);
      toast.error(err.response?.data?.message || 'Failed to remove item from wishlist. Please try again.');
      fetchWishlist();
    }
  };

  const handleAddToCartFromWishlist = async (product: WishlistProduct) => {
    if (!isLoggedIn || !authToken) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    if (product.stock <= 0) {
      toast.error('This product is out of stock.');
      return;
    }

    try {
      await addToCartApi(product._id, 1, authToken);
      toast.success(`Added "${product.name}" to your cart!`);
    } catch (cartError: any) {
      console.error("Failed to add to cart from wishlist:", cartError);
      toast.error(cartError.response?.data?.message || 'Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] font-inter">
      <div className="pb-20 md:pb-24 lg:pb-28">

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

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow-md py-12">
            <Loader2 className="h-12 w-12 animate-spin text-[#D81E05] mb-4" />
            <p className="text-xl md:text-2xl font-semibold">Loading your wishlist...</p>
            <p className="text-gray-600 mt-2">Please wait a moment.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow-md py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-red-600">Error Loading Wishlist</h2>
            <p className="text-lg text-red-500 text-center max-w-md">{error}</p>
            <Button onClick={fetchWishlist} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md px-6 py-3 font-semibold">
              Retry
            </Button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-4">Your wishlist is empty. Start adding some favorites!</p>
            <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {wishlistItems.map((product) => (
              <Card key={product._id} className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white h-full flex flex-col">
                <Link to={`/product/${product._id}`} className="group block flex-grow flex flex-col">
                  <CardContent className="p-0 flex-grow flex flex-col">
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
                      {product.oldPrice && product.oldPrice > product.price && (
                         <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">SALE</span>
                      )}
                    </div>
                    <div className="p-3 text-center flex-grow flex flex-col justify-between">
                      <h3 className="text-sm md:text-base font-medium text-[#222222] mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-2">
                        {product.oldPrice && product.oldPrice > product.price && (
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
                </Link>
                <div className="p-3 pt-0 flex justify-center items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromWishlist(product._id);
                    }}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-white text-[#D81E05] hover:bg-gray-100 transition-colors"
                    aria-label="Remove from wishlist"
                    title="Remove from Wishlist"
                  >
                    <Heart className="w-5 h-5 fill-[#D81E05]" />
                    <span className="sr-only">Remove from Wishlist</span>
                  </button>

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCartFromWishlist(product);
                    }}
                    className="flex-grow bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-4 py-2 text-sm font-semibold flex items-center justify-center gap-1 transition-colors duration-200"
                    disabled={product.stock <= 0}
                    title={product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;