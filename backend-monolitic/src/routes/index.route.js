const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.routes'); 
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes')

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes )
router.use('/products', productRoutes);

module.exports = router;