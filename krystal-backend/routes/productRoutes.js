// krystal-backend/routes/productRoutes.js

import express from 'express';
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reviewProduct,
  getPersonalizedRecommendations, // <-- Your controller function
  uploadProductImage,
} from '../controllers/productController.js';
import { protect, admin, agent } from '../middleware/authMiddleware.js'; // Ensure these are imported if used elsewhere

// THIS IS THE CRUCIAL PART: Ensure 'protect' is ABSENT here
router.route('/recommendations')
  .get(getPersonalizedRecommendations); // <--- NO 'protect' middleware here

// Other routes (these are fine to have protect/admin/agent)
router.route('/').get(getProducts); // getProducts can be public
router.route('/').post(protect, agent, createProduct);

router.route('/:id').get(getProductById);
router.route('/:id').put(protect, agent, updateProduct).delete(protect, agent, deleteProduct);

router.route('/:id/review').put(protect, admin, reviewProduct); // This one is protected by admin
router.route('/:id/upload-image').post(protect, agent, uploadProductImage); // This one is protected by agent

export default router;