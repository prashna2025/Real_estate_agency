import express from 'express';
import {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getPublicAgents,
  getTeam,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { initPayment, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/agents', getPublicAgents);        // Public - list agents on website
router.get('/profile', protect, getAdminProfile);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/team', protect, getTeam);         // Admin - full team list
router.post('/team', protect, createAgent);    // Admin - create agent
router.put('/team/:id', protect, updateAgent); // Admin - update agent
router.delete('/team/:id', protect, deleteAgent); // Admin - delete agent
router.post('/payments/init', protect, initPayment);
router.post('/payments/verify', protect, verifyPayment);

export default router;