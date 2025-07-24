import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Product, // Import the Product interface
  getWishlistApi, // Import getWishlistApi
  removeFromWishlistApi, // Import removeFromWishlistApi
  addToCartApi, // Import addToCartApi
} from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react'; // Import Heart and ShoppingCart icons
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { toast } from 'sonner'; // Import toast for messages

// Define a type for wishlist items that include full product details
interface WishlistProduct extends Product {
  // The backend wishlist populates product details, so we can use Product directly
  // No additional properties are needed here beyond the base Product interface
}

const WishlistPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem('userToken'); // Get token from localStorage

  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the user's wishlist from the backend
  const fetchWishlist = async () => {
    if (!isLoggedIn || !authToken) {
      setWishlistItems([]); // Clear wishlist if not logged in
      setLoading(false);
      setError("Please log in to view your wishlist.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWishlistApi(authToken);
      // The backend populates 'items.product', so we can directly use it
      const fetchedItems: WishlistProduct[] = response.wishlist.items.map((item: any) => ({
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
        isNew: item.product.isNew, // Ensure all necessary fields are mapped
        isTrending: item.product.isTrending,
        isPromotional: item.product.isPromotional,
      }));
      setWishlistItems(fetchedItems);
    } catch (err: any) {
      console.error("Failed to fetch wishlist:", err);
      setError(err.response?.data?.message || "Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch wishlist on component mount and when auth state changes
  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn, authToken]); // Depend on isLoggedIn and authToken

  // Function to remove an item from the wishlist via backend
  const handleRemoveFromWishlist = async (productId: string) => {
    const productToRemove = wishlistItems.find(p => p._id === productId);
    if (!productToRemove) return;

    if (!isLoggedIn || !authToken) {
      toast.error('Please log in to remove items from your wishlist.');
      return;
    }

    try {
      // Optimistic update
      setWishlistItems(prev => prev.filter(p => p._id !== productId));
      await removeFromWishlistApi(productId, authToken);
      toast.success(`"${productToRemove.name}" removed from wishlist.`);
      // Re-fetch wishlist to ensure consistency (optional, but good for robustness)
      fetchWishlist();
    } catch (err: any) {
      console.error("Error removing item from wishlist:", err);
      toast.error(err.response?.data?.message || 'Failed to remove item from wishlist. Please try again.');
      // Revert optimistic update on error
      fetchWishlist();
    }
  };

  // Function to add an item from wishlist to cart
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
      // Assuming adding 1 quantity from wishlist to cart
      await addToCartApi(product._id, 1, authToken);
      toast.success(`Added "${product.name}" to your cart!`);
      // Optionally, remove from wishlist after adding to cart
      // handleRemoveFromWishlist(product._id);
    } catch (cartError: any) {
      console.error("Failed to add to cart from wishlist:", cartError);
      toast.error(cartError.response?.data?.message || 'Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <p className="text-gray-600 text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Error Loading Wishlist
              </h1>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <button
                onClick={fetchWishlist} // Allow user to retry fetching wishlist
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                title="Retry loading wishlist"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen pb-20">
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
                    <div className="flex items-center justify-center gap-2 mb-3"> {/* Added mb-3 for spacing */}
                      {product.oldPrice && product.oldPrice > product.price && ( // Only show oldPrice if it's higher
                        <p className="text-xs text-gray-500 line-through">
                          KES {product.oldPrice.toFixed(2)}</p>
                      )}
                      <p className="text-base font-semibold text-[]">
                        KES {product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-center items-center gap-2"> {/* Flex container for buttons */}
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigating to product details
                          handleRemoveFromWishlist(product._id);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-full bg-white text-[#D81E05] hover:bg-gray-100 transition-colors"
                        aria-label="Remove from wishlist"
                        title="Remove from Wishlist"
                      >
                        <Heart className="w-5 h-5 fill-[#D81E05]" /> {/* Filled heart to indicate it's in wishlist */}
                        <span className="sr-only">Remove from Wishlist</span>
                      </button>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigating to product details
                          handleAddToCartFromWishlist(product);
                        }}
                        className="flex-grow bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-4 py-2 text-sm font-semibold flex items-center justify-center gap-1 transition-colors duration-200"
                        disabled={product.stock <= 0} // Disable if out of stock
                        title={product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
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
