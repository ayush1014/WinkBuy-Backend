const Products = require('../models/Products');
const Category = require('../models/Category');

// Controller to get products by category
exports.viewProductsByCategory = async (req, res) => {
    try {
        const { category_name } = req.params; // Assuming you're passing the category ID in the route parameter
        const products = await Products.findAll({
            where: { categoryId: category_name },
            include: [{
                model: Category,
                as: 'category',
            }]
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
        const { productId } = req.params; // Assuming you're passing the product ID in the route parameter
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