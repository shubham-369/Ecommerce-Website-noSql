const mongodb = require('mongodb');
const { getDB } = require('../util/database');

class User{
    constructor(name, email){
        this.name = name;
        this.email = email;
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