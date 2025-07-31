// routes/authRoutes.js (UPDATED)
import express from 'express';
import User from '../models/User.js';
import Activity from '../models/Activity.js'; // Import Activity model for logging
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // Ensure dotenv is imported if not already in server.js for env vars here

dotenv.config(); // Make sure environment variables are loaded if this file needs them directly

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, userName, email, phoneNumber, address, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const usernameExists = await User.findOne({ userName });
    if (usernameExists) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }

    // Default role for new registrations can be 'user'
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      address,
      password,
      role: 'user', // Explicitly set default role to 'user' for new registrations
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
        createdAt: user.createdAt, // Include createdAt from Mongoose timestamps
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Authenticate agent/admin user & get token (for Agent Portal login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Restrict access to 'admin' or 'agent' roles for this specific login endpoint
      if (user.role === 'admin' || user.role === 'agent') {
        // Log agent login activity
        await Activity.create({
          agent: user._id, // The agent who logged in
          type: 'agent_login',
          title: `Agent ${user.userName} logged in`,
          description: `Agent ${user.userName} successfully logged into the Agent Portal.`,
          status: 'completed',
          metadata: {
            ipAddress: req.ip,
            browser: req.headers['user-agent'],
          }
        });

        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role,
          token: generateToken(user._id),
          createdAt: user.createdAt, // Include createdAt
        });
      } else {
        // If user is found but role is not admin/agent
        res.status(403).json({ message: 'Access denied: Only admin and agent accounts can log in here.' });
      }
    } else {
      // If user not found or password doesn't match
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during agent/admin login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Authenticate any user & get token (for general user/customer login)
// @route   POST /api/auth/user/login
// @access  Public
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Log user login activity (for general users)
      await Activity.create({
        agent: user._id, // The user who logged in (can be considered an 'agent' of their own activities)
        type: 'user_login',
        title: `User ${user.userName} logged in`,
        description: `User ${user.userName} successfully logged into the platform.`,
        status: 'completed',
        metadata: {
          ipAddress: req.ip,
          browser: req.headers['user-agent'],
        }
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
        createdAt: user.createdAt, // Include createdAt
      });
    } else {
      // If user not found or password doesn't match
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during general user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Request password reset link
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  let user;

  try {
    user = await User.findOne({ email });

    if (!user) {
      // Send 200 OK even if user not found to prevent email enumeration attacks
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    // Use environment variable for frontend reset password URL for deployment
    const resetUrl = `${process.env.FRONTEND_RESET_PASSWORD_URL || 'http://localhost:8082/resetpassword'}/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'Gmail'
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM_ADDRESS || 'inuafund@gmail.com', // Use env var for from address
      to: user.email,
      subject: 'Krystal Store Password Reset Request',
      html: `<p>You are receiving this because you (or someone else) has requested the reset of a password.</p>
             <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Password reset link (for testing): ${resetUrl}`); // Keep for dev debugging
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Error during password reset request:', error);

    // Clear reset token fields if an error occurs after setting them
    if (user && user.resetPasswordToken && user.resetPasswordExpire) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
router.put('/resetpassword/:resetToken', async (req, res) => {
  // Hash the incoming token to match the stored hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token fields
    user.password = password; // Mongoose pre-save hook will hash this
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

export default router;