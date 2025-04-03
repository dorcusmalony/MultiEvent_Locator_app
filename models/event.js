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
    location: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: false,
    },
    event_date: { // Change "date" to "event_date"
        type: DataTypes.DATE,
        allowNull: false,
    },
    categories: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Event;
