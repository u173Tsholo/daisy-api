var Sequelize = require('sequelize');

module.exports = new Sequelize('d1agpnsfhevrrj', 'obcvtccxqxuqag', '52ca01c2c71849d9379a98d2d1a1e94fd13b5b36a414d7e7104d6185c8ce8a86', {
    host: 'ec2-44-194-4-127.compute-1.amazonaws.com',
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
