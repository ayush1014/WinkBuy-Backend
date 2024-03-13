const { DataTypes, Sequelize } = require('sequelize');
const db = require('../config/db');


const BlogsMain = db.define('blogsMain', {
  blog: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  blogViews: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});


// BlogsCategory model
const BlogsCategory = db.define('blogs_category', {
  blog_category: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
});


BlogsCategory.hasMany(BlogsMain, {
  foreignKey: 'blog_category', 
  allowNull: false, 
  onDelete: 'CASCADE' 
});

BlogsMain.belongsTo(BlogsCategory, {
  foreignKey: 'blog_category', 
  as: 'main' 
});


// Blogs model
const Blogs = db.define('blogs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  blogName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  blogBody: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  blogPhotos: {
    type: DataTypes.TEXT,
  }
});

//association
BlogsMain.hasMany(Blogs, {
  foreignKey: 'blog', 
  allowNull: false, 
  onDelete: 'CASCADE' 
});

Blogs.belongsTo(BlogsMain, {
  foreignKey: 'blog', 
  as: 'main' 
});

module.exports = { Blogs, BlogsCategory, BlogsMain };
