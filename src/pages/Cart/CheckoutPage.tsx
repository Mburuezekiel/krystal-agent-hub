// src/pages/CheckoutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming you have a Label component from Shadcn
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Assuming you have RadioGroup from Shadcn
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Dummy Cart State (in a real app, this would be passed from CartPage or global state)
// Re-using the DUMMY_CART_ITEMS and getProductById for demonstration
import { getProductById, Product } from '@/services/product-service';

interface CartItem {
  productId: string;
  quantity: number;
}

const DUMMY_CHECKOUT_ITEMS: CartItem[] = [
  { productId: 'p1', quantity: 1 },
  { productId: 'p5', quantity: 2 },
];

// Zod schema for shipping details
const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  email: z.string().email("Invalid email address"),
});

// Zod schema for payment details (simplified for dummy)
const paymentSchema = z.object({
  paymentMethod: z.enum(["mpesa", "card", "cash"], {
    required_error: "Payment method is required",
  }),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

const CheckoutPage: React.FC = () => {
  const { register: registerShipping, handleSubmit: handleShippingSubmit, formState: { errors: shippingErrors } } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
  });

  const { register: registerPayment, handleSubmit: handlePaymentSubmit, formState: { errors: paymentErrors }, setValue: setPaymentValue, watch: watchPaymentMethod } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "mpesa", // Default selected
    }
  });

  const selectedPaymentMethod = watchPaymentMethod("paymentMethod");

  const [productsInCart, setProductsInCart] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const fetchedProducts: Product[] = [];
    DUMMY_CHECKOUT_ITEMS.forEach(item => {
      const product = getProductById(item.productId);
      if (product) {
        fetchedProducts.push({ ...product, quantity: item.quantity });
      }
    });
    setProductsInCart(fetchedProducts);
  }, []);

  const calculateSubtotal = () => {
    return productsInCart.reduce((total, product) => {
      const itemInCart = DUMMY_CHECKOUT_ITEMS.find(item => item.productId === product.id);
      return total + (product.price * (itemInCart?.quantity || 0));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shippingCost;

  const onPlaceOrder = (shippingData: ShippingFormValues, paymentData: PaymentFormValues) => {
    console.log("Placing Order:", { shippingData, paymentData, cartItems: productsInCart, total });
    // In a real app, you'd send this data to your backend for order processing
    alert("Order Placed Successfully! Thank you for your purchase.");
    // Redirect to order confirmation page or homepage
    // navigate('/order-confirmation');
  };

  return (
    <>
     
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Payment Forms */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {/* Shipping Address */}
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Shipping Address</h2>
            <form id="shipping-form" onSubmit={handleShippingSubmit(data => console.log('Shipping data:', data))} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

            {/* Payment Method */}
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05] mt-10">Payment Method</h2>
            <form id="payment-form" onSubmit={handlePaymentSubmit(data => console.log('Payment data:', data))}>
              <RadioGroup
                onValueChange={(value: "mpesa" | "card" | "cash") => setPaymentValue("paymentMethod", value)}
                value={selectedPaymentMethod}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="mpesa" id="mpesa" className="text-[#D81E05] focus:ring-[#D81E05]" />
                  <Label htmlFor="mpesa" className="text-lg font-medium">M-Pesa</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="card" id="card" className="text-[#D81E05] focus:ring-[#D81E05]" />
                  <Label htmlFor="card" className="text-lg font-medium">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="cash" id="cash" className="text-[#D81E05] focus:ring-[#D81E05]" />
                  <Label htmlFor="cash" className="text-lg font-medium">Cash on Delivery</Label>
                </div>
              </RadioGroup>
              {paymentErrors.paymentMethod && <p className="text-red-500 text-sm mt-2">{paymentErrors.paymentMethod.message}</p>}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {productsInCart.map(product => {
                const itemQuantity = DUMMY_CHECKOUT_ITEMS.find(item => item.productId === product.id)?.quantity || 0;
                return (
                  <div key={product.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#222222]">{product.name} (x{itemQuantity})</span>
                    <span className="text-[#222222]">KES {(product.price * itemQuantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3 text-lg border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>KES {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'FREE' : `KES ${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
                <span>Total:</span>
                <span>KES {total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleShippingSubmit((shippingData) => {
                handlePaymentSubmit((paymentData) => onPlaceOrder(shippingData, paymentData))();
              })}
              className="w-full mt-8 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
  
    </>
  );
};

export default CheckoutPage;