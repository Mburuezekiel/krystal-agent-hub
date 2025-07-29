import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

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

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      address,
      password,
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.role === 'admin' || user.role === 'agent') {
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
        });
      } else {
        res.status(403).json({ message: 'Access denied: Only admin and agent accounts can log in here.' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.role === 'admin' || user.role === 'agent'||  user.role === 'user') {
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
        });
      } else {
        res.status(403).json({ message: 'Access denied: Only admin and agent accounts can log in here.' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  let user;

  try {
    user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    const resetUrl = `http://localhost:8082/resetpassword/${resetToken}`;


    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: 'inuafund@gmail.com',
      to: user.email,
      subject: 'Krystal Store Password Reset Request',
      html: `<p>You are receiving this because you (or someone else) has requested the reset of a password.</p>
             <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    await transporter.sendMail(mailOptions);


    console.log(`Password reset link (for testing): ${resetUrl}`);
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Error during password reset request:', error);

    if (user && user.resetPasswordToken && user.resetPasswordExpire) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

router.put('/resetpassword/:resetToken', async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
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
