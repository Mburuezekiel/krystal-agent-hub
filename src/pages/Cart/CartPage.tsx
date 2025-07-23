import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { getProductById, Product } from '@/services/product-service';
import { X } from 'lucide-react';

interface CartItem {
  productId: string;
  quantity: number;
}

const DUMMY_CART_ITEMS: CartItem[] = [
  { productId: 'p1', quantity: 1 },
  { productId: 'p5', quantity: 2 },
  { productId: 'p15', quantity: 1 },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(DUMMY_CART_ITEMS);
  const [productsInCart, setProductsInCart] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const fetchedProducts: Product[] = [];
    cartItems.forEach(item => {
      const product = getProductById(item.productId);
      if (product) {
        fetchedProducts.push({ ...product, quantity: item.quantity });
      }
    });
    setProductsInCart(fetchedProducts);
  }, [cartItems]);

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const calculateSubtotal = () => {
    return productsInCart.reduce((total, product) => {
      const itemInCart = cartItems.find(item => item.productId === product.id);
      return total + (product.price * (itemInCart?.quantity || 0));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shippingCost;

  return (
    <>
     
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Your Shopping Cart</h1>

        {productsInCart.length === 0 ? (
          <div className="text-center text-lg py-10">
            <p className="mb-4">Your cart is empty. Start shopping now!</p>
            <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Items in your Cart</h2>
              <div className="space-y-6">
                {productsInCart.map(product => {
                  const itemQuantity = cartItems.find(item => item.productId === product.id)?.quantity || 0;
                  return (
                    <div key={product.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <Link to={`/product/${product.id}`} className="flex-shrink-0">
                        <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md border border-gray-200" />
                      </Link>
                      <div className="flex-grow">
                        <Link to={`/product/${product.id}`} className="text-lg font-semibold text-[#222222] hover:text-[#D81E05]">
                          {product.name}
                        </Link>
                        <p className="text-gray-600 text-sm">{product.category}</p>
                        <p className="text-[#D81E05] font-bold mt-1">KES {product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-8 h-8 rounded-full border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white"
                        >
                          -
                        </Button>
                        <span className="text-lg font-medium w-8 text-center">{itemQuantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-8 h-8 rounded-full border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white"
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(product.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#D81E05]">Order Summary</h2>
              <div className="space-y-3 text-lg">
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
              <Button asChild className="w-full mt-8 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" asChild className="w-full mt-4 border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white rounded-full px-8 py-3 text-lg font-semibold">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    
    </>
  );
};

export default CartPage;
