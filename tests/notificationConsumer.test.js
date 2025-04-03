const redis = require('../config/redis');
const { Op } = require('sequelize');
const User = require('../models/user');
jest.mock('../models/user');

describe('Notification Consumer', () => {
    beforeAll(() => {
        redis.subscribe = jest.fn(); // Mock Redis subscribe
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

    test('should process real-time notifications', async () => {
        const mockUsers = [{ email: 'testuser@example.com', preferences: ['Music'] }];
        User.findAll.mockResolvedValue(mockUsers);

        // Simulate the Redis message event
        redis.on.mock.calls[0][1]('event_notifications', JSON.stringify({ eventId: 1, title: 'Test Event', categories: 'Music' }));

        expect(User.findAll).toHaveBeenCalledWith({
            where: { preferences: { [Op.contains]: ['Music'] } },
        });
        expect(console.log).toHaveBeenCalledWith('Sending notification to user: testuser@example.com');
    });
});
