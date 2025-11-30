const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

router.get('/overview', authenticate, authorize('wholesaler'), async (req, res) => {
  try {
    const wholesalerId = req.user._id;
    const lowStockThreshold = 15; 

    const [
      totalOrders,
      pending,
      revenueResult,
      totalCustomers,
      lowStockProducts
    ] = await Promise.all([
      
      Order.countDocuments({ wholesaler: wholesalerId }),
      
      Order.countDocuments({ wholesaler: wholesalerId, status: 'pending' }),
      
      Order.aggregate([
        { $match: { wholesaler: wholesalerId, status: { $in: ['delivered', 'shipped'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
      ]),
      
      Order.distinct('retailer', { wholesaler: wholesalerId }),
      
      Product.find({ 
        wholesaler: wholesalerId, 
        stock: { $lte: lowStockThreshold } 
      }).select('name stock').lean()
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalOrders,
      pendingOrders: pending,
      totalRevenue,
      totalCustomers: totalCustomers.length,
      lowStockProducts
    });

  } catch (err) {
    console.error("Error fetching dashboard overview:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;