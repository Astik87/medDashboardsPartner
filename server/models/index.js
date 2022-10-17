const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

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

const Wave = sequelize.define('wave', {
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
    visitPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    eventPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    longReadPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Plan.hasOne(Wave, {as: 'visitPlan', foreignKey: 'id'})
Wave.belongsTo(Plan, {as: 'visitPlan', foreignKey: 'visitPlanId'})

Plan.hasOne(Wave, {as: 'eventPlan', foreignKey: 'id'})
Wave.belongsTo(Plan, {as: 'eventPlan', foreignKey: 'eventPlanId'})

Plan.hasOne(Wave, {as: 'longReadPlan', foreignKey: 'id'})
Wave.belongsTo(Plan, {as: 'longReadPlan', foreignKey: 'longReadPlanId'})

// sequelize.sync({alter: true})

const createUser = async () => {
    return await User.create({
        name: 'admin',
        login: 'admin',
        passwordHash: await bcrypt.hash('123456', 3),
        isAdmin: 1,
        refreshToken: ''
    })
}

// createUser()

module.exports = {
    User,
    Plan,
    Wave
}
