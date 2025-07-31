// middleware/authMiddleware.js (with added console logs for debugging)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// Make sure to load environment variables if JWT_SECRET is here
// import dotenv from 'dotenv';
// dotenv.config();

const protect = async (req, res, next) => {
  let token;
  console.log('Protect middleware: Checking for Authorization header...');

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Protect middleware: Token found. Attempting to verify...');
      // console.log('Protect middleware: Token part (first 30 chars):', token.substring(0, 30) + '...'); // Uncomment for full token debugging

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Protect middleware: Token successfully decoded. Decoded ID:', decoded.id);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error('Protect middleware: User not found in DB for decoded ID:', decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('Protect middleware: User attached to req.user. User ID:', req.user._id, 'Role:', req.user.role);
      next(); // Proceed to the next middleware or route handler (e.g., admin middleware)
    } catch (error) {
      console.error('Protect middleware: Token verification error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('Protect middleware: No token provided in Authorization header.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`AuthorizeRoles middleware: Checking for roles: [${roles.join(', ')}]`);
    console.log('AuthorizeRoles middleware: Current req.user:', req.user ? { _id: req.user._id, role: req.user.role } : 'not available');

    if (!req.user || !roles.includes(req.user.role)) {
      const actualRole = req.user?.role || 'none';
      console.warn(`AuthorizeRoles middleware: Access denied. User role (${actualRole}) is not in allowed roles.`);
      return res.status(403).json({ message: `User role (${actualRole}) is not authorized to access this route` });
    }
    console.log('AuthorizeRoles middleware: User role is authorized. Proceeding.');
    next();
  };
};

const agent = (req, res, next) => {
  console.log('Agent middleware: Checking agent role...');
  console.log('Agent middleware: Current req.user:', req.user ? { _id: req.user._id, role: req.user.role } : 'not available');

  if (req.user && req.user.role === 'agent') {
    console.log('Agent middleware: User is an agent. Proceeding.');
    next();
  } else {
    console.warn('Agent middleware: Access denied. User is not an agent.');
    return res.status(403).json({ message: 'Not authorized as an agent' });
  }
};

const admin = (req, res, next) => {
  console.log('Admin middleware: Checking admin role...');
  console.log('Admin middleware: Current req.user:', req.user ? { _id: req.user._id, role: req.user.role } : 'not available');

  if (req.user && req.user.role === 'admin') {
    console.log('Admin middleware: User is an admin. Proceeding.');
    next();
  } else {
    console.warn('Admin middleware: Access denied. User is not an admin.');
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, authorizeRoles, agent, admin };