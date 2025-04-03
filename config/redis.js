const Redis = require('ioredis'); // Install ioredis if not already installed: npm install ioredis

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // Uncomment the next line if a password is required
  // password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
