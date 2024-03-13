const {DataTypes, Sequelize} = require('sequelize');
const db = require('../config/db');

const MainCategory = db.define('main_category', {
    main_category: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
});

module.exports = MainCategory;
