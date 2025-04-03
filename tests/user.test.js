const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
jest.mock('../models/user');

describe('User Management', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should register a new user', async () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'hashedpassword',
        };

        User.create.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.username).toBe('testuser');
    });

    test('should not register a user with duplicate username', async () => {
        User.findOne.mockResolvedValue({ username: 'duplicateuser' });

        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'duplicateuser',
                email: 'unique@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('username must be unique');
    });

    test('should log in a user with valid credentials', async () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'hashedpassword',
        };

        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.user).toHaveProperty('id');
    });

    test('should not log in a user with invalid credentials', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'invaliduser@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid password');
    });

    test('should log out a user', async () => {
        const response = await request(app).post('/api/users/logout');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
    });
});