const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // Import Passport configuration
const app = express();
const i18next = require('./config/i18n'); // Import i18n configuration
const middleware = require('i18next-http-middleware');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const reviewRoutes = require('./routes/reviewRoutes'); // Import review routes
const favoriteRoutes = require('./routes/favoriteRoutes'); // Import favorite routes

// Middleware to parse JSON
app.use(express.json());

// Add session middleware
app.use(
    session({
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Add i18next middleware
app.use(middleware.handle(i18next));

// Register event routes under the /api prefix
app.use('/api/events', eventRoutes);

// Register user routes under the /api prefix
app.use('/api/users', userRoutes);

// Register review routes under the /api prefix
app.use('/api/reviews', reviewRoutes);

// Register favorite routes under the /api prefix
app.use('/api/favorites', favoriteRoutes);

// Default route for testing
app.get('/', (req, res) => {
    res.json({
        message: req.t('welcome'), // Translated welcome message
        translations: {
            event_created: req.t('event_created'),
            event_not_found: req.t('event_not_found'),
            missing_fields: req.t('missing_fields'),
            categories_required: req.t('categories_required'),
        },
    });
});

module.exports = app;
