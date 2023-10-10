const Mongoose = require('mongoose');
const Schema = Mongoose.Schema();

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});


exports.Product = Mongoose.model('Product', ProductSchema);