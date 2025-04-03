const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true, // Ensure this matches the database schema
    },
}, {
    timestamps: true,
});

module.exports = Event;
