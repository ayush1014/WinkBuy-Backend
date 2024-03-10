const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/db')

const User = db.define('User', {
    username : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey: true
    },

    fullname : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password : {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
      
});


module.exports = User;