import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const activeAgents = await User.countDocuments({ role: 'agent' });

  const productsListed = 1234;
  const totalRevenue = 567890;

  res.json({
    totalUsers,
    activeAgents,
    productsListed,
    totalRevenue,
  });
});

const getRecentActivities = asyncHandler(async (req, res) => {
  const activities = [
    {
      _id: 'act1',
      type: 'user_registration',
      message: 'New user Alice Smith registered.',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'info',
    },
    {
      _id: 'act2',
      type: 'product_approval',
      message: 'Product "Vintage Watch" approved by Agent John.',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      _id: 'act3',
      type: 'agent_application',
      message: 'New agent application from Bob Johnson is pending.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'warning',
    },
    {
      _id: 'act4',
      type: 'transaction_completed',
      message: 'Transaction #ABC1234 for $1500 completed.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      _id: 'act5',
      type: 'system_alert',
      message: 'Database connection issue detected.',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: 'error',
    },
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(activities);
});

const getPendingTasks = asyncHandler(async (req, res) => {
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