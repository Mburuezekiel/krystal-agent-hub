import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * @desc    Add product to cart or update quantity if already in cart
 * @route   POST /api/cart
 * @access  Private (requires authentication)
 */
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: quantity,
      });
    }

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

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private (requires authentication)
 */
export const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price imageUrl stock');

    if (!cart) {
      return res.status(200).json({ message: 'Cart is empty.', cart: { user: userId, items: [] } });
    }

    res.status(200).json({
      message: 'Cart retrieved successfully!',
      cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error: Could not retrieve cart.' });
  }
};

/**
 * @desc    Update quantity of a specific item in the cart
 * @route   PUT /api/cart/:productId
 * @access  Private (requires authentication)
 */
export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'A valid quantity is required.' });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found in database.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: 'Cart item quantity updated successfully!',
      cart,
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Server error: Could not update cart item quantity.' });
  }
};

/**
 * @desc    Remove a specific item from the cart
 * @route   DELETE /api/cart/:productId
 * @access  Private (requires authentication)
 */
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Product not found in cart to remove.' });
    }

    await cart.save();

    res.status(200).json({
      message: 'Product removed from cart successfully!',
      cart,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error: Could not remove item from cart.' });
  }
};
