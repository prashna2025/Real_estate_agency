import express from 'express';
import { createReview, getPropertyReviews, deleteReview } from '../controllers/reviewController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:propertyId', getPropertyReviews);        // Public - get reviews for a property
router.post('/', protectUser, createReview);           // User - submit a review
router.delete('/:id', protectUser, deleteReview);      // User - delete own review

export default router;
