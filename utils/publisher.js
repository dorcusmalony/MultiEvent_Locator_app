const redis = require('../config/redis'); // Import Redis configuration

const publishMessage = async (channel, message) => {
    try {
        await redis.publish(channel, JSON.stringify(message));
        console.log(`Message published to channel "${channel}":`, message);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
};

module.exports = { publishMessage };