// server.js

import dotenv from 'dotenv'; // Import dotenv once
dotenv.config(); // Call dotenv.config() once at the very top

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // Mongoose is typically imported here if you need its types or direct methods
import connectDB from './config/db.js'; // Ensure this path is correct

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Define the exact origin(s) of your frontend
// Use an environment variable for deployment (e.g., on Render)
const allowedOrigins = [
  'http://localhost:8081', // Your local React dev server from the screenshot
  'http://localhost:3000', // Common alternative for React dev server
  process.env.FRONTEND_URL, // Your deployed frontend URL on Render (e.g., https://your-frontend-app.onrender.com)
].filter(Boolean); // Filter out any undefined/null values if env var is not set

// Middleware
app.use(express.json()); // Body parser for JSON

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // and requests from your allowed origins.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS Error: Origin ${origin} not allowed.`); // Log disallowed origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // THIS IS CRUCIAL: Allow cookies and Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly list all methods your API uses
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly list all headers your API expects
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('Krystal Store Backend API is running!');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  // More specific error handling for CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).send('CORS policy: Not allowed by specified origin');
  }
  res.status(500).send('Something broke on the server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});