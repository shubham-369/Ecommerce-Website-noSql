const express = require('express');
const adminControllers = require('../controllers/admin');
const router = express.Router();

router.get('/admin-product', adminControllers.getProducts);
router.delete('/admin-product', adminControllers.deleteByID);
router.post('/add-product', adminControllers.addUpdateProducts);
router.get('/add-product', adminControllers.fetchByID);

module.exports = router;