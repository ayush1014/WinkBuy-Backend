const {DataTypes, Sequelize} = require('sequelize');
const db = require('../config/db');

const Category = db.define('Category', {
    category_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
});

module.exports = Category;