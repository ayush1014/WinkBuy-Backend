const {DataTypes, Sequelize} = require('sequelize');
const db = require('../config/db');

const Products = db.define('Products',{
    product_id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },

    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    product_Description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    product_Price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    rating_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    product_pic: {
        type: DataTypes.STRING
    },

    product_link: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Categories', // This is a reference to another model
            key: 'category_name', // This is the column name of the referenced model
        },
    },
})

module.exports = Products;