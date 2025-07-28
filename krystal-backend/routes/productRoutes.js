import express from 'express';
const router = express.Router();
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAgentProducts,
    reviewProduct,
    getProductsForAdmin,
    getPersonalizedRecommendations,
    uploadProductImage,
} from '../controllers/productController.js';
import { protect, admin, agent } from '../middleware/authMiddleware.js';

router.route('/recommendations')
    .get(getPersonalizedRecommendations);

// Public/Customer facing route - only approved & active products
router.route('/').get(getProducts);

// Route for agents to create products (their own products will be shown via '/api/products?agent=true' or similar)
router.route('/').post(protect, agent, createProduct);

// ADMIN-SPECIFIC ENDPOINT to get ALL products with various statuses
// This route should come before general :id routes to avoid conflicts
router.route('/agent').get( agent, getAgentProducts);
router.route('/admin').get( admin, getProductsForAdmin);

router.route('/:id').get(getProductById);
router.route('/:id').put(protect, agent, updateProduct).delete(protect, agent, deleteProduct);

router.route('/:id/review').put(protect, admin, reviewProduct);
router.route('/:id/upload-image').post(protect, agent, uploadProductImage);

export default router;