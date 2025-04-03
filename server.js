const express = require('express');
const sequelize = require('./config/database');
// const { connectRabbitMQ } = require('./config/rabbitmq'); // Remove RabbitMQ import
const app = require('./app'); // Ensure app is imported correctly

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        // await connectRabbitMQ(); // Remove RabbitMQ connection logic
    } catch (error) {
        console.error('Unable to connect to the database:', error); // Adjust error message
    }
    console.log(`Server is running on port ${PORT}`);
});