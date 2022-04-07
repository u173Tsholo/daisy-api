const sequelize = require('sequelize');
const db = require('../config/database');
const { Sequelize } = require('sequelize');
const Role = require('./Role');

const User = db.define('users', {
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    phonenumber: { type: Sequelize.NUMBER },
    address: { type: Sequelize.STRING },
    postalcode: { type: Sequelize.NUMBER },
    password: { type: Sequelize.STRING },
    token: { type: Sequelize.STRING },
    roleid: { type: Sequelize.NUMBER },
    // updatedAt: { type: Sequelize.DATE },
    // createdAt: { type: Sequelize.DATE },
});

//User.hasMany(PuzzleRating);
//Role.belongsTo(User, {foreignKey: 'roleID'});

module.exports = User;