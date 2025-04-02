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
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true,
    validate: {
      isValidPoint(value) {
        if (value && (!value.coordinates || value.type !== 'Point')) {
          throw new Error('Invalid location format');
        }
      },
    },
  },
  preferences: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    validate: {
      isArray(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('Preferences must be an array of strings');
        }
      },
    },
  },
}, {
  timestamps: true,
});

module.exports = User;