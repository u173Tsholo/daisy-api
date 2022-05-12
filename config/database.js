var Sequelize = require('sequelize');

module.exports = new Sequelize('d68p1ebbpqu54o', 'pulnpqwjllyzyd', '97669e45006d5374bdc7659afbc5831f559d0bd53436fe3d622a412da4c6d815', {
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