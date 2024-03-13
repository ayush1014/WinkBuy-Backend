const {DataTypes, Sequelize} = require('sequelize');
const db = require('../config/db');

const Category = db.define('Category', {
    category_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },

    main_category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Category;