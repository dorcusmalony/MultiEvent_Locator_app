const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT', 4326),
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  categories: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  timestamps: true,
  getterMethods: {
    googleMapsUrl() {
      return `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
    },
  },
});

module.exports = Event;
