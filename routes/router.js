const express = require('express');
const router = express.Router(); 
const Authentication = require('../controllers/Auth_Controller');
const Admin = require('../controllers/Admin_Controller');
const User = require('../controllers/User_Controller');
const {upload,makePublicRead} = require('../config/multer')


//Authentication
router.post('/signup', Authentication.Signup);
router.post('/login', Authentication.Login);
router.post('/adminSignup', Authentication.AdminSignup);
router.post('/adminLogin', Authentication.AdminLogin);

//admin routers
router.post('/addCategory', Admin.addCategory);
router.post('/addProduct', upload.single('product_pic'), Admin.addProduct);

//user routers
router.get('/products/category/:category_name', User.viewProductsByCategory);
router.get('/products/:productId', User.viewProductById);


module.exports = router; 
