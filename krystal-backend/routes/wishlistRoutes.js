import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistControlle.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addToWishlist)
  .get(protect, getWishlist);

router.route('/:productId')
  .delete(protect, removeFromWishlist);

export default router;
