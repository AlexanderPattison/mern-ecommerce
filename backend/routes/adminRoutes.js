const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

// Get admin dashboard stats
router.get('/dashboard-stats', protect, admin, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();

        // Calculate total revenue from completed orders
        const revenueData = await Order.aggregate([
            { $match: { isPaid: true } }, // Only consider paid orders
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    // If you need to calculate revenue for a specific time period, add a date filter here
                }
            }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        const salesOverTime = await Order.aggregate([
            { $match: { isPaid: true } }, // Only consider paid orders
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }, // Group by paid date
                    total: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 } // Last 30 days
        ]);

        res.json({
            products: productCount,
            orders: orderCount,
            users: userCount,
            revenue: totalRevenue,
            salesOverTime: salesOverTime.map(item => ({ date: item._id, total: item.total }))
        });
    } catch (error) {
        console.error('Error in dashboard stats:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get recent activity
router.get('/recent-activity', protect, admin, async (req, res) => {
    try {
        const recentActivity = await Activity.find().sort('-date').limit(10);
        res.json(recentActivity);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get all products (admin)
router.get('/products', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({}).select('name price category countInStock');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Create a product (admin)
router.post('/products', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, category, countInStock } = req.body;
        const product = new Product({
            name,
            price,
            description,
            category,
            countInStock,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });
        const createdProduct = await product.save();

        // Log activity
        const newActivity = new Activity({
            type: 'PRODUCT',
            description: `New product created: ${product.name}`,
            product: product._id
        });
        await newActivity.save();

        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
});

// Update a product (admin)
router.put('/products/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.description = req.body.description || product.description;
            product.category = req.body.category || product.category;
            product.countInStock = req.body.countInStock || product.countInStock;
            if (req.file) {
                product.image = `/uploads/${req.file.filename}`;
            }
            const updatedProduct = await product.save();

            // Log activity
            const newActivity = new Activity({
                type: 'PRODUCT',
                description: `Product updated: ${product.name}`,
                product: product._id
            });
            await newActivity.save();

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
});

// Delete a product (admin)
router.delete('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();

            // Log activity
            const newActivity = new Activity({
                type: 'PRODUCT',
                description: `Product deleted: ${product.name}`,
                product: product._id
            });
            await newActivity.save();

            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Bulk delete products (admin)
router.post('/products/bulk-delete', protect, admin, async (req, res) => {
    try {
        const { productIds } = req.body;
        await Product.deleteMany({ _id: { $in: productIds } });

        // Log activity
        const newActivity = new Activity({
            type: 'PRODUCT',
            description: `Bulk delete: ${productIds.length} products removed`,
        });
        await newActivity.save();

        res.json({ message: 'Products deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get all orders (admin)
router.get('/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Update order to delivered (admin)
router.put('/orders/:id/deliver', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();

            // Log activity
            const newActivity = new Activity({
                type: 'ORDER',
                description: `Order marked as delivered: ${order._id}`,
                order: order._id
            });
            await newActivity.save();

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get all users (admin)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Delete user (admin)
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();

            // Log activity
            const newActivity = new Activity({
                type: 'USER',
                description: `User deleted: ${user.name}`,
                user: user._id
            });
            await newActivity.save();

            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;