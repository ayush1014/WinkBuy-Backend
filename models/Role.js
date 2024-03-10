const {DataTypes, Sequelize} = require('sequelize');
const db = require('../config/db');

const Role = db.define('Role',{
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false
    },

})

module.exports = Role;
