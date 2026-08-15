import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'User belonging to this token no longer exists' });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Role-based authorization guard (prepared for Phase 2 Agent roles)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: `Role (${req.admin.role}) is not authorized to access this route`,
      });
    }
    next();
  };
};