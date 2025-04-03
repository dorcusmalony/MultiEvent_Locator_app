const redis = require('../config/redis'); // Import Redis configuration

const publishTestMessage = async () => {
    try {
        const message = {
            eventId: 1,
            title: 'Test Event',
            categories: 'Music',
        };
        await redis.publish('event_notifications', JSON.stringify(message));
        console.log('Test message published:', message);
    } catch (error) {
        console.error('Error publishing test message:', error);
    }
};

publishTestMessage();
