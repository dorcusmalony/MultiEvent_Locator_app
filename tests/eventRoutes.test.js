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

    test('POST /api/events - should create an event', async () => {
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
            { id: 1, name: 'Event 1', latitude: 12.34, longitude: 56.78, event_date: '2023-12-31T12:00:00Z', categories: 'Music' },
        ];

        // Mock the sequelize query method to return the mockEvents
        const mockQuery = jest.spyOn(Event.sequelize, 'query').mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events/search').query({
            latitude: 12.34,
            longitude: 56.78,
            radius: 1000,
        });

        expect(response.status).toBe(200); // Expect a 200 OK status
        expect(response.body).toEqual(mockEvents); // Expect the response body to match the mockEvents
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
                replacements: { latitude: 12.34, longitude: 56.78, radius: 1000 },
                type: Event.sequelize.QueryTypes.SELECT,
            }
        );

        mockQuery.mockRestore(); // Restore the original query method
    });
});