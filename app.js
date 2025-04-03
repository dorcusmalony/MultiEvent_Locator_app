const express = require('express');
const app = express();
const i18next = require('./config/i18n'); // Import i18n configuration
const middleware = require('i18next-http-middleware');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Middleware to parse JSON
app.use(express.json());

// Add i18next middleware
app.use(middleware.handle(i18next));

// Register event routes under the /api prefix
app.use('/api', eventRoutes);

// Register user routes
app.use('/api/users', userRoutes); // Ensure this is registered

// Default route for testing
app.get('/', (req, res) => {
    res.send(req.t('welcome')); // Use i18n translation
});

module.exports = app;
