const amqp = require('amqplib');
const User = require('../models/user'); // Assuming users are stored in the database

const startConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost'); // Replace with your RabbitMQ server URL
        const channel = await connection.createChannel();
        await channel.assertQueue('event_notifications', { durable: true });

        console.log('Waiting for messages in the "event_notifications" queue...');

        channel.consume('event_notifications', async (msg) => {
            if (msg !== null) {
                const notification = JSON.parse(msg.content.toString());
                console.log('Received notification:', notification);

                // Fetch users with matching preferences
                const users = await User.findAll({
                    where: {
                        preferences: { [Op.contains]: [notification.categories] }, // Match user preferences
                    },
                });

                // Send notifications to users
                users.forEach((user) => {
                    console.log(`Sending notification to user: ${user.email}`);
                    // Here, you can integrate an email or SMS service to notify the user
                });

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error('Error in notification consumer:', error);
    }
};

startConsumer();
