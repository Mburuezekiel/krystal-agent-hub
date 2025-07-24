import express from 'express';
import { addToCart } from '../controllers/cartController.js';
// Assuming you have an authentication middleware, e.g., authMiddleware.js
import { protect } from '../middleware/authMiddleware.js'; // Adjust path as per your project structure

const router = express.Router();

// Route to add a product to the cart
// This route requires authentication (e.g., a JWT token)
router.route('/').post(protect, addToCart);

// You might add other routes here later, e.g.,
// router.route('/').get(protect, getCart); // Get user's cart
// router.route('/:id').put(protect, updateCartItemQuantity); // Update item quantity
// router.route('/:id').delete(protect, removeCartItem); // Remove item from cart

export default router;
