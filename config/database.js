var Sequelize = require('sequelize');

module.exports = new Sequelize('a', 'b', 'c', {
    host: 'ec2-52-86-56-90.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    ssl:true,
    dialectOptions:
        { ssl: {require:true, rejectUnauthorized: false }},
    
    define: {
          timestamps: false
      },

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }

  });