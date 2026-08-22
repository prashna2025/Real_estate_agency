import Admin from '../models/Admin.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import jwt from 'jsonwebtoken';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc   Auth admin & get token
 * @route  POST /api/admin/login
 * @access Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get current admin profile
 * @route  GET /api/admin/profile
 * @access Private/Admin
 */
export const getAdminProfile = async (req, res) => {
  res.json(req.admin);
};

/**
 * @desc   Get real-time dashboard analytics & metric counts
 * @route  GET /api/admin/dashboard-stats
 * @access Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProperties,
      totalInquiries,
      featuredProperties,
      availableCount,
      soldCount,
      rentedCount,
      recentInquiries,
    ] = await Promise.all([
      Property.countDocuments(),
      Inquiry.countDocuments({ status: { $ne: 'Resolved' } }),
      Property.countDocuments({ isFeatured: true }),
      Property.countDocuments({ status: 'Available' }),
      Property.countDocuments({ status: 'Sold' }),
      Property.countDocuments({ status: 'Rented' }),
      Inquiry.find()
        .populate('propertyId', 'title slug')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      totalProperties,
      totalInquiries,
      featuredProperties,
      breakdown: {
        available: availableCount,
        sold: soldCount,
        rented: rentedCount,
      },
      recentInquiries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};