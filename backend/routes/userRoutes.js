import express from 'express';
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);

export default router;