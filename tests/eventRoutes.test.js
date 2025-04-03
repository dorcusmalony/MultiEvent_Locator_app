const request = require('supertest');
const app = require('../app');
const Event = require('../models/event');

jest.mock('../models/event');

describe('Event Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        const sequelize = require('../config/database');
        await sequelize.close(); // Close the database connection
    });

    test('POST /api/events - should create an event with categories', async () => {
        const eventData = {
            name: 'Test Event',
            description: 'Test Description',
            latitude: 12.345678,
            longitude: 98.765432,
            event_date: '2023-12-31T12:00:00Z',
            categories: 'Music',
        };

        const mockEvent = { id: 1, ...eventData };
        Event.create.mockResolvedValue(mockEvent);

        const response = await request(app).post('/api/events').send(eventData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'Event created successfully',
            event: mockEvent,
        });
        expect(Event.create).toHaveBeenCalledWith({
            ...eventData,
            location: { type: 'Point', coordinates: [98.765432, 12.345678] },
        });
    });

    test('GET /api/events - should return all events', async () => {
        const mockEvents = [
            { id: 1, name: 'Event 1', categories: 'Music' },
            { id: 2, name: 'Event 2', categories: 'Art' },
        ];

        Event.findAll.mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
    });

    test('GET /api/events/:id - should return a single event', async () => {
        const mockEvent = { id: 1, name: 'Event 1', latitude: 12.34, longitude: 56.78, event_date: '2023-12-31T12:00:00Z', categories: 'Music' };

        Event.findByPk.mockResolvedValue(mockEvent);

        const response = await request(app).get('/api/events/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvent);
    });

    test('PUT /api/events/:id - should update an event', async () => {
        const mockEvent = { id: 1, update: jest.fn() };
        const updatedData = { name: 'Updated Event' };

        Event.findByPk.mockResolvedValue(mockEvent);

        const response = await request(app).put('/api/events/1').send(updatedData);

        expect(response.status).toBe(200);
        expect(mockEvent.update).toHaveBeenCalledWith(updatedData);
    });

    test('DELETE /api/events/:id - should delete an event', async () => {
        const mockEvent = { id: 1, destroy: jest.fn() };

        Event.findByPk.mockResolvedValue(mockEvent);

        const response = await request(app).delete('/api/events/1');

        expect(response.status).toBe(204);
        expect(mockEvent.destroy).toHaveBeenCalled();
    });

    test('GET /api/events/search - should return events within a radius', async () => {
        const mockEvents = [
            {
                id: 1,
                name: 'Music Concert',
                categories: 'Music',
                location: { type: 'Point', coordinates: [-74.006, 40.7128] },
            },
        ];

        Event.findAll.mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events/search').query({
            latitude: 40.7128,
            longitude: -74.006,
            radius: 1000,
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents); // Ensure mock data matches expected structure
    });

    test('GET /api/events - should filter events by category', async () => {
        const mockEvents = [{ id: 1, name: 'Music Concert', categories: 'Music' }];

        Event.findAll.mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events').query({ category: 'Music' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
        expect(Event.findAll).toHaveBeenCalledWith({ where: { categories: 'Music' } });
    });
});