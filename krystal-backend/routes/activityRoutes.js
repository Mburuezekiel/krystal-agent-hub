// routes/activityRoutes.js
import express from 'express';
import Activity from '../models/Activity.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'; // Ensure correct path to middleware

const router = express.Router();

// @desc    Get all activities for the logged-in agent
// @route   GET /api/activities
// @access  Private (agent only)
router.get('/', protect, async (req, res) => {
  try {
    // Ensure req.user is available from protect middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found after token verification.' });
    }
    // Fetch activities where the 'agent' field matches the logged-in agent's ID
    const activities = await Activity.find({ agent: req.user._id })
      .sort({ timestamp: -1 }); // Sort by most recent

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
});

// @desc    Get a specific activity by ID (ensure it belongs to the logged-in agent)
// @route   GET /api/activities/:id
// @access  Private (agent only)
router.get('/:id', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    const activity = await Activity.findOne({ _id: req.params.id, agent: req.user._id });

    if (activity) {
      res.json(activity);
    } else {
      res.status(404).json({ message: 'Activity not found or you are not authorized to view it' });
    }
  } catch (error) {
    console.error('Error fetching single activity:', error);
    res.status(500).json({ message: 'Server error fetching activity' });
  }
});

// @desc    Create a new activity (agent can log their own actions, or actions related to other users)
// @route   POST /api/activities
// @access  Private (agent only) - You might want `authorizeRoles('agent', 'admin')` if only specific roles can create
router.post('/', protect, async (req, res) => {
  // `relatedUser` is now used instead of `customerId`
  const { type, title, description, status, metadata, productId, relatedUser } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    const newActivity = await Activity.create({
      agent: req.user._id, // Assign the activity to the logged-in agent who is performing or logging it
      type,
      title,
      description,
      status,
      metadata,
      productId,
      relatedUser, // Optional: The ID of another user (e.g., a customer) involved in this activity
    });
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Server error creating activity' });
  }
});

// @desc    Get all activities that involve products for the logged-in agent
// @route   GET /api/activities/products-involved
// @access  Private (agent only)
router.get('/products-involved', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    // Find all activities by the agent that have a productId (or product_ in type)
    const activitiesWithProducts = await Activity.find({
      agent: req.user._id,
      $or: [
        { productId: { $exists: true, $ne: null } },
        { type: { $regex: /^product_/, $options: 'i' } } // Activities directly related to products
      ]
    }).sort({ timestamp: -1 });

    // If you had a separate Product model and wanted to populate:
    // .populate('productId', 'name price category'); // This requires a 'Product' model and ref in Activity schema

    res.json(activitiesWithProducts);
  } catch (error) {
    console.error('Error fetching products involved activities:', error);
    res.status(500).json({ message: 'Server error fetching products involved' });
  }
});

// @desc    Get any data in the database that bears the agent's ID
//          This is a broad query and needs refinement based on your DB structure.
// @route   GET /api/activities/data-by-agent-id
// @access  Private (agent only)
router.get('/data-by-agent-id', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    const agentId = req.user._id;

    // This endpoint aggregates data that is explicitly linked to the agent's ID.
    // This could include activities performed *by* the agent (`agent` field)
    // or activities where the agent is the *subject* of the action (`relatedUser` field),
    // for example, if an admin tracks an agent's profile update.
    const agentActivities = await Activity.find({
      $or: [
        { agent: agentId },
        { relatedUser: agentId }
      ]
    }).sort({ timestamp: -1 });

    // Extend this section to query other relevant collections where the agent's ID
    // might be referenced, if such collections exist in your schema (e.g., Orders, Messages).
    // For example:
    // const ordersProcessedByAgent = await Order.find({ processedByAgent: agentId });
    // const messagesSentByAgent = await Message.find({ sender: agentId });

    res.json({
      activities: agentActivities,
      // ordersProcessed: ordersProcessedByAgent, // Uncomment and implement if you have this model
      // messagesSent: messagesSentByAgent, // Uncomment and implement if you have this model
      message: "This endpoint aggregates data directly linked to the agent's ID across various collections. Expand as needed."
    });

  } catch (error) {
    console.error('Error fetching data by agent ID:', error);
    res.status(500).json({ message: 'Server error fetching data by agent ID' });
  }
});

// @desc    Update an activity (only if it belongs to the logged-in agent)
// @route   PUT /api/activities/:id
// @access  Private (agent only)
router.put('/:id', protect, async (req, res) => {
  // `relatedUser` is now used instead of `customerId`
  const { type, title, description, status, metadata, productId, relatedUser } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    const activity = await Activity.findOne({ _id: req.params.id, agent: req.user._id });

    if (activity) {
      activity.type = type !== undefined ? type : activity.type;
      activity.title = title !== undefined ? title : activity.title;
      activity.description = description !== undefined ? description : activity.description;
      activity.status = status !== undefined ? status : activity.status;
      activity.metadata = metadata !== undefined ? metadata : activity.metadata;
      activity.productId = productId !== undefined ? productId : activity.productId;
      activity.relatedUser = relatedUser !== undefined ? relatedUser : activity.relatedUser; // Update this field

      const updatedActivity = await activity.save();
      res.json(updatedActivity);
    } else {
      res.status(404).json({ message: 'Activity not found or you are not authorized to update it' });
    }
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Server error updating activity' });
  }
});

// @desc    Delete an activity (only if it belongs to the logged-in agent)
// @route   DELETE /api/activities/:id
// @access  Private (agent only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    const activity = await Activity.findOne({ _id: req.params.id, agent: req.user._id });

    if (activity) {
      await activity.deleteOne();
      res.json({ message: 'Activity removed' });
    } else {
      res.status(404).json({ message: 'Activity not found or you are not authorized to delete it' });
    }
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
});

// @desc    Fetch activities by type for the logged-in agent
// @route   GET /api/activities/type/:activityType
// @access  Private (agent only)
router.get('/type/:activityType', protect, async (req, res) => {
  const { activityType } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }

    const query = { agent: req.user._id };
    if (activityType !== 'all') {
      if (activityType === 'products') {
        query.type = { $regex: /^product_/, $options: 'i' }; // Matches 'product_created', 'product_updated', etc.
      } else if (activityType === 'sales') {
        query.type = { $in: ['product_sold', 'earnings_paid', 'user_purchased'] }; // Added 'user_purchased'
      } else if (activityType === 'reviews') {
        query.type = 'review_received';
      } else if (activityType === 'agent_activity') {
        query.type = { $regex: /^agent_/ }; // Matches 'agent_login', 'agent_profile_update'
      } else if (activityType === 'user_activity') { // New filter for activities by/about general users
        query.type = { $regex: /^user_/ }; // Matches 'user_registered', 'user_purchased', etc.
      } else {
        query.type = activityType; // For any other specific type
      }
    }

    const activities = await Activity.find(query).sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    res.status(500).json({ message: 'Server error fetching activities by type' });
  }
});

// @desc    Search activities for the logged-in agent
// @route   GET /api/activities/search
// @access  Private (agent only)
router.get('/search', protect, async (req, res) => {
  const { q } = req.query; // Search term
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }
    const activities = await Activity.find({
      agent: req.user._id, // Still only search within the logged-in agent's activities
      $or: [
        { title: { $regex: q, $options: 'i' } }, // Case-insensitive search on title
        { description: { $regex: q, $options: 'i' } } // Case-insensitive search on description
      ]
    }).sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    console.error('Error during activity search:', error);
    res.status(500).json({ message: 'Server error during activity search' });
  }
});

export default router;