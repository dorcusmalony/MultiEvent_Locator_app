const request = require('supertest');
const app = require('../app');
const Event = require('../models/event');

jest.mock('../models/event');

describe('Category Filtering', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        const sequelize = require('../config/database');
        await sequelize.close(); // Close the database connection
    });

    test('GET /api/events - should return all events when no category is specified', async () => {
        const mockEvents = [
            { id: 1, name: 'Music Concert', categories: 'Music' },
            { id: 2, name: 'Art Exhibition', categories: 'Art' },
        ];

        Event.findAll.mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
        expect(Event.findAll).toHaveBeenCalledWith({ where: {} });
    });

    test('GET /api/events - should filter events by category', async () => {
        const mockEvents = [
            { id: 1, name: 'Music Concert', categories: 'Music' },
        ];

        Event.findAll.mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events').query({ category: 'Music' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
        expect(Event.findAll).toHaveBeenCalledWith({ where: { categories: 'Music' } });
    });

    test('GET /api/events - should return an empty array if no events match the category', async () => {
        Event.findAll.mockResolvedValue([]);

        const response = await request(app).get('/api/events').query({ category: 'NonexistentCategory' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
        expect(Event.findAll).toHaveBeenCalledWith({ where: { categories: 'NonexistentCategory' } });
    });
});
