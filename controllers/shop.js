const { Product } = require('../models/product');

exports.orderPage = (req, res, next) => {
    req.user
    .getOrders()
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
    Product.fetchAll()
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
    req.user.getCart()
    .then((products) => {
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
    const {product} = req.body;

    Product.findById(product)
    .then((product) => {
        return req.user.addToCart(product)
    })
    .then((result) => {
        console.log(result);
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
    .deleteCart(delID)
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
    .addOrder()
    .then(() => {
        res.status(200).json({message: 'Ordered successfully!'});
    })
    .catch(error => {
        console.log('error while posting order :', error);
        res.status(500).json({ message: 'Internal server error'}); 
    })
}