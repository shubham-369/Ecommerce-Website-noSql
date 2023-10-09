const mongodb = require('mongodb');
const { getDB } = require('../util/database');
const { deleteByID } = require('../controllers/admin');

class Product{
    constructor(title, imageurl, price, description, id){
        this.title = title;
        this.imageurl = imageurl;
        this.price = price;
        this.description = description;
        this._id = id? new mongodb.ObjectId(id) : null;
    }
    async save(){
        const db = getDB();
        try {
            let result;
            if (this._id) {
                result = await db.collection('products').updateOne(
                  { _id: this._id },
                  { $set: this }
                );
            } else {
                result = await db.collection('products').insertOne(this);
            }
              return result;
        } catch (error) {
            console.log('Error while saving product', error);
        }
    }
    static async fetchAll(){
        const db = getDB();
        try {
            const products = await db.collection('products').find().toArray();
            return products;
        } catch (error) {
            console.log('Error while fetching products', error);
        }
    }
    static async findById(id){
        const db = getDB();
        try {
            const product = await db.collection('products').findOne({_id: new mongodb.ObjectId(id)});
            return product;
        } catch (error) {
            console.log('Error while fetching products by id', error);            
        }
    }
    static async deleteByID(id){
        const db = getDB();
        try {
            const result = await db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)});
            return ;
        } catch (error) {
            console.log('Error while deleting product', error);
        }
    }
};

exports.Product = Product;