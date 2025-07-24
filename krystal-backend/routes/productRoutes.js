import express from 'express';
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reviewProduct,
  uploadProductImage,
} from '../controllers/productController.js';
import { protect, admin, agent } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

router.route('/')
  .post(protect, agent,admin, createProduct);

router.route('/:id')
  .put(protect, agent, updateProduct)
  .delete(protect, agent, deleteProduct);

router.route('/:id/review')
  .put(protect, admin, reviewProduct);

router.route('/:id/upload-image')
  .post(protect, agent, uploadProductImage);

export default router;