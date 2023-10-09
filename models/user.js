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
            const updatedCart = { items: updatedCartItems }

            await db.collection('users').updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set : {cart: updatedCart}}
            )
        } catch (error) {
            console.log('Error while adding products to cart', error);
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