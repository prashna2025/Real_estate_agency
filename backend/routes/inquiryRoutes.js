import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, getInquiries);
router.patch('/:id/status', protect, updateInquiryStatus);

export default router;