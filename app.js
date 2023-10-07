const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const dirname = require('./util/path');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');


app.use(express.json());
app.use(cors());

app.use(express.static(path.join(dirname, 'views')));
app.use(express.static(path.join(dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch((error) => console.log(error));

});

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('*', errorRoutes);

Product.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through:CartItem });
Product.belongsToMany(Cart, { through:CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


const port =  process.env.PORT || 4500;
sequelize
.sync()
.then(() => {
    return User.findByPk(1);
})
.then((user) => {
    if(!user){
        User.create({name:"name3", email:"test3@gmail.com"});
    }else{
        return user;
    }
})
.then((user) => {
    return user.createCart();
})
.then((cart) => {
    app.listen(port);
})
.catch((err) => console.log('Server not running : ',err));