const { getDB } = require('../util/database');

class Product{
    constructor(title, imageurl, price, description){
        this.title = title;
        this.imageurl = imageurl;
        this.price = price;
        this.description = description;
    }
    async save(){
        try {
            const db = getDB();
            const result = await db.collection('products').insertOne(this);
            const insertedDocument = await db.collection('products').findOne({ _id: result.insertedId });
            return insertedDocument;
        } catch (error) {
            console.log('Error while saving product', error);
        }
    }
};

exports.Product = Product;