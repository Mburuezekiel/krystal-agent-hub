import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Share2,
  Phone,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import {
  getCartApi,
  updateCartItemQuantityApi,
  removeCartItemApi,
  Product, // Import the Product interface for typing
} from "@/services/product-service";
import { Link } from "react-router-dom";

// Star Rating component (re-used for consistency)
const StarRating = ({ rating, size = "w-4 h-4" }) => {
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

// Define a type for cart items that include full product details
interface CartProduct extends Product {
  quantity: number; // Quantity of this product in the cart
}

const CartPage = () => {
  const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem('userToken'); // Get token from localStorage

  const [productsInCart, setProductsInCart] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Function to fetch the user's cart from the backend
  const fetchCart = async () => {
    if (!isLoggedIn || !authToken) {
      setProductsInCart([]); // Clear cart if not logged in
      setLoading(false);
      setError("Please log in to view your cart.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const response = await getCartApi(authToken);
      // The backend populates 'items.product', so we can directly use it
      // Ensure the structure matches CartProduct interface
      const fetchedItems: CartProduct[] = response.cart.items.map((item: any) => ({
        _id: item.product._id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: item.product.price,
        category: item.product.category,
        brand: item.product.brand,
        stock: item.product.stock,
        rating: item.product.rating,
        numReviews: item.product.numReviews,
        description: item.product.description, // Ensure description is present
        images: item.product.images, // Ensure images are present
        specifications: item.product.specifications, // Ensure specifications are present
        oldPrice: item.product.oldPrice, // Ensure oldPrice is present
        quantity: item.quantity, // This is the quantity from the cart item
      }));
      setProductsInCart(fetchedItems);
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      setError(err.response?.data?.message || "Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch cart on component mount and when auth state changes
  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, authToken]); // Depend on isLoggedIn and authToken

  // Function to update quantity of a product in the cart via backend
  const updateQuantity = async (productId: string, delta: number) => {
    const currentProduct = productsInCart.find(p => p._id === productId);
    if (!currentProduct) return;

    const newQuantity = Math.max(1, currentProduct.quantity + delta);

    if (newQuantity > currentProduct.stock) {
      setMessage({ type: 'error', text: `Cannot add more. Only ${currentProduct.stock} available for ${currentProduct.name}.` });
      return;
    }

    if (!isLoggedIn || !authToken) {
      setMessage({ type: 'error', text: 'Please log in to update your cart.' });
      return;
    }

    try {
      // Optimistic update (optional, but improves UX)
      setProductsInCart(prev => prev.map(p => p._id === productId ? { ...p, quantity: newQuantity } : p));
      await updateCartItemQuantityApi(productId, newQuantity, authToken);
      setMessage({ type: 'success', text: `Quantity for "${currentProduct.name}" updated.` });
      // Re-fetch cart to ensure consistency (especially after optimistic update)
      fetchCart();
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update quantity. Please try again.' });
      // Revert optimistic update on error
      fetchCart();
    }
  };

  // Function to remove an item from the cart via backend
  const removeItem = async (productId: string) => {
    const productToRemove = productsInCart.find(p => p._id === productId);
    if (!productToRemove) return;

    if (!isLoggedIn || !authToken) {
      setMessage({ type: 'error', text: 'Please log in to remove items from your cart.' });
      return;
    }

    try {
      // Optimistic update
      setProductsInCart(prev => prev.filter(p => p._id !== productId));
      await removeCartItemApi(productId, authToken);
      setMessage({ type: 'success', text: `"${productToRemove.name}" removed from cart.` });
      // Re-fetch cart to ensure consistency
      fetchCart();
    } catch (err: any) {
      console.error("Error removing item:", err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to remove item. Please try again.' });
      // Revert optimistic update on error
      fetchCart();
    }
  };

  // Function to apply a promo code (frontend logic only for now)
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setMessage({ type: 'success', text: 'Promo code applied successfully!' });
    } else {
      setPromoApplied(false);
      setMessage({ type: 'error', text: 'Invalid promo code.' });
    }
  };

  // Calculate subtotal for all items in the cart
  const calculateSubtotal = () => {
    return productsInCart.reduce((total, product) => {
      // Ensure product.price and product.quantity are numbers
      return total + (product.price || 0) * (product.quantity || 0);
    }, 0);
  };

  // Calculate order summary details
  const subtotal = calculateSubtotal();
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount for SAVE10
  const shippingCost = subtotal > 5000 ? 0 : 300; // Free shipping over KES 5,000
  const tax = (subtotal - discount) * 0.16; // 16% VAT
  const total = subtotal - discount + shippingCost + tax;

  // Function to handle Web Share API for an individual product
  const handleShareProduct = async (product: CartProduct) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name} - KES ${product.price.toLocaleString()}!`,
          url: `${window.location.origin}/product/${product._id}`, // Use specific product URL
        });
        setMessage({ type: 'success', text: `"${product.name}" shared successfully!` });
      } catch (error) {
        console.error("Error sharing product:", error);
        setMessage({ type: 'error', text: 'Could not share product. Please try again.' });
      }
    } else {
      const shareText = `Check out this product: ${product.name} - KES ${product.price.toLocaleString()}! ${window.location.origin}/product/${product._id}`;
      navigator.clipboard.writeText(shareText)
        .then(() => setMessage({ type: 'success', text: 'Product link and details copied to clipboard!' }))
        .catch(() => setMessage({ type: 'error', text: 'Could not copy to clipboard.' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <p className="text-gray-600 text-lg">Loading your cart...</p>
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
                Error Loading Cart
              </h1>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <button
                onClick={fetchCart} // Allow user to retry fetching cart
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                title="Retry loading cart"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the cart is empty, display an empty cart message
  if (productsInCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              <Link
                to="/" // Assuming '/' is your homepage or product listing page
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
                title="Start browsing products"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Message Box for feedback */}
      {message && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3 rounded-md shadow-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => window.history.back()} // Go back to previous page
                title="Go back to previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {productsInCart.length} {productsInCart.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div
                className="flex items-center gap-2"
                title="Secure and encrypted checkout process"
              >
                <Shield className="w-4 h-4" />
                Secure Checkout
              </div>
              <div
                className="flex items-center gap-2"
                title="Enjoy free shipping on orders above KES 5,000"
              >
                <Truck className="w-4 h-4" />
                Free Shipping over KES 5,000
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Cart Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {productsInCart.map((product) => {
                  // Use product.quantity from the `productsInCart` state directly
                  const itemQuantity = product.quantity;
                  const savings = product.oldPrice && product.oldPrice > product.price
                    ? product.oldPrice - product.price
                    : 0;

                  return (
                    <div
                      key={product._id} // Use product._id for key
                      className={`p-6 ${
                        product.stock <= 0 ? "bg-gray-50 opacity-70" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/128x128/E0E0E0/666666?text=Image+Error`;
                                e.currentTarget.onerror = null;
                              }}
                            />
                            {product.stock <= 0 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                {product.brand} • {product.category}
                              </p>

                              {/* Rating */}
                              <div className="flex items-center gap-2 mb-3">
                                <StarRating rating={Math.round(product.rating || 0)} />
                                <span className="text-sm text-gray-600">
                                  {product.rating || 0} ({product.numReviews || 0} reviews)
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl font-bold text-gray-900">
                                  KES {product.price.toLocaleString()}
                                </span>
                                {savings > 0 && (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">
                                      KES{" "}
                                      {product.oldPrice?.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-green-600 font-medium">
                                      Save KES {savings.toLocaleString()}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Stock Status */}
                              {product.stock > 0 ? (
                                <p className="text-green-600 text-sm font-medium">
                                  ✓ In Stock ({product.stock} available)
                                </p>
                              ) : (
                                <p className="text-red-600 text-sm font-medium">
                                  Out of Stock
                                </p>
                              )}
                            </div>

                            {/* Quantity and Actions */}
                            <div className="flex flex-col items-end gap-3 mt-4 sm:mt-0">
                              {/* Quantity Controls */}
                              {product.stock > 0 ? (
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      updateQuantity(product._id, -1)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                                    disabled={itemQuantity <= 1}
                                    title="Decrease quantity"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                    {itemQuantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(product._id, 1)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                                    disabled={itemQuantity >= product.stock} // Disable if max stock reached
                                    title="Increase quantity"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-gray-500 text-sm italic">
                                  Item out of stock
                                </div>
                              )}
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                {/* Share button per product (icon only) */}
                                <button
                                  onClick={() => handleShareProduct(product)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={`Share ${product.name}`}
                                >
                                  <Share2 className="w-5 h-5" />
                                </button>
                                {/* Remove item button */}
                                <button
                                  onClick={() => removeItem(product._id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove item from cart"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Items ({productsInCart.length}):</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (SAVE10):</span>
                      <span>-KES {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span
                      className={
                        shippingCost === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
                      {shippingCost === 0
                        ? "FREE"
                        : `KES ${shippingCost.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (16% VAT):</span>
                    <span>KES {tax.toLocaleString()}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      title="Enter a promotional code to get a discount"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      title="Apply the entered promo code"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ Promo code applied!
                    </p>
                  )}
                </div>

                <div className="flex gap-3 mt-6 items-center">
                  {/* Call Button (icon only, fixed width) */}
                  <a
                    href="tel:+254700282618"
                    className="flex-none p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                    title="Call us for inquiries"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                  {/* Checkout Button (takes remaining space) */}
                  <button
                    onClick={() => console.log("Proceeding to checkout")} // Placeholder action
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={productsInCart.length === 0} // Disable if cart is empty
                    title="Proceed to finalize your order"
                  >
                    Proceed to Checkout
                  </button>
                </div>

                <Link
                  to="/" // Link to homepage or product listing
                  className="w-full mt-3 border-2 border-red-600 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block text-center"
                  title="Continue browsing more products"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div
                      className="flex items-center gap-2"
                      title="Your payment information is protected by SSL encryption"
                    >
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      title="Orders over KES 5,000 qualify for free delivery"
                    >
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Free shipping on orders over KES 5,000</span>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      title="Return eligible items within 30 days of purchase"
                    >
                      <RotateCcw className="w-4 h-4 text-orange-500" />
                      <span>Easy 30-day returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
