import express from 'express';
import {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { initPayment, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.get('/dashboard-stats', protect, getDashboardStats);
router.post('/payments/init', protect, initPayment);
router.post('/payments/verify', protect, verifyPayment);

export default router;