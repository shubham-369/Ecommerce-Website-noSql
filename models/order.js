const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products: [
        {
            products: { type: Object, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    user: { 
        name: { type: String, required: true},
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    }
});

exports.module = mongoose.model('Order', OrderSchema);