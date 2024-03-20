const Products = require('../models/Products');
const Category = require('../models/Category');
const MainCategory = require('../models/MainCategory');
const Wishlist = require('../models/Wishlist');

// Controller to add product to the wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const existingItem = await Wishlist.findOne({ where: { userId: userId, productId: productId } });
        if (existingItem) {
            return res.status(409).send({ message: 'Product is already in the wishlist' });
        }
        const wishlistItem = await Wishlist.create({ userId, productId });
        return res.status(201).send(wishlistItem);
    } catch (error) {
        console.error('Error adding to wishlist: ', error);
        return res.status(500).send({ message: 'Error adding to wishlist', error: error.message });
    }
};


// Controller to get the wishlist for a user
exports.getWishlistByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlistItems = await Wishlist.findAll({
            where: { userId },
            include: [{ model: Products }],
        });

        const products = wishlistItems.map((item) => item.Product);

        return res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching wishlist by user: ', error);
        return res.status(500).send({ message: 'Error fetching wishlist by user', error: error.message });
    }
};

// Controller to remove product from the wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const result = await Wishlist.destroy({
            where: { userId, productId },
        });

        if (result === 0) {
            return res.status(404).send({ message: 'Wishlist item not found' });
        }

        return res.status(200).send({ message: 'Product removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist: ', error);
        return res.status(500).send({ message: 'Error removing from wishlist', error: error.message });
    }
};


exports.viewCategoriesByMainCategory = async (req, res) => {
    try {
        const { main_category_name } = req.params;
        const categories = await Category.findAll({
            where: { main_category: main_category_name },
            order: [['category_number', 'ASC']]
        });

        if (categories) {
            return res.status(200).send(categories);
        } else {
            return res.status(404).send({ message: 'Main category not found or no categories under this main category' });
        }
    } catch (error) {
        console.error('Error fetching categories by main category:', error);
        return res.status(500).send({ message: 'Error fetching categories by main category', error: error.message });
    }
};


// Controller to get products by category
exports.viewProductsByCategory = async (req, res) => {
    try {
        const { category_name } = req.params;
        const products = await Products.findAll({
            where: { categoryId: category_name },
            include: [{
                model: Category,
                as: 'category',
            }],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products by category: ', error);
        return res.status(500).send({ message: 'Error fetching products by category', error: error.message });
    }
};

// Controller to get a single product by ID
exports.viewProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Products.findByPk(productId, {
            include: [{
                model: Category,
                as: 'category',
            }]
        });
        if (product) {
            return res.status(200).send(product);
        } else {
            return res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product: ', error);
        return res.status(500).send({ message: 'Error fetching product', error: error.message });
    }
};


// Controller to get all products
exports.viewAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 4; 
    const offset = (page - 1) * limit;

    try {
        const { count, rows: products } = await Products.findAndCountAll({
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalProducts: count,
            products,
        });
    } catch (error) {
        console.error('Error fetching all products: ', error);
        return res.status(500).send({ message: 'Error fetching all products', error: error.message });
    }
};
