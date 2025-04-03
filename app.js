const express = require('express');
const app = express();
const eventRoutes = require('./routes/eventRoutes');

// Middleware to parse JSON
app.use(express.json());

// Register event routes
app.use('/api', eventRoutes);

// Default route for testing
app.get('/', (req, res) => {
    res.send('Event Locator API is running');
});

module.exports = app;
