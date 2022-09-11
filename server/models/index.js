const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    refreshToken: {
        type: DataTypes.TEXT
    }
})

const Plan = sequelize.define('plan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateStart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dateEnd: {
        type: DataTypes.DATE,
        allowNull: false
    },
    plan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fact: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

// sequelize.sync({alter: true})

module.exports = {
    User,
    Plan
}
