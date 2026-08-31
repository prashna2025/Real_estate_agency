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

/**
 * @desc   Get public agent profiles
 * @route  GET /api/admin/agents
 * @access Public
 */
export const getPublicAgents = async (_req, res) => {
  try {
    const agents = await Admin.find({ role: 'Agent' }, 'name bio isVerified rating reviews specialization photo phone').lean();
    res.json(agents.map(({ reviews, ...agent }) => ({
      ...agent,
      reviewsCount: reviews?.length || 0,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get all admins & agents (admin panel)
 * @route  GET /api/admin/team
 * @access Private/Admin
 */
export const getTeam = async (_req, res) => {
  try {
    const team = await Admin.find({}, '-password -reviews').sort({ role: 1, name: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create a new agent account
 * @route  POST /api/admin/team
 * @access Private/Admin
 */
export const createAgent = async (req, res) => {
  try {
    const { name, email, password, bio, phone, specialization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use.' });

    const agent = await Admin.create({ name, email, password, bio, phone, specialization, role: 'Agent' });
    res.status(201).json({ _id: agent._id, name: agent.name, email: agent.email, role: agent.role, specialization: agent.specialization });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Update an agent
 * @route  PUT /api/admin/team/:id
 * @access Private/Admin
 */
export const updateAgent = async (req, res) => {
  try {
    const { name, email, bio, phone, specialization, isVerified } = req.body;
    const agent = await Admin.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found.' });

    if (name) agent.name = name;
    if (email) agent.email = email;
    if (bio !== undefined) agent.bio = bio;
    if (phone !== undefined) agent.phone = phone;
    if (specialization !== undefined) agent.specialization = specialization;
    if (isVerified !== undefined) agent.isVerified = isVerified;

    await agent.save();
    res.json({ _id: agent._id, name: agent.name, email: agent.email, role: agent.role, bio: agent.bio, phone: agent.phone, specialization: agent.specialization, isVerified: agent.isVerified });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Delete an agent
 * @route  DELETE /api/admin/team/:id
 * @access Private/Admin
 */
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Admin.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found.' });
    if (agent.role === 'Admin') return res.status(403).json({ message: 'Cannot delete an Admin account.' });
    await agent.deleteOne();
    res.json({ message: 'Agent removed.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};