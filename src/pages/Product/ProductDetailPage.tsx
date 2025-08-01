/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getProductById,
  getProductsByCategory,
  Product,
  addToCartApi,
  addToWishlistApi,
  getWishlistApi,
} from '@/services/product-service';
import { ProductCard } from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Share2, Star, ShoppingCart, Loader2 } from 'lucide-react'; // Import Loader2
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface DetailedProduct extends Product {
  description: string;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  tags:string;
  images: string[];
  specifications: { [key: string]: string };
  oldPrice?: number;
}

const StarRating = ({ rating, size = "w-5 h-5" }) => {
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

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<boolean>(false); // New loading state for cart
  const [addingToWishlist, setAddingToWishlist] = useState<boolean>(false); // New loading state for wishlist

  const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem('userToken');

  const checkWishlistStatus = async (productId: string, token: string) => {
    if (!token) {
      setIsWishlisted(false);
      return;
    }
    try {
      const wishlistResponse = await getWishlistApi(token);
      const wishlistItems = wishlistResponse.wishlist?.items || [];
      const itemInWishlist = wishlistItems.some((item: any) => item.product._id === productId);
      setIsWishlisted(itemInWishlist);
    } catch (err) {
      console.error("Error checking wishlist status:", err);
      setIsWishlisted(false);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const fetchedProduct = await getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct as DetailedProduct);
          setMainImage(fetchedProduct.imageUrl);
          setQuantity(1);

          if (isLoggedIn && authToken) {
            checkWishlistStatus(fetchedProduct._id, authToken);
          } else {
            setIsWishlisted(false);
          }

          const productsInSameCategory = await getProductsByCategory(fetchedProduct.category);
          const filteredRelated = productsInSameCategory
            .filter(p => p._id !== fetchedProduct._id) // Filter out the current product
            .sort(() => 0.5 - Math.random()) // Shuffle remaining products
            .slice(0, 5); // Take up to 5

          setRelatedProducts(filteredRelated);

        } else {
          setProduct(null);
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setError("Failed to load product details. Please try again later.");
        toast.error("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, isLoggedIn, authToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-[#222222] bg-[#F8F8F8] min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-lg text-red-600">{error}</p>
        <Button asChild className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-[#222222] bg-[#F8F8F8] min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-lg">The product you are looking for does not exist.</p>
        <Button asChild className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  const handleAddToWishlist = async () => {
    if (!isLoggedIn || !authToken) {
      toast.error('Please log in to add items to your wishlist.');
      return;
    }

    setAddingToWishlist(true); // Set loading state
    try {
      await addToWishlistApi(product._id, authToken);
      setIsWishlisted(true);
      toast.success(`"${product.name}" added to your wishlist!`);
    } catch (wishlistError: any) {
      console.error("Failed to add to wishlist:", wishlistError);
      if (wishlistError.response?.status === 409) {
        toast.info(`"${product.name}" is already in your wishlist!`);
        setIsWishlisted(true); // Ensure state is correct if already wishlisted
      } else {
        toast.error(wishlistError.response?.data?.message || 'Failed to add to wishlist. Please try again.');
      }
    } finally {
      setAddingToWishlist(false); // Reset loading state
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn || !authToken) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    if (product.stock <= 0) {
      toast.error('This product is out of stock.');
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Cannot add ${quantity} items. Only ${product.stock} available.`);
      return;
    }

    setAddingToCart(true); // Set loading state
    try {
      await addToCartApi(product._id, quantity, authToken);
      toast.success(`Added ${quantity} of "${product.name}" to cart!`);
    } catch (cartError: any) {
      console.error("Failed to add to cart:", cartError);
      toast.error(cartError.response?.data?.message || 'Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false); // Reset loading state
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - KES ${product.price.toFixed(2)}: ${product.description.substring(0, 100)}...`,
          url: window.location.href,
        });
        toast.success('Product shared successfully!');
      } catch (shareError) {
        console.error('Error sharing product:', shareError);
        toast.error('Could not share product. Please try again.');
      }
    } else {
      const shareText = `${product.name} - KES ${product.price.toFixed(2)}: ${product.description.substring(0, 100)}... ${window.location.href}`;
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success('Product link and details copied to clipboard!'))
        .catch(() => toast.error('Could not copy to clipboard.'));
    }
  };

  const getTruncatedProductName = (name: string) => {
    const words = name.split(' ');
    if (words.length > 2) {
      return words.slice(0, 2).join(' ') + '...';
    }
    return name;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen font-inter pb-20">
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-[#D81E05] hover:underline">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/categories" className="text-[#D81E05] hover:underline">Categories</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link to={`/category/${encodeURIComponent(product.category)}`} className="text-[#D81E05] hover:underline">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800">
            {getTruncatedProductName(product.name)}
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-sm">
            <img
              src={mainImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x600/E0E0E0/666666?text=Image+Error`;
                e.currentTarget.onerror = null;
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 justify-center flex-wrap">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-[#D81E05]' : 'border-gray-200'} hover:border-[#D81E05] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D81E05]`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/64x64/F0F0F0/999999?text=X`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[#222222]">{product.name}</h1>

          {product.rating !== undefined && product.numReviews !== undefined && (
            <div className="flex items-center mb-4">
              <StarRating rating={Math.round(product.rating)} />
              <span className="text-sm text-gray-600 ml-2">({product.numReviews} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-2xl font-bold text-[#D81E05]">KES {product.price.toFixed(2)}</p>
            {product.oldPrice && product.oldPrice > product.price && (
              <p className="text-lg text-gray-500 line-through">KES {product.oldPrice.toFixed(2)}</p>
            )}
          </div>

          {product.stock !== undefined && (
            <p className={`text-sm font-semibold mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          )}

          <p className="text-gray-700 text-sm mb-2">
            <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
          </p>
          <p className="text-gray-700 text-sm mb-6">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          
            
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="text-lg font-semibold text-[#222222]">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stock || 99)))}
                className="w-16 text-center border-x border-gray-300 py-1 text-lg"
                min="1"
                max={product.stock || 99}
              />
              <button
                onClick={() => setQuantity(prev => (product.stock && prev >= product.stock) ? prev : prev + 1)}
                className="px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col-2 sm:flex-row gap-4 mb-6">
            <Button
              onClick={handleAddToCart}
              className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold flex-grow transition-colors duration-200"
              disabled={product.stock !== undefined && product.stock <= 0 || addingToCart} // Disable if out of stock or adding
            >
              {addingToCart ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </span>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 fill-current text-current" />
                  {product.stock !== undefined && product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </Button>
            <Button
              onClick={handleAddToWishlist}
              className="bg-gray-200 hover:bg-gray-300 text-[#D81E05] rounded-full px-4 py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              aria-label="Add to Wishlist"
              disabled={addingToWishlist} // Disable when adding to wishlist
            >
              {addingToWishlist ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <Heart className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              )}
              <span className="hidden sm:inline">
                {addingToWishlist ? 'Adding...' : 'Wishlist'}
              </span>
            </Button>
            <Button
              onClick={handleShare}
              className="bg-gray-200 hover:bg-gray-300 text-[#222222] rounded-full px-4 py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              aria-label="Share Product"
            >
              <Share2 />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-[#222222]">Delivery & Returns</h3>
            <div className="space-y-3 text-gray-700 text-sm">
              <p>
                <span className="font-medium">Estimated Delivery:</span> 3-5 business days.
              </p>
              <p>
                <span className="font-medium">Return Policy:</span> 30-day free returns. See our full policy for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#222222]">Product Details</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {product.description || 'This is a detailed description of the product, highlighting its key features, benefits, and usage instructions. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
        </p>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-3 text-[#222222]">Specifications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-6  bg-[#D81E05] text-white rounded ">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;