const {DataTypes, Sequelize} = require('sequelize');
const db = require('../config/db');

const Category = db.define('Category', {
    category_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },

    category_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    category_pic: {
        type: DataTypes.STRING,
        allowNull: false
    },

    main_category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Category;