const sequelize = require('./database');
const User = require('../models/user');
const Event = require('../models/event');

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

syncDatabase();