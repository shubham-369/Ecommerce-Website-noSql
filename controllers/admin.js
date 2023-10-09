const { Product } = require('../models/product');

exports.addUpdateProducts = (req, res, next) => {
    const { productID, title, url, price, description } = req.body;
    if (productID) {
        const product = new Product(title, url, price, description, productID);
        product
        .save()
        .then(() => {
            res.status(200).json({ message: 'Product updated successfully' });
        })
        .catch(error => {
            console.error('Error saving product by id:', error);
            res.status(500).render('error', { pageTitle: 'Internal Server Error' });
        });
    }else {
        const product = new Product(title, url, price, description);
        product
        .save()
        .then(() => {
            res.status(201).json({message:'Data saved to database!'});
        })
        .catch(err => {
            console.log(`error while saving product : ${err}`);
            res.status(500).render('error', { pageTitle: 'Internal Server Error' });
        });
    }
};


exports.fetchByID = (req, res, next) => {
    const id = req.query.updateID;
    if(id){
        Product.findById(id)
        .then(data => {
            res.render('admin/add-product', {
                IDdata: data,
                pageTitle: 'Add / Update product',
                path: '/add-product'
            });
        })
        .catch(error => {
            console.error('Error fetching products by id:', error);
            res.status(500).render('error', { pageTitle: 'Internal Server Error' });
        });
    }else{
        res.render('admin/add-product', {
            IDdata: null,
            pageTitle: 'Add / Update product',
            path: 'add-product'
        });
    }
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(data => {
            res.render('admin/admin-product', {
                prods: data,
                pageTitle: 'Admin Product',
                path: '/admin-product'
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};


exports.deleteByID = (req, res, next) => {
    const id = req.query.deleteID;
    Product.deleteByID(id)
        .then(() => {
            res.status(200).json({message:'Data deleted from database!'});
        })
        .catch(error => {
            res.status(500).render('error', { pageTitle: 'Internal Server Error' });
        });
};
