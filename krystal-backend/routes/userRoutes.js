// routes/userRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'; // Adjust path
import { protect } from '../middleware/authMiddleware.js'; // Adjust path

const router = express.Router();

// Apply 'protect' middleware to all routes in this file that require authentication
router.route('/profile')
  .get(protect, getUserProfile) // GET /api/users/profile
  .put(protect, updateUserProfile); // PUT /api/users/profile

export default router;