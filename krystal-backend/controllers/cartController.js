import Cart from '../models/Cart.js';
import Product from '../models/Product.js'; // Assuming your Product model is in models/Product.js

/**
 * @desc    Add product to cart or update quantity if already in cart
 * @route   POST /api/cart
 * @access  Private (requires authentication)
 */
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Assuming req.user._id is set by your authentication middleware

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
  }

  try {
    // 1. Find the product to get its details (name, imageUrl, current price)
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
    }

    // 2. Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart for the user
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // 3. Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
      // Optionally, update price if you want it to reflect current price,
      // but typically price at time of addition is preferred for order consistency
      // cart.items[itemIndex].price = product.price;
    } else {
      // Product not in cart, add new item
      cart.items.push({
        product: productId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price, // Price at the time of adding to cart
        quantity: quantity,
      });
    }

    // 4. Save the updated cart
    await cart.save();

    res.status(200).json({
      message: 'Product added to cart successfully!',
      cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error: Could not add product to cart.' });
  }
};

// You might add other cart functionalities here later, e.g.,
// export const getCart = async (req, res) => { ... };
// export const updateCartItemQuantity = async (req, res) => { ... };
// export const removeCartItem = async (req, res) => { ... };
