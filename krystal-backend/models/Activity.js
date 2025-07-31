// models/Activity.js (UPDATED - Option B: With relatedUser)
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  agent: { // The agent who performed or is related to this activity
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model (which includes agents)
    required: true,
  },
  relatedUser: { // The user (who might be a customer) involved in the activity, if applicable
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Not all activities involve a 'relatedUser'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'product_created',
      'product_updated',
      'product_deleted',
      'product_sold',
      'product_approved',
      'product_viewed',
      'review_received',
      'message_received',
      'earnings_paid',
      'agent_login',
      'agent_profile_update',
      'user_registered',
      'user_purchased',
      'user_message_sent', // Example: a user (customer) sent a message
      // Add more types as needed
    ],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'pending_approval', 'approved', 'info', 'failed'],
    default: 'completed',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Stores flexible data
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
}, {
  timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;