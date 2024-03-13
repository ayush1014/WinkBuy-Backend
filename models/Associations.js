const Category = require('./Category');
const MainCategory = require('./MainCategory');
const Products = require('./Products');
const {Sequelize} = require('sequelize');


//Each product has one Category
Products.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
});

// Category has many Products
Category.hasMany(Products, {
    foreignKey: 'categoryId',
    as: 'products',
});

MainCategory.belongsTo(Category,{
    foreignKey: 'main_category',
    as: 'main',
});

MainCategory.hasMany(Category, {
    foreignKey: 'main_category',
    as: 'main_cat'
})

