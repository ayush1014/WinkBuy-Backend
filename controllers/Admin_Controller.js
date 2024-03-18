const Products = require('../models/Products');
const Category = require('../models/Category');
const { upload, makePublicRead } = require('../config/multer');
const MainCategory = require('../models/MainCategory');
require('dotenv').config();

exports.addProduct = async (req, res) => {
  try {
    const { product_name, product_Description, product_Price, rating, rating_count, product_link, categoryId, product_photo_link, winkReviews } = req.body;

    const numericRating = parseFloat(rating);

    if (isNaN(numericRating)) {
      return res.status(400).send({ message: 'Invalid rating value' });
    }

  //   const numericRatingCount = parseInt(rating_count.replace(/,/g, ''), 10);

  // if (isNaN(numericRatingCount)) {
  //   return res.status(400).send({ message: 'Invalid rating_count value' });
  // }


    const category = await Category.findOne({ where: { category_name: categoryId } });
    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    let product_pic;
    if (req.file && req.file.location) {
      product_pic = req.file.location;
      await makePublicRead(process.env.AWS_BUCKET_NAME, req.file.key);

    } else if (product_photo_link) {
      product_pic = product_photo_link;
    } else {
      
      return res.status(400).send({ message: 'No photo provided' });
    }

    const newProduct = await Products.create({
      product_name,
      product_Description,
      winkReviews,
      product_Price,
      rating: numericRating,
      rating_count,
      // rating_count: numericRatingCount,
      product_pic,
      product_link,
      categoryId
    });

    return res.status(201).send({ message: 'Product added successfully', product: newProduct });
    
  } catch (error) {
    console.error('Error adding product: ', error);
    return res.status(500).send({ message: 'Error adding product', error: error.message });
  }
};


exports.addCategory = async (req, res) => {
  try {
    const { category_name, main_category, category_pic, category_number} = req.body;

    const categoryExists = await Category.findOne({ where: { category_name } });
    if (categoryExists) {
      return res.status(409).send({ message: 'Category already exists' });
    }

    const newCategory = await Category.create({ category_name, main_category, category_pic, category_number});

    res.status(201).send({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).send({ message: 'Error creating category', error: error.message });
  }
}

exports.addMainCategory = async(req, res) => {
  try {
    const { main_category } = req.body;

    const checkMainCategoryExists = await MainCategory.findOne({where: {main_category}});

    if (checkMainCategoryExists){
      return res.status(409).send({message: 'Main Category already exists'});
    }

    const newMainCategory = await MainCategory.create({main_category});
    res.status(201).send({message: 'Main Category created successfully', category: newMainCategory});
  } catch(error){
    res.status(500).send({ message: 'Error creating category', error: error.message});
  }
}

