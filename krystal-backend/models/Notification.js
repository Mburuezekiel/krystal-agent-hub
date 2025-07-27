// models/Notification.js
import mongoose from 'mongoose';

const NotificationSchema = mongoose.Schema(
  {
    // Link to the user (agent) who receives the notification
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming 'User' is your agent/user model
    },
    // Type of notification (e.g., 'approval', 'sale', 'rejection', 'info')
    type: {
      type: String,
      enum: ['approval', 'sale', 'rejection', 'info', 'product_update', 'system'], // Expanded types
      required: true,
    },
    // The actual message content
    message: {
      type: String,
      required: true,
    },
    // Optional: Link to a specific product related to the notification
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null, // Can be null if not product-specific
    },
    // Whether the notification has been read by the user
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;