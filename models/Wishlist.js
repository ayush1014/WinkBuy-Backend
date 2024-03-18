// Wishlist.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Wishlist = db.define('Wishlist', {
  userId: {
    type: DataTypes.STRING,
    references: {
      model: 'Users', 
      key: 'username',
    },
  },
  
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products', 
      key: 'product_id', 
    },
  },
});

module.exports = Wishlist;
