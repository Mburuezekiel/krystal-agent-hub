// routes/notificationRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js'; // Adjust path as needed
import auth from '../middleware/authMiddleware.js'; // Assuming your auth middleware is here
import { protect, admin, agent } from '../middleware/authMiddleware.js'; // Assuming you have role-based middleware

const router = express.Router();

/**
 * @desc    Get all notifications for the authenticated agent
 * @route   GET /api/notifications/agent
 * @access  Private (Agent)
 */
router.get(
  '/agent',
  protect, // Ensure user is authenticated
  agent,   // Ensure user has 'agent' role
  asyncHandler(async (req, res) => {
    // req.user._id is populated by the 'protect' middleware
    const agentId = req.user._id;

    const notifications = await Notification.find({ agent: agentId })
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(20); // Limit to a reasonable number for recent notifications

    // Map to a more frontend-friendly format if needed, including time ago
    const formattedNotifications = notifications.map(notif => ({
      _id: notif._id,
      type: notif.type,
      message: notif.message,
      isRead: notif.isRead,
      createdAt: notif.createdAt, // Keep original timestamp
      time: `${Math.floor((Date.now() - new Date(notif.createdAt).getTime()) / (1000 * 60 * 60))} hours ago`, // Simple time ago
      // Or use a more sophisticated date formatting library on the frontend
    }));

    res.json(formattedNotifications);
  })
);

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private (Agent)
 */
router.put(
  '/:id/read',
  protect,
  agent,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      // Ensure the notification belongs to the authenticated agent
      if (notification.agent.toString() !== req.user._id.toString()) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized to update this notification');
      }

      notification.isRead = true;
      const updatedNotification = await notification.save();
      res.json({ message: 'Notification marked as read', notification: updatedNotification });
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  })
);

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private (Agent)
 */
router.delete(
  '/:id',
  protect,
  agent,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      // Ensure the notification belongs to the authenticated agent
      if (notification.agent.toString() !== req.user._id.toString()) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized to delete this notification');
      }

      await notification.deleteOne(); // Use deleteOne() for Mongoose 6+
      res.json({ message: 'Notification removed' });
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  })
);

/**
 * @desc    Create a new notification (typically called internally or by admin)
 * @route   POST /api/notifications
 * @access  Private (Admin or Internal Service)
 * This route would usually be called by other backend services (e.g., after product review, or a sale)
 * or by an admin. It's not typically exposed directly to the general frontend user.
 */
router.post(
  '/',
  protect,
  admin, // Only admin can create notifications via this endpoint
  asyncHandler(async (req, res) => {
    const { agentId, type, message, productId } = req.body;

    if (!agentId || !type || !message) {
      res.status(400);
      throw new Error('Please provide agentId, type, and message for the notification');
    }

    const notification = new Notification({
      agent: agentId,
      type,
      message,
      product: productId || null,
    });

    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
  })
);


export default router;