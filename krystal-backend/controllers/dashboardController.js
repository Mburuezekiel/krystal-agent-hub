// backend/controllers/dashboardController.js
import asyncHandler from 'express-async-handler'; // For simpler async error handling
import User from '../models/User.js';
// import Product from '../models/Product.js'; // Uncomment if you have a Product model
// import Order from '../models/Order.js';     // Uncomment if you have an Order model

// @desc    Get dashboard statistics for admin
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // You would typically get counts from your database models here.
  // For now, I'll provide basic User counts and placeholders for others.
  const totalUsers = await User.countDocuments({});
  const activeAgents = await User.countDocuments({ role: 'agent' });
  // const totalAdmins = await User.countDocuments({ role: 'admin' }); // Can add if needed
  // const totalClients = await User.countDocuments({ role: 'user' }); // Can add if needed

  // Placeholder for products and revenue.
  // Replace with actual database queries if you have these models.
  const productsListed = 1234; // Example: await Product.countDocuments({});
  const totalRevenue = 567890; // Example: await Order.aggregate([ { $group: { _id: null, total: { $sum: '$totalAmount' } } } ]);

  res.json({
    totalUsers,
    activeAgents,
    productsListed,
    totalRevenue,
  });
});

// @desc    Get recent activities for admin dashboard
// @route   GET /api/dashboard/recent-activities
// @access  Private/Admin
const getRecentActivities = asyncHandler(async (req, res) => {
  // In a real application, you would fetch recent activities from a dedicated
  // 'ActivityLog' model or aggregate recent events from various models (users, products, orders).
  // For demonstration, here's some mock data:
  const activities = [
    {
      _id: 'act1',
      type: 'user_registration',
      message: 'New user Alice Smith registered.',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      status: 'info',
    },
    {
      _id: 'act2',
      type: 'product_approval',
      message: 'Product "Vintage Watch" approved by Agent John.',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      status: 'success',
    },
    {
      _id: 'act3',
      type: 'agent_application',
      message: 'New agent application from Bob Johnson is pending.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'warning',
    },
    {
      _id: 'act4',
      type: 'transaction_completed',
      message: 'Transaction #ABC1234 for $1500 completed.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      status: 'success',
    },
    {
      _id: 'act5',
      type: 'system_alert',
      message: 'Database connection issue detected.',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
      status: 'error',
    },
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by most recent

  res.json(activities);
});

// @desc    Get pending tasks for admin dashboard
// @route   GET /api/dashboard/pending-tasks
// @access  Private/Admin
const getPendingTasks = asyncHandler(async (req, res) => {
  // Replace this with actual queries to your models to find pending items.
  // For example:
  // const pendingAgentApplications = await User.countDocuments({ role: 'pending_agent' });
  // const pendingProductApprovals = await Product.countDocuments({ status: 'pending_approval' });
  const tasks = [
    { _id: 'task1', title: 'Review Agent Applications', count: 3, priority: 'high' },
    { _id: 'task2', title: 'Approve New Products', count: 15, priority: 'medium' },
    { _id: 'task3', title: 'Resolve User Reports', count: 2, priority: 'high' },
    { _id: 'task4', title: 'Update System Configurations', count: 1, priority: 'low' },
  ];

  res.json(tasks);
});

export {
  getDashboardStats,
  getRecentActivities,
  getPendingTasks,
};