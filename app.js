const express = require('express');
const app = express();
const i18next = require('./config/i18n'); // Import i18n configuration
const middleware = require('i18next-http-middleware');
const eventRoutes = require('./routes/eventRoutes');

// Middleware to parse JSON
app.use(express.json());

// Add i18next middleware
app.use(middleware.handle(i18next));

// Register event routes
app.use('/api', eventRoutes);

// Default route for testing
app.get('/', (req, res) => {
    res.send(req.t('welcome')); // Use i18n translation
});

module.exports = app;
