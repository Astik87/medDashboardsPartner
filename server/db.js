const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: "mysql",
        host: process.env.DB_HOST,
        dialectOptions: {
            useUTC: false,
            dateStrings: true,
            typeCast: function (field, next) {
                if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
                    return new Date(field.string());
                }
                return next();
            }
        },
        timezone: '+03:00'
    }
);
