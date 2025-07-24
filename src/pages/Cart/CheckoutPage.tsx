import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner'; // For notifications

import { getCartApi, Product } from '@/services/product-service'; // Import getCartApi
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { ShoppingCart, ArrowLeft } from 'lucide-react'; // Import icons for empty cart/back button

// Define a type for cart items that include full product details and quantity
interface ProductWithQuantity extends Product {
  quantity: number;
}

// Zod schema for shipping address validation
const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .refine(val => /^\+?\d{10,15}$/.test(val), "Invalid phone number format"), // Regex for common phone formats
  email: z.string().email("Invalid email address"),
});

// Zod schema for payment method validation
const paymentSchema = z.object({
  paymentMethod: z.enum(["mpesa", "card", "cash"], {
    required_error: "Payment method is required",
  }),
});

// Infer types from schemas
type ShippingFormValues = z.infer<typeof shippingSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

const CheckoutPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem('userToken');

  const [productsInCart, setProductsInCart] = useState<ProductWithQuantity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // React Hook Form for Shipping
  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    formState: { errors: shippingErrors },
    getValues: getShippingValues, // To get shipping data for combined submission
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
  });

  // React Hook Form for Payment
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors },
    setValue: setPaymentValue,
    watch: watchPaymentMethod,
    getValues: getPaymentValues, // To get payment data for combined submission
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "mpesa",
    },
  });

  const selectedPaymentMethod = watchPaymentMethod("paymentMethod");

  // Function to fetch the user's cart from the backend
  const fetchCartItems = async () => {
    if (!isLoggedIn || !authToken) {
      setProductsInCart([]);
      setLoading(false);
      setError("Please log in to proceed to checkout.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCartApi(authToken);
      // Map the backend response to ProductWithQuantity
      const fetchedItems: ProductWithQuantity[] = response.cart.items.map((item: any) => ({
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
        quantity: item.quantity, // Quantity from the cart item
      }));
      setProductsInCart(fetchedItems);
    } catch (err: any) {
      console.error("Failed to fetch cart items for checkout:", err);
      setError(err.response?.data?.message || "Failed to load cart for checkout. Please try again.");
      toast.error("Failed to load cart for checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isLoggedIn, authToken]);

  // Calculate subtotal based on actual productsInCart
  const calculateSubtotal = () => {
    return productsInCart.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shippingCost;

  // Combined submission handler for both forms
  const onPlaceOrder = async () => {
    // Validate both forms
    const shippingValid = await handleShippingSubmit(() => { /* do nothing, just validate */ })();
    const paymentValid = await handlePaymentSubmit(() => { /* do nothing, just validate */ })();

    if (shippingValid && paymentValid) {
      const shippingData = getShippingValues();
      const paymentData = getPaymentValues();

      console.log("Placing Order:", { shippingData, paymentData, cartItems: productsInCart, total });
      // In a real application, you would send this data to your backend order API
      // Example: await placeOrderApi({ shippingData, paymentData, productsInCart, total }, authToken);

      toast.success("Order Placed Successfully! Thank you for your purchase.");
      // Optionally, clear cart after successful order
      // setProductsInCart([]);
    } else {
      toast.error("Please correct the errors in your shipping and payment details.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <p className="text-gray-600 text-lg">Loading checkout details...</p>
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
                Error Loading Checkout
              </h1>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <Button
                onClick={fetchCartItems} // Allow user to retry fetching cart
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                title="Retry loading checkout details"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the cart is empty after loading, display a message
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
                Please add items to your cart before proceeding to checkout.
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
    <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh] pb-20"> {/* Added pb-20 for bottom spacing */}
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-[#D81E05] hover:underline">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/cart" className="text-[#D81E05] hover:underline">Cart</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800">
            Checkout
          </li>
        </ol>
      </nav>

      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Shipping Address</h2>
          <form id="shipping-form" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...registerShipping("firstName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.firstName && <p className="text-red-500 text-sm mt-1">{shippingErrors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...registerShipping("lastName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.lastName && <p className="text-red-500 text-sm mt-1">{shippingErrors.lastName.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...registerShipping("address")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.address && <p className="text-red-500 text-sm mt-1">{shippingErrors.address.message}</p>}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...registerShipping("city")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.city && <p className="text-red-500 text-sm mt-1">{shippingErrors.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...registerShipping("postalCode")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.postalCode && <p className="text-red-500 text-sm mt-1">{shippingErrors.postalCode.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...registerShipping("phone")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.phone && <p className="text-red-500 text-sm mt-1">{shippingErrors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...registerShipping("email")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
              {shippingErrors.email && <p className="text-red-500 text-sm mt-1">{shippingErrors.email.message}</p>}
            </div>
          </form>

          <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Payment Method</h2>
          <form id="payment-form" className="mb-8">
            <RadioGroup
              onValueChange={(value: "mpesa" | "card" | "cash") => setPaymentValue("paymentMethod", value)}
              value={selectedPaymentMethod}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="mpesa"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#D81E05] [&:has([data-state=checked])]:border-[#D81E05] cursor-pointer"
              >
                <RadioGroupItem id="mpesa" value="mpesa" className="sr-only" {...registerPayment("paymentMethod")} />
                <img src="https://via.placeholder.com/60x30?text=M-Pesa" alt="M-Pesa" className="mb-2" />
                <span>M-Pesa</span>
              </Label>
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#D81E05] [&:has([data-state=checked])]:border-[#D81E05] cursor-pointer"
              >
                <RadioGroupItem id="card" value="card" className="sr-only" {...registerPayment("paymentMethod")} />
                <img src="https://via.placeholder.com/60x30?text=Card" alt="Card" className="mb-2" />
                <span>Card</span>
              </Label>
              <Label
                htmlFor="cash"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#D81E05] [&:has([data-state=checked])]:border-[#D81E05] cursor-pointer"
              >
                <RadioGroupItem id="cash" value="cash" className="sr-only" {...registerPayment("paymentMethod")} />
                <img src="https://via.placeholder.com/60x30?text=Cash" alt="Cash on Delivery" className="mb-2" />
                <span>Cash on Delivery</span>
              </Label>
            </RadioGroup>
            {paymentErrors.paymentMethod && <p className="text-red-500 text-sm mt-2 text-center">{paymentErrors.paymentMethod.message}</p>}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-8"> {/* Added sticky top-8 */}
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {productsInCart.map(product => (
              <div key={product._id} className="flex justify-between items-center">
                <span className="text-gray-700">{product.name} (x{product.quantity})</span>
                <span className="font-medium">KES {(product.price * product.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">KES {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-medium">{shippingCost === 0 ? "FREE" : `KES ${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
              <span>Total:</span>
              <span>KES {total.toFixed(2)}</span>
            </div>
          </div>
          <Button
            onClick={onPlaceOrder}
            className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold mt-6 transition-colors duration-200"
            disabled={productsInCart.length === 0}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
