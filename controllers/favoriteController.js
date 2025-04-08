const Favorite = require('../models/favorite');

// Add an event to favorites
exports.addFavorite = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        if (!user_id || !event_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const favorite = await Favorite.create({ user_id, event_id });
        res.status(201).json({ message: 'Event added to favorites', favorite });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get favorite events for a user
exports.getFavorites = async (req, res) => {
    try {
        const { user_id } = req.params;

        const favorites = await Favorite.findAll({ where: { user_id } });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an event from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        const favorite = await Favorite.findByPk(id);
        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        await favorite.destroy();
        res.status(200).json({ message: 'Event removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
