const express = require('express');
const router = express.Router();
const shopControllers = require('../controllers/shop');

router.get('/products', shopControllers.productDetails);

router.get('/buy', shopControllers.postOrder);

router.get('/orders', shopControllers.orderPage);

router.get('/cart', shopControllers.getCart);

router.delete('/deleteCart', shopControllers.deleteCart);

router.post('/cart', shopControllers.addCart);

router.get('/contact', shopControllers.contact);

router.get('/success', shopControllers.success);

router.get('/shop', shopControllers.showProducts);

module.exports = router;