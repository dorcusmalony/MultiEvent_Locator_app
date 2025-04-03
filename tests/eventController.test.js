const request = require('supertest');
const app = require('../app');
const Event = require('../models/event');

jest.mock('../models/event');

describe('Event Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        const sequelize = require('../config/database');
        await sequelize.close(); // Close the database connection
    });

    test('should create an event', async () => {
        const mockEvent = {
            id: 1,
            name: 'Test Event',
            description: 'Test Description',
            latitude: 12.345678,
            longitude: 98.765432,
            event_date: '2023-12-31T12:00:00Z',
            categories: 'Music',
        };

        Event.create.mockResolvedValue(mockEvent);

        const response = await request(app)
            .post('/api/events')
            .send({
                name: 'Test Event',
                description: 'Test Description',
                latitude: 12.345678,
                longitude: 98.765432,
                event_date: '2023-12-31T12:00:00Z',
                categories: 'Music',
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockEvent);
        expect(Event.create).toHaveBeenCalledWith({
            name: 'Test Event',
            description: 'Test Description',
            latitude: 12.345678,
            longitude: 98.765432,
            event_date: '2023-12-31T12:00:00Z',
            categories: 'Music',
        });
    });

    test('should get all events', async () => {
        const mockEvents = [
            { id: 1, name: 'Event 1', latitude: 12.34, longitude: 56.78, event_date: '2023-12-31T12:00:00Z', categories: 'Music' },
            { id: 2, name: 'Event 2', latitude: 98.76, longitude: 54.32, event_date: '2023-11-30T12:00:00Z', categories: 'Art' },
        ];

        Event.findAll.mockResolvedValue(mockEvents);

        const response = await request(app).get('/api/events');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
        expect(Event.findAll).toHaveBeenCalled();
    });

    test('should get an event by ID', async () => {
        const mockEvent = { id: 1, name: 'Event 1', latitude: 12.34, longitude: 56.78, event_date: '2023-12-31T12:00:00Z', categories: 'Music' };

        Event.findByPk.mockResolvedValue(mockEvent); // Mock the findByPk method to return the mockEvent

        const response = await request(app).get('/api/events/1'); // Simulate a GET request to fetch the event by ID

        expect(response.status).toBe(200); // Expect a 200 OK status
        expect(response.body).toEqual(mockEvent); // Expect the response body to match the mockEvent
        expect(Event.findByPk).toHaveBeenCalledWith(1); // Ensure findByPk is called with the correct ID as a numbers a number
    });

    test('should return 404 if event not found', async () => {
        Event.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/api/events/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Event not found' });
    });

    test('should update an event', async () => {
        const mockEvent = { id: 1, update: jest.fn() };
        const updatedData = { name: 'Updated Event' };

        Event.findByPk.mockResolvedValue(mockEvent);

        const response = await request(app)
            .put('/api/events/1')
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(mockEvent.update).toHaveBeenCalledWith(updatedData);
    });

    test('should delete an event', async () => {
        const mockEvent = { id: 1, destroy: jest.fn() };

        Event.findByPk.mockResolvedValue(mockEvent);

        const response = await request(app).delete('/api/events/1');

        expect(response.status).toBe(204);
        expect(mockEvent.destroy).toHaveBeenCalled();
    });
});
