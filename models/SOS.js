const sequelize = require('sequelize');
const db = require('../config/database');
const { Sequelize } = require('sequelize');

const SOS = db.define('sosses', {
    userid: { type: Sequelize.NUMBER },
    rating: { type: Sequelize.NUMBER },
    service: { type: Sequelize.STRING }
});

module.exports = SOS;