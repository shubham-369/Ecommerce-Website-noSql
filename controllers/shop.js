const Product = require('../models/product');
const Order = require('../models/order');

exports.orderPage = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
    .then(orders => {
        res.render('shop/orders', {
            products: orders,
            pageTitle: 'Orders',
            path: '/orders'
        })
    })
}

exports.success = (req, res, next) => {
    res.render('shop/success', {
        pageTitle: 'Success',
        path: '/success' 
    });
}

exports.contact = (req, res, next) => {
    res.render('shop/contact', {
        pageTitle: 'Contact Us',
        path: '/contact' 
    });
}

exports.showProducts = (req, res, next) => {
    Product.find()
    .then((data) => {
        res.render('shop/shop', {
            prods: data,
            pageTitle: 'Shop products',
            path: '/shop'
        });
    })
    .catch((error) => {
        console.log('error while fetching shop products :', error);
        res.status(500).render('error', { pageTitle: 'Internal server error'});
    })
}

exports.productDetails = (req, res, next) => {
    const id = req.query.detailID;
    if(id){
        Product.findById(id)
        .then((data) => {
            res.render('shop/products', {
                detail: data,
                pageTitle: 'Product detail',
                path:'/products'
            });
        })
        .catch((error) => {
            console.log('error while fetching product details :', error);
            res.status(500).render('error', { pageTitle: 'Internal server error'});
        })
    }
}

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then((user) => {
        const products = user.cart.items;
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'Cart',
            path: '/cart'
        });
    })
    .catch((error) => {
        console.log('error while fetching product details :', error);
        res.status(500).render('error', { pageTitle: 'Internal server error'});
    })
}

exports.addCart = (req, res, next) => {
    const {productID} = req.body;

    Product.findById(productID)
    .then((product) => {
        return req.user.addToCart(product)
    })
    .then((result) => {
        res.redirect('/shop/cart');
    })
    .catch((error) => {
        console.log('error while adding product to cart : ', error);
        res.status(500).json({ message: 'Internal server error'});   
    })
}

exports.deleteCart = (req, res, next) => {
    const delID = req.query.id;
    req.user
    .removeFromCart(delID)
    .then(() => {
        res.status(200).json({message:'product deleted from the cart'});
    })
    .catch((error) => {
        console.log('error while deleting from cart : ', error);
        res.status(500).json({ message: 'Internal server error'});        
    })
}

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then((user) => {
        const products = user.cart.items.map((item) => {
            return { quantity: item.quantity, product: {...item.productId._doc } };
        })
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(() => {
        return req.user.clearCart();
    })
    .then(() => {
        res.status(200).json({message: 'Ordered successfully!'});
    })
    .catch(error => {
        console.log('error while posting order :', error);
        res.status(500).json({ message: 'Internal server error'}); 
    })
}