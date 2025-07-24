import express from 'express';
import { addToCart, getCart, updateCartItemQuantity, removeCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addToCart)
  .get(protect, getCart);

router.route('/:productId')
  .put(protect, updateCartItemQuantity)
  .delete(protect, removeCartItem);

export default router;
