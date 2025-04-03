const redis = require('../config/redis');
const { Op } = require('sequelize');
const User = require('../models/user');
const { scheduleNotification } = require('../utils/scheduler');
const { publishMessage } = require('../utils/publisher');
jest.mock('../models/user');

describe('Notification System (Queuing)', () => {
    beforeAll(() => {
        redis.publish = jest.fn(); // Mock Redis publish
        redis.zadd = jest.fn(); // Mock Redis zadd
        redis.zrangebyscore = jest.fn(); // Mock Redis zrangebyscore
        redis.zrem = jest.fn(); // Mock Redis zrem
        redis.on = jest.fn((event, callback) => {
            if (event === 'message') {
                callback('event_notifications', JSON.stringify({ eventId: 1, title: 'Test Event', categories: 'Music' }));
            }
        });
        console.log = jest.fn(); // Mock console.log
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should process real-time notifications via Redis Pub/Sub', async () => {
        const mockUsers = [{ email: 'testuser@example.com', preferences: ['Music'] }];
        User.findAll.mockResolvedValue(mockUsers);

        // Simulate the Redis message event
        redis.on.mock.calls[0][1]('event_notifications', JSON.stringify({ eventId: 1, title: 'Test Event', categories: 'Music' }));

        expect(User.findAll).toHaveBeenCalledWith({
            where: { preferences: { [Op.contains]: ['Music'] } },
        });
        expect(console.log).toHaveBeenCalledWith('Sending notification to user: testuser@example.com');
    });

    test('should schedule a delayed notification in Redis Sorted Set', async () => {
        const notification = {
            eventId: 2,
            notification: {
                title: 'Delayed Event',
                categories: 'Art',
            },
        };
        const futureTimestamp = Date.now() + 60000; // 1 minute from now

        await scheduleNotification(notification.eventId, notification.notification, futureTimestamp);

        expect(redis.zadd).toHaveBeenCalledWith(
            'scheduled_notifications',
            futureTimestamp,
            JSON.stringify(notification)
        );
        expect(console.log).toHaveBeenCalledWith('Notification scheduled:', notification.notification);
    });

    test('should process delayed notifications from Redis Sorted Set', async () => {
        const now = Date.now();
        const mockNotifications = [
            JSON.stringify({
                eventId: 3,
                notification: { title: 'Scheduled Event', categories: 'Sports' },
            }),
        ];
        redis.zrangebyscore.mockResolvedValue(mockNotifications);

        const processScheduledNotifications = async () => {
            const notifications = await redis.zrangebyscore('scheduled_notifications', 0, now);

            notifications.forEach(async (notification) => {
                const parsedNotification = JSON.parse(notification);
                console.log('Processing notification:', parsedNotification);

                // Publish the notification
                await redis.publish('event_notifications', JSON.stringify(parsedNotification.notification));

                // Remove the notification from the sorted set
                await redis.zrem('scheduled_notifications', notification);
            });
        };

        await processScheduledNotifications();

        expect(redis.zrangebyscore).toHaveBeenCalledWith('scheduled_notifications', 0, now);
        expect(redis.publish).toHaveBeenCalledWith(
            'event_notifications',
            JSON.stringify({ title: 'Scheduled Event', categories: 'Sports' })
        );
        expect(redis.zrem).toHaveBeenCalledWith('scheduled_notifications', mockNotifications[0]);
        expect(console.log).toHaveBeenCalledWith(
            'Processing notification:',
            JSON.parse(mockNotifications[0])
        );
    });
});
