const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Event = require('../models/event');
const User = require('../models/user');

describe('Location-Based Search with Users', () => {
    beforeAll(async () => {
        // Synchronize the database
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Close the database connection
        await sequelize.close();
    });

    test('Create a user and associate events', async () => {
        // Create a user
        const userResponse = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                location: { type: 'Point', coordinates: [40.7128, -74.0060] },
                preferences: ['Music', 'Sports'],
            });

        expect(userResponse.status).toBe(201);
        expect(userResponse.body.user).toHaveProperty('id');
        const userId = userResponse.body.user.id;

        // Create events associated with the user's location
        const event1 = await Event.create({
            name: 'Music Concert',
            description: 'A live music concert featuring top artists.',
            latitude: 40.73061,
            longitude: -73.935242,
            event_date: '2025-04-15T19:00:00.000Z',
            categories: 'Music',
            location: sequelize.literal(`ST_SetSRID(ST_MakePoint(-73.935242, 40.73061), 4326)`),
        });

        const event2 = await Event.create({
            name: 'Football Competition',
            description: 'High school football competition with awards.',
            latitude: 40.73061,
            longitude: -73.935242,
            event_date: '2025-05-01T19:00:00.000Z',
            categories: 'Sports',
            location: sequelize.literal(`ST_SetSRID(ST_MakePoint(-73.935242, 40.73061), 4326)`),
        });

        expect(event1).toHaveProperty('id');
        expect(event2).toHaveProperty('id');
    });

    test('Search for events within a radius of the user\'s location', async () => {
        const response = await request(app)
            .get('/api/events/search')
            .query({
                latitude: 40.7128,
                longitude: -74.0060,
                radius: 5000, // 5 km radius
            });

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Music Concert',
                    categories: 'Music',
                }),
                expect.objectContaining({
                    name: 'Football Competition',
                    categories: 'Sports',
                }),
            ])
        );
    });
});
