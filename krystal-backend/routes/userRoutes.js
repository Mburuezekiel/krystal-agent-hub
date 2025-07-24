import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRoleByAdmin
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);


router.get('/', protect, admin, getAllUsers);

router.put('/:id/role', protect, admin, updateUserRoleByAdmin);

export default router;