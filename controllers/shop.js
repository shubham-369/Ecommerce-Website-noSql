const Product = require('../models/product');
const product = require('../models/product');

exports.orderPage = (req, res, next) => {
    req.user
    .getOrders({include: ['products']})
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
    product.findAll()
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
        product.findAll({where:{id:id}})
        .then((data) => {
            res.render('shop/products', {
                detail: data[0],
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
    .then((cart) => {
        return cart
        .getProducts()
        .then((products) => {
            res.render('shop/cart', {
                prods: products,
                pageTitle: 'Cart',
                path: '/cart'
            });
        })
        .catch((error) => {
            console.log('error while getting products from the cart :', error);
            res.status(500).render('error', { pageTitle: 'Internal server error'});
        })
    })
    .catch((error) => {
        console.log('error while fetching product details :', error);
        res.status(500).render('error', { pageTitle: 'Internal server error'});
    })
}

exports.addCart = (req, res, next) => {
    const {product} = req.body;
    let fetchedCart;
    let newQuantity = 1;

    req.user
    .getCart()
    .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({where:{id:product}})
    })
    .then((products) => {
        let prod;
        if(products.length > 0){
            prod = products[0];
        }
        if(prod){
            const oldQuantity = prod.cartItems.quantity;
            newQuantity = oldQuantity + 1;
            return prod
        }
        return Product.findByPk(product)
    })
    .then((fproduct) => {
        res.status(200).json({message:'product added successfully to cart'});
        return fetchedCart.addProduct(fproduct, { 
            through: { quantity : newQuantity } 
        });
    })
    .catch((error) => {
        console.log('error while adding product to cart : ', error);
        res.status(500).json({ message: 'Internal server error'});   
    })
}

exports.deleteCart = (req, res, next) => {
    const delID = req.query.id;
    req.user
    .getCart()
    .then((cart) => {
        return cart.getProducts({where:{id:delID}});
    })
    .then((products) => {
        const product = products[0];
        return product.cartItems.destroy();
    })
    .then(() => {
        res.status(200).json({message:'product deleted from the cart'});
    })
    .catch((error) => {
        console.log('error while deleting from cart : ', error);
        res.status(500).json({ message: 'Internal server error'});        
    })
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
    .getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user
            .createOrder()
            .then(order => {
                order.addProducts(products.map(product => {
                    product.orderItems = {quantity: product.cartItems.quantity};
                    return product;
                }))
            })
            .catch(error => {
                console.log('error while posting order :', error);
                res.status(500).json({ message: 'Internal server error'}); 
            })
    })    
    .then(() => {
        return fetchedCart.setProducts(null);
    })
    .then(() => {
        res.status(200).json({message: 'Ordered successfully!'});
    })
    .catch(error => {
        console.log('error while posting order :', error);
        res.status(500).json({ message: 'Internal server error'}); 
    })
}