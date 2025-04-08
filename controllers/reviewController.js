const Review = require('../models/review');

// Add a review for an event
exports.addReview = async (req, res) => {
    try {
        const { event_id, user_id, rating, comment } = req.body;

        if (!event_id || !user_id || !rating) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const review = await Review.create({ event_id, user_id, rating, comment });
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get reviews for an event
exports.getReviews = async (req, res) => {
    try {
        const { event_id } = req.params;

        const reviews = await Review.findAll({ where: { event_id } });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await review.update({ rating, comment });
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
