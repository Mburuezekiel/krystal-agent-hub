import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js'; // Assuming your Product model is in models/Product.js

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private (requires authentication)
 */
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // Assuming req.user._id is set by your authentication middleware

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    // 1. Find the product to get its details
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // 2. Find the user's wishlist or create a new one
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [],
      });
    }

    // 3. Check if the product already exists in the wishlist
    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (itemExists) {
      return res.status(409).json({ message: 'Product already in wishlist.' });
    } else {
      // Product not in wishlist, add new item
      wishlist.items.push({
        product: productId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price, // Price at the time of adding to wishlist
      });
    }

    // 4. Save the updated wishlist
    await wishlist.save();

    res.status(200).json({
      message: 'Product added to wishlist successfully!',
      wishlist,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error: Could not add product to wishlist.' });
  }
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private (requires authentication)
 */
export const getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    // Populate product details for display
    const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product', 'name price imageUrl');

    if (!wishlist) {
      // If no wishlist exists, return an empty wishlist
      return res.status(200).json({ message: 'Wishlist is empty.', wishlist: { user: userId, items: [] } });
    }

    res.status(200).json({
      message: 'Wishlist retrieved successfully!',
      wishlist,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error: Could not retrieve wishlist.' });
  }
};

/**
 * @desc    Remove a specific item from the wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private (requires authentication)
 */
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this user.' });
    }

    const initialItemCount = wishlist.items.length;
    // Filter out the item to be removed
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (wishlist.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Product not found in wishlist to remove.' });
    }

    await wishlist.save();

    res.status(200).json({
      message: 'Product removed from wishlist successfully!',
      wishlist,
    });
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    res.status(500).json({ message: 'Server error: Could not remove item from wishlist.' });
  }
};
