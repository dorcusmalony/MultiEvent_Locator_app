const redis = require('../config/redis'); // Import Redis configuration

const scheduleNotification = async (eventId, notification, timestamp) => {
    try {
        await redis.zadd('scheduled_notifications', timestamp, JSON.stringify({ eventId, notification }));
        console.log('Notification scheduled:', notification);
    } catch (error) {
        console.error('Error scheduling notification:', error);
    }
};

module.exports = { scheduleNotification };