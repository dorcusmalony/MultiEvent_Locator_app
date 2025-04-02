const request = require('supertest');
const express = require('express');
const sequelize = require('../config/database');
const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes); // Ensure correct prefix

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before tests
});

describe('User Management', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register') // Corrected route
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        location: { type: 'Point', coordinates: [40.7128, -74.0060] },
        preferences: ['music', 'sports'],
      });
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.username).toBe('testuser');
  });

  it('should not register a user with duplicate username', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'duplicateuser',
        email: 'unique@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'duplicateuser',
        email: 'anotherunique@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('username must be unique');
  });

  it('should not register a user with duplicate email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'uniqueuser',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'anotheruniqueuser',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('email must be unique');
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'loginuser',
        email: 'loginuser@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/users/login') // Corrected route
      .send({
        email: 'loginuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'loginuser@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });

  it('should not login a non-existent user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should update user location and preferences', async () => {
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: 'updateuser',
        email: 'updateuser@example.com',
        password: 'password123',
      });

    const userId = registerResponse.body.user.id;

    const updateResponse = await request(app)
      .put(`/api/users/${userId}`) // Corrected route
      .send({
        location: { type: 'Point', coordinates: [34.0522, -118.2437] },
        preferences: ['art', 'technology'],
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.user.location.coordinates).toEqual([34.0522, -118.2437]);
    expect(updateResponse.body.user.preferences).toEqual(['art', 'technology']);
  });
});