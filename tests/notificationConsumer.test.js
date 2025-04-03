const redis = require('../config/redis');
const { Op } = require('sequelize');
const User = require('../models/user');
jest.mock('../models/user');

describe('Notification Consumer', () => {
    beforeAll(() => {
        redis.publish = jest.fn(); // Mock Redis publish
        console.log = jest.fn(); // Mock console.log
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should process real-time notifications', async () => {
        const mockUsers = [{ email: 'testuser@example.com', preferences: ['Music'] }];
        User.findAll.mockResolvedValue(mockUsers);

        const message = JSON.stringify({ eventId: 1, title: 'Test Event', categories: 'Music' });
        redis.emit('message', 'event_notifications', message);

        expect(User.findAll).toHaveBeenCalledWith({
            where: { preferences: { [Op.contains]: ['Music'] } },
        });
        expect(console.log).toHaveBeenCalledWith('Sending notification to user: testuser@example.com');
    });
});
