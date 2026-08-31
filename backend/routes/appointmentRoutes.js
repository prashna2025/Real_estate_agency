import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getMyAppointments,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createAppointment);                              // Public - book a visit
router.get('/', protect, getAppointments);                        // Admin - view all
router.patch('/:id/status', protect, updateAppointmentStatus);   // Admin - update status
router.get('/mine', protectUser, getMyAppointments);             // User - my appointments
router.patch('/:id/cancel', protectUser, cancelAppointment);     // User - cancel

export default router;
