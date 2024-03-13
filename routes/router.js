const express = require('express');
const router = express.Router(); 
const Authentication = require('../controllers/Auth_Controller');
const Admin = require('../controllers/Admin_Controller');
const User = require('../controllers/User_Controller');
const {upload,makePublicRead} = require('../config/multer');
const {adminControllers, userControllers} = require('../controllers/Blogs_Controller');


//Authentication
router.post('/signup', Authentication.Signup);
router.post('/login', Authentication.Login);
router.post('/adminSignup', Authentication.AdminSignup);
router.post('/adminLogin', Authentication.AdminLogin);

//admin routers
router.post('/addCategory', Admin.addCategory);
router.post('/addMainCategory', Admin.addMainCategory);
router.post('/addProduct', upload.single('product_pic'), Admin.addProduct);

//user routers
router.get('/products/category/:category_name', User.viewProductsByCategory);
router.get('/products/:productId', User.viewProductById);

//Admin Blog routers
router.post('/admin/addBlogCategory', adminControllers.createCategory);
router.post('/admin/blogs', upload.any(), adminControllers.createBlog);
router.get('/admin/blogs', adminControllers.getAllBlogs);
router.put('/admin/blogs/:id', adminControllers.updateBlog);
router.delete('/admin/blogs/:id', adminControllers.deleteBlog);
router.delete('/admin/mainblogs/:blog', adminControllers.deleteMainBlog);

//User Blog routers
router.get('/blogs/:blogTitle', userControllers.getBlog);
router.get('/blogs', userControllers.getAllBlogs);
router.get('/blogsByCategory/:category', userControllers.getBlogsByCategory);
module.exports = router; 
