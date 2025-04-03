const redis = require('../config/redis'); // Import Redis configuration

const scheduleTestNotification = async () => {
    try {
        const notification = {
            eventId: 2,
            notification: {
                title: 'Delayed Event',
                categories: 'Art',
            },
        };
        const futureTimestamp = Date.now() + 60000; // 1 minute from now
        await redis.zadd('scheduled_notifications', futureTimestamp, JSON.stringify(notification));
        console.log('Test notification scheduled:', notification);
    } catch (error) {
        console.error('Error scheduling test notification:', error);
    }
};

scheduleTestNotification();
