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
        expect(response.body).toEqual(mockEvent);
        expect(Event.create).toHaveBeenCalledWith({
            ...eventData,
            location: sequelize.literal(`ST_SetSRID(ST_MakePoint(98.765432, 12.345678), 4326)`),
        });
    });

    test('GET /api/events - should return all events', async () => {
        const mockEvents = [
            { id: 1, name: 'Event 1', latitude: 12.34, longitude: 56.78, event_date: '2023-12-31T12:00:00Z', categories: 'Music' },
            { id: 2, name: 'Event 2', latitude: 98.76, longitude: 54.32, event_date: '2023-11-30T12:00:00Z', categories: 'Art' },
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
                name: 'Event 1',
                latitude: 40.7128,
                longitude: -74.0060,
                event_date: '2023-12-31T18:00:00Z',
                categories: 'Music',
                location: {
                    type: 'Point',
                    coordinates: [-74.0060, 40.7128],
                },
            },
        ];

        const mockQuery = jest.spyOn(Event.sequelize, 'query').mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events/search').query({
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 1000,
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
        expect(mockQuery).toHaveBeenCalledWith(
            `
            SELECT * FROM events
            WHERE ST_DWithin(
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
                :radius
            )
            `,
            {
                replacements: { latitude: 40.7128, longitude: -74.0060, radius: 1000 },
                type: Event.sequelize.QueryTypes.SELECT,
            }
        );

        mockQuery.mockRestore();
    });

    test('GET /api/events - should filter events by category', async () => {
        const mockEvents = [
            { id: 1, name: 'Music Concert', categories: 'Music' },
            { id: 2, name: 'Art Exhibition', categories: 'Art' },
        ];

        Event.findAll.mockResolvedValue([mockEvents[0]]); // Return only the "Music" event

        const response = await request(app).get('/api/events').query({ category: 'Music' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockEvents[0]]);
        expect(Event.findAll).toHaveBeenCalledWith({ where: { categories: 'Music' } });
    });
});