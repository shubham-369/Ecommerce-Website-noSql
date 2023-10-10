const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items:[{
            productId: { type: Schema.Types.ObjectId, required: true },
            quantity: { type: String, required: true }
        }]
    }
});


module.exports = Mongoose.model('User', UserSchema);