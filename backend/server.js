import express from 'express';
import {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.get('/dashboard-stats', protect, getDashboardStats);

export default router;