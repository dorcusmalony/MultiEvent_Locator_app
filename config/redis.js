const Redis = require('ioredis'); // Install ioredis if not already installed: npm install ioredis

// Create a Redis client
const redis = new Redis();

module.exports = redis;
