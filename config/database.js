const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('event_locator', 'postgres', 'MosesAlier2023', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;