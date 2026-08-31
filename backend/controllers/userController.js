import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('favorites');
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, favorites: user.favorites, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { propertyId } = req.body;
    
    if (user.favorites.includes(propertyId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    } else {
      user.favorites.push(propertyId);
    }
    
    await user.save();
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name?.trim() || !normalizedEmail) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const emailInUse = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
    if (emailInUse) return res.status(400).json({ message: 'Email is already in use' });

    const user = await User.findById(req.user._id);
    user.name = name.trim();
    user.email = normalizedEmail;
    await user.save();
    await user.populate('favorites');
    res.json({ _id: user._id, name: user.name, email: user.email, favorites: user.favorites });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};