import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

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

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.userName = req.body.userName || user.userName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;
    user.updatedAt = Date.now();

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      user.password = req.body.password;
    }

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
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        role: updatedUser.role,
        token: req.headers.authorization.split(' ')[1],
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error saving updated user profile:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Duplicate value entered for a unique field.' });
      }
      res.status(500).json({ message: 'Server error during profile update' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const updateUserRoleByAdmin = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ['user', 'agent', 'admin'];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid or missing role provided. Allowed roles are: user, agent, admin.' });
  }

  try {
    const user = await User.findById(id);

    if (user) {

      user.role = role;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role,
        message: `User role updated to ${updatedUser.role} successfully.`,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user role by admin:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRoleByAdmin,
};