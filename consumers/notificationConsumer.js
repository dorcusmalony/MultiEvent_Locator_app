const redis = require('../config/redis'); // Import Redis configuration
const Redis = require('ioredis'); // Import Redis library
const User = require('../models/user'); // Assuming users are stored in the database
const { Op } = require('sequelize'); // Import Sequelize operators

const subscriber = new Redis(); // Create a separate Redis client for subscribing

const startConsumer = async () => {
    try {
        console.log('Waiting for messages in the "event_notifications" channel...');

        // Subscribe to the Redis channel
        await subscriber.subscribe('event_notifications');

        // Handle incoming messages
        subscriber.on('message', async (channel, message) => {
            const notification = JSON.parse(message);
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
        });
    } catch (error) {
        console.error('Error in notification consumer:', error);
    }
};

startConsumer();

const processScheduledNotifications = async () => {
    const now = Date.now();
    try {
        const notifications = await redis.zrangebyscore('scheduled_notifications', 0, now);

        notifications.forEach(async (notification) => {
            const parsedNotification = JSON.parse(notification);
            console.log('Processing notification:', parsedNotification);

            // Publish the notification
            await redis.publish('event_notifications', JSON.stringify(parsedNotification.notification));

            // Remove the notification from the sorted set
            await redis.zrem('scheduled_notifications', notification);
        });
    } catch (error) {
        console.error('Error processing scheduled notifications:', error);
    }
};

// Run the worker periodically
setInterval(processScheduledNotifications, 60000); // Check every minute