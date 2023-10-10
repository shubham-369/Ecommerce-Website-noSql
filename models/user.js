const mongodb = require('mongodb');
const { getDB } = require('../util/database');

class User{
    constructor(name, email, cart, id){
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    async save(){
        const db = getDB();
        try {
            await db.collection('users').insertOne(this);
            return;
        } catch (error) {
            console.log('Error while saving user', error);   
        }
    }
    async addToCart(product){
        const db = getDB();
        try {
            if (this.cart === undefined) {
                this.cart = { items: [] };
            }
            const cartProductIndex = this.cart.items.findIndex(cp => {
                return cp.productId.toString() === product._id.toString();
            })
          
            let newQuantity = 1;
            const updatedCartItems = [...this.cart.items];
            
            if(cartProductIndex >=0){
                newQuantity = this.cart.items[cartProductIndex].quantity + 1;
                updatedCartItems[cartProductIndex].quantity = newQuantity;
            }else{
                updatedCartItems.push({
                    productId: new mongodb.ObjectId(product._id),
                    quantity: 1,
                });
            }
            const updatedCart = { items: updatedCartItems };

            await db.collection('users').updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set : {cart: updatedCart}}
            );
            return;
        } catch (error) {
            console.log('Error while adding products to cart', error);
        }
    }

    async getCart(){
        const db = getDB();
        try {
            const productIds = await this.cart.items.map(items => items.productId);

            const products = await db.collection('products').find({_id: {$in: productIds}}).toArray();

            const productQuantityMap = new Map();
            this.cart.items.forEach(item => {
                productQuantityMap.set(item.productId.toString(), item.quantity);
            });

            return products.map(p => ({
                ...p,
                quantity: productQuantityMap.get(p._id.toString()) || 0, 
            }));
        } catch (error) {
            console.log('Error while getting cart items', error);
        }
    }
    async deleteCart(id){
        const db = getDB();
        try {
            const updatedCartItems = this.cart.items.filter(items => {
                return items.productId.toString() !== id.toString();
            });
            await db.collection('users').updateOne(                
                {_id: new mongodb.ObjectId(this._id)},
                {$set : {cart: updatedCartItems}}
            );
            return;
        } catch (error) {
            console.log('Error while deleting cart', error);
        }
    }

    static async findById(id){
        const db = getDB();
        try {
            const user = await db.collection('users').findOne({_id: new mongodb.ObjectId(id)});
            return user;
        } catch (error) {
            console.log('Error while finding user by id', error);
        }
    }
}

module.exports = User;