// routes/authRoutes.js

import express from 'express';
import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';       
import crypto from 'crypto';          
 import nodemailer from 'nodemailer'; 

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user (password hashing handled by pre-save hook in User model)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // If user created successfully, send response with token
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Request password reset link
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Send a generic success message even if user not found to prevent email enumeration
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the token and save it to the user model
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // Token valid for 1 hour (3600000 ms)

    await user.save();

    // Construct the reset URL (this would typically be your frontend's reset password page)
    const resetUrl = `http://localhost:8082/resetpassword/${resetToken}`; 

    // --- In a real application, you would send an email here ---
    
    const transporter = nodemailer.createTransport({
      // Configure your email service (e.g., Gmail, SendGrid, Mailgun)
      service: 'Gmail', // Example
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: 'noreply@krystalstore.com',
      to: user.email,
      subject: 'Krystal Store Password Reset Request',
      html: `<p>You are receiving this because you (or someone else) has requested the reset of a password.</p>
             <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    await transporter.sendMail(mailOptions);
    
    // --- End of email sending section ---

    console.log(`Password reset link (for testing): ${resetUrl}`); 
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error(error);
    // Clear reset token fields if an error occurs during token generation/saving
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpire = undefined;
    // await user.save();
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
router.put('/resetpassword/:resetToken', async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password (hashing handled by pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});


export default router;
