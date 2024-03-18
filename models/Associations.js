const Category = require('./Category');
const MainCategory = require('./MainCategory');
const Products = require('./Products');
const User = require('../models/User')
const Wishlist = require('../models/Wishlist');
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
    as: 'mainCategory',
});

MainCategory.hasMany(Category, {
    foreignKey: 'main_category',
    as: 'categories'
})

User.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

Products.hasMany(Wishlist, { foreignKey: 'productId' });
Wishlist.belongsTo(Products, { foreignKey: 'productId' });