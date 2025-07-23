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

const getProductById = (id) => {
  const products = {
    p1: {
      id: "p1",
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 8999,
      originalPrice: 12999,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      rating: 4.5,
      reviews: 245,
      inStock: true,
      brand: "AudioTech",
    },
    p5: {
      id: "p5",
      name: "Smart Fitness Watch",
      category: "Wearables",
      price: 15999,
      originalPrice: 19999,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      rating: 4.3,
      reviews: 189,
      inStock: true,
      brand: "FitPro",
    },
    p15: {
      id: "p15",
      name: "Professional Camera Lens",
      category: "Photography",
      price: 45000,
      originalPrice: 52000,
      imageUrl:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
      rating: 4.8,
      reviews: 76,
      inStock: false,
      brand: "LensMaster",
    },
  };
  return products[id] || null;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { productId: "p1", quantity: 1 },
    { productId: "p5", quantity: 2 },
    { productId: "p15", quantity: 1 },
  ]);

  const [productsInCart, setProductsInCart] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    const fetchedProducts = [];
    cartItems.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) {
        fetchedProducts.push({ ...product, quantity: item.quantity });
      }
    });
    setProductsInCart(fetchedProducts);
  }, [cartItems]);

  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
      console.log("Invalid promo code");
    }
  };

  const calculateSubtotal = () => {
    return productsInCart.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shippingCost = subtotal > 5000 ? 0 : 300;
  const tax = (subtotal - discount) * 0.16;
  const total = subtotal - discount + shippingCost + tax;

  const StarRating = ({ rating, size = "w-4 h-4" }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  const handleShareProduct = async (product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name
            } - KES ${product.price.toLocaleString()}!`,
          url: window.location.href,
        });
        console.log("Product shared successfully:", product.name);
      } catch (error) {
        console.error("Error sharing product:", error);
      }
    } else {
      console.log(
        "Web Share API not supported in this browser for product sharing."
      );
      alert(
        `To share ${product.name}, please copy this link: ${window.location.href}`
      );
    }
  };

  if (productsInCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
              <button
                onClick={() => console.log("Navigating to shopping page")} // Placeholder action
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                title="Start browsing products"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => console.log("Go back")} // Placeholder action
                title="Go back to previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
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
                  const itemQuantity =
                    cartItems.find((item) => item.productId === product.id)
                      ?.quantity || 0;
                  const savings = product.originalPrice - product.price;

                  return (
                    <div
                      key={product.id}
                      className={`p-6 ${!product.inStock ? "bg-gray-50 opacity-70" : ""
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {" "}
                        {/* Changed to flex-col for better mobile stacking */}
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                            />
                            {!product.inStock && (
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
                                <StarRating rating={product.rating} />
                                <span className="text-sm text-gray-600">
                                  {product.rating} ({product.reviews} reviews)
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
                                      {product.originalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-green-600 font-medium">
                                      Save KES {savings.toLocaleString()}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Stock Status */}
                              {product.inStock ? (
                                <p className="text-green-600 text-sm font-medium">
                                  ✓ In Stock
                                </p>
                              ) : (
                                <p className="text-red-600 text-sm font-medium">
                                  Out of Stock
                                </p>
                              )}
                            </div>

                            {/* Quantity and Actions */}
                            <div className="flex flex-col items-end gap-3 mt-4 sm:mt-0">
                              {" "}
                              {/* Added mt-4 for mobile spacing */}
                              {/* Quantity Controls */}
                              {product.inStock ? (
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      updateQuantity(product.id, -1)
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
                                      updateQuantity(product.id, 1)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                                    title="Increase quantity"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-gray-500 text-sm italic">
                                  Cannot add out of stock items
                                </div>
                              )}
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                {/* Share button per product */}
                                <button
                                  onClick={() => handleShareProduct(product)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={`Share ${product.name}`}
                                >
                                  <Share2 className="w-5 h-5" />
                                </button>
                                {/* Remove item button */}
                                <button
                                  onClick={() => removeItem(product.id)}
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
                    <span>Items ({cartItems.length}):</span>
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

                <div className="flex gap-3 mt-6">
                  {" "}
                  {/* This will be your flex container */}
                  {/* Call Button */}
                  <a
                    href="tel:+254700282618"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-base transition-colors duration-200 flex items-center justify-center gap-2"
                    title="Call us for inquiries"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                  {/* Checkout Button */}
                  <button
                    onClick={() => console.log("Proceeding to checkout")} // Placeholder action
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={cartItems.length === 0} // Disable if cart is empty
                    title="Proceed to finalize your order"
                  >
                    Proceed to Checkout
                  </button>
                </div>

                <button
                  onClick={() => console.log("Continuing shopping")} // Placeholder action
                  className="w-full mt-3 border-2 border-red-600 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition-colors duration-200"
                  title="Continue browsing more products"
                >
                  Continue Shopping
                </button>

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
