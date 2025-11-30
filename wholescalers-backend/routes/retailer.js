const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const Order = require('../models/Order');

router.get('/overview', authenticate, authorize('retailer'), async (req, res) => {
    try {
        // 1. Calculate Total Orders and Total Spent using MongoDB Aggregation
        const totalStats = await Order.aggregate([
            { $match: { retailer: req.user._id } }, // Filter by current retailer
            { $group: {
                _id: null,
                totalOrders: { $sum: 1 },         // Count documents
                totalSpent: { $sum: "$total" }    // Sum the 'total' field
            }}
        ]);

        // 2. Calculate Pending Payments/Orders
        const pendingPaymentsCount = await Order.countDocuments({
            retailer: req.user._id,
            status: 'pending' // Use the status enum from your Order.js model
        });

        // 3. Get Recent Activity/Orders
        const recentOrders = await Order.find({ retailer: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
            
        // Extract stats, defaulting to zero if no orders are found
        const stats = totalStats.length > 0 ? totalStats[0] : { totalOrders: 0, totalSpent: 0 };
        
        // 4. Send the data using the exact keys the frontend expects
        res.json({
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent,
            pendingPayments: pendingPaymentsCount,
            recentOrders: recentOrders 
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;