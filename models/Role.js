const sequelize = require('sequelize');
const db = require('../config/database');
const { Sequelize } = require('sequelize');
const User = require('./User');

const Role = db.define('userroles', {
    role: { type: Sequelize.STRING }
});

//User.belongsTo(Role, {foreignKey: 'roleID'});

module.exports = Role;