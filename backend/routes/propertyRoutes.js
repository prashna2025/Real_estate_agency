import express from 'express';
import {
  getProperties,
  getFeaturedProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFeatured,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:slug', getPropertyBySlug);

// Protected Admin routes
router.post('/', protect, upload.array('images', 10), createProperty);
router.put('/:id', protect, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, deleteProperty);
router.patch('/:id/featured', protect, toggleFeatured);

export default router;