// controllers/userController.js
import User from '../models/User.js'; // Adjust path as needed
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is available because of the 'protect' middleware
  const user = await User.findById(req.user._id).select('-password'); // Exclude password

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cart: user.cart,
      wishlist: user.wishlist,
      orders: user.orders,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id); // Get the user from the database

  if (user) {
    // Update basic profile fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.userName = req.body.userName || user.userName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;
    user.updatedAt = Date.now(); // Update the updatedAt timestamp

    // Handle password update separately if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      // Password hashing is handled by the pre-save hook in the User model
      user.password = req.body.password;
    }

    // Check for duplicate username or email if they are being changed
    if (req.body.userName && req.body.userName !== user.userName) {
      const existingUserWithUsername = await User.findOne({ userName: req.body.userName });
      if (existingUserWithUsername && existingUserWithUsername._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'This username is already taken.' });
      }
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email: req.body.email });
      if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'This email is already taken.' });
      }
    }

    try {
      const updatedUser = await user.save(); // Save the updated user document

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        role: updatedUser.role,
        token: req.headers.authorization.split(' ')[1], // Return the existing token (or generate a new one if token data changes)
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error saving updated user profile:', error);
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      // Handle duplicate key errors (e.g., if unique index is violated after update)
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Duplicate value entered for a unique field.' });
      }
      res.status(500).json({ message: 'Server error during profile update' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export { getUserProfile, updateUserProfile };