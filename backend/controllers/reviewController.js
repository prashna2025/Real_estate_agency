import Review from '../models/Review.js';
import Property from '../models/Property.js';

/**
 * @desc  Create or update a review for a property
 * @route POST /api/reviews
 * @access User (must be logged in)
 */
export const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    if (!propertyId || !rating || !comment) {
      return res.status(400).json({ message: 'Property, rating and comment are required.' });
    }

    // Upsert: update if user already reviewed this property
    const review = await Review.findOneAndUpdate(
      { user: req.user._id, property: propertyId },
      { rating: Number(rating), comment },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    // Recalculate avg rating on the property
    const stats = await Review.aggregate([
      { $match: { property: review.property } },
      { $group: { _id: '$property', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Property.findByIdAndUpdate(propertyId, {
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    }

    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc  Get all reviews for a property
 * @route GET /api/reviews/:propertyId
 * @access Public
 */
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc  Delete a review (user can delete their own)
 * @route DELETE /api/reviews/:id
 * @access User
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    // Recalculate avg rating
    const stats = await Review.aggregate([
      { $match: { property: review.property } },
      { $group: { _id: '$property', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
    ]);

    await Property.findByIdAndUpdate(review.property, {
      avgRating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      numReviews: stats.length > 0 ? stats[0].numReviews : 0,
    });

    res.json({ message: 'Review removed.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
