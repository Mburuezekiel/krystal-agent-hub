import express from 'express';
const router = express.Router();
import { createOrder, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import { protect ,admin} from '../middleware/authMiddleware.js';


// Main user-related order routes
router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

// ADMIN route to get all orders
// Note the two middleware functions: first authenticate the user, then check if they are an admin.
router.route('/all')
  .get(protect, admin, getAllOrders);

// Route to get a specific order by ID (if it exists)
//router.route('/:id')
  //.get(protect, getOrderById);  Assuming getOrderById is also in your controller

export default router;