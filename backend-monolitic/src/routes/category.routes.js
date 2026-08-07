const express = require('express');
const router = express.Router(); 
const {createCategory, getAllCategory, getCatergoriesTree} = require('../controllers/category.controller')


// Note : Create Category
router.post('/create', createCategory );

// Note : get All Category
router.get('/', getAllCategory); 

router.get('/tree', getCatergoriesTree)

module.exports = router;