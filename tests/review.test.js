const request = require('supertest');
const app = require('../app');
const Review = require('../models/review');
jest.mock('../models/review');

describe('Review Management', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should add a review', async () => {
        const mockReview = { id: 1, event_id: 1, user_id: 1, rating: 5, comment: 'Great event!' };
        Review.create.mockResolvedValue(mockReview);

        const response = await request(app)
            .post('/api/reviews')
            .send({ event_id: 1, user_id: 1, rating: 5, comment: 'Great event!' });

        expect(response.status).toBe(201);
        expect(response.body.review).toEqual(mockReview);
    });

    test('should get reviews for an event', async () => {
        const mockReviews = [
            { id: 1, event_id: 1, user_id: 1, rating: 5, comment: 'Great event!' },
        ];
        Review.findAll.mockResolvedValue(mockReviews);

        const response = await request(app).get('/api/reviews/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockReviews);
    });

    test('should update a review', async () => {
        const mockReview = { id: 1, update: jest.fn() };
        Review.findByPk.mockResolvedValue(mockReview);

        const response = await request(app)
            .put('/api/reviews/1')
            .send({ rating: 4, comment: 'Good event!' });

        expect(response.status).toBe(200);
        expect(mockReview.update).toHaveBeenCalledWith({ rating: 4, comment: 'Good event!' });
    });
});
