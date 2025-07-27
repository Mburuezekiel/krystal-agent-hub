// models/Notification.js (Example Mongoose Schema)
import mongoose from 'mongoose';

const NotificationSchema = mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming your agents are 'User' documents
    },
    type: {
      type: String,
      enum: ['approval', 'sale', 'rejection', 'info'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    product: { // Optional: Link to a specific product
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;