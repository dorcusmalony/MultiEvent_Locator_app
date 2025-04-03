const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost'); // Replace with your RabbitMQ server URL
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
};

const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized. Call connectRabbitMQ first.');
    }
    return channel;
};

module.exports = { connectRabbitMQ, getChannel };
