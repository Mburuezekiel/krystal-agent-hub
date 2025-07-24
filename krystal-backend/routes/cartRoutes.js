import express from 'express';
import { addToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addToCart);

router.route('/').get(protect, getCart);
router.route('/:id').put(protect, updateCartItemQuantity);
router.route('/:id').delete(protect, removeCartItem);

export default router;
