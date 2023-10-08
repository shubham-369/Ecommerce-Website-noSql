const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const MongoConnect = async(callback) => {
    try{
        const client = await MongoClient.connect('mongodb+srv://shubham:Humanity369@cluster0.6gw8hdd.mongodb.net/shop?retryWrites=true&w=majority');
        console.log('Connected!');
        _db = client.db();
        callback();
    }
    catch(error){
        console.log('Error while connect to Mongo db', error);
        throw error;
    }
}

const getDB = () => {
    if(_db){
        return _db;
    }
    throw 'No database found';
}

exports.MongoConnect = MongoConnect;
exports.getDB = getDB;