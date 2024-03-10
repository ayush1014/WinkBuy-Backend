const Products = require('../models/Products');
const Category = require('../models/Category');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS SDK
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // From environment variables or config file
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // From environment variables or config file
  region: process.env.AWS_REGION // From environment variables or config file
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Set up multer-s3 upload
const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, // From environment variables or config file
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // Save file with timestamp prefix to avoid overwrites
      cb(null, `uploads/${Date.now().toString()}${path.extname(file.originalname)}`);
    }
  })
});


exports.addProduct = async (req, res) => {
    try {
        // Extract other product details from the request body
        const { product_name, product_Description, product_Price, rating, product_type, category_name } = req.body;

        // Find the category by its name or ID
        const category = await Category.findOne({ where: { name: category_name } });
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // req.file contains the uploaded file information including the S3 URL in req.file.location
        const product_pic = req.file.location;

        // Create a new product with the S3 image URL
        const newProduct = await Products.create({
            product_name,
            product_Description,
            product_Price,
            rating,
            product_pic,
            product_type,
            categoryId: category.name // Assuming your Category model's primary key is 'id'
        });

        return res.status(201).send({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product: ', error);
        return res.status(500).send({ message: 'Error adding product', error: error.message });
    }
};

exports.addCategory = async(req, res)=>{
    try {
        const { category_name } = req.body; 
        
        const categoryExists = await Category.findOne({ where: { category_name } });
        if (categoryExists) {
            return res.status(409).send({ message: 'Category already exists' });
        }

        const newCategory = await Category.create({ category_name });

        res.status(201).send({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).send({ message: 'Error creating category', error: error.message });
    }
}


