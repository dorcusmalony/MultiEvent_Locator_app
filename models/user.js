const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensure email is valid
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOGRAPHY('POINT', 4326), // Use GEOGRAPHY to match the database schema
    allowNull: false,
    validate: {
      isValidPoint(value) {
        if (!value || value.type !== 'Point' || !Array.isArray(value.coordinates) || value.coordinates.length !== 2) {
          throw new Error('Invalid location format');
        }
      },
    },
  },
  preferences: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Store preferences as an array of strings
    allowNull: false,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Preferences must be an array of strings');
        }
      },
    },
  },
}, {
  timestamps: true,
});

module.exports = User;