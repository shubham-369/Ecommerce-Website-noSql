const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const { MongoConnect } = require("./util/database");

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');
// const errorRoutes = require('./routes/error');


app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("6523f0cb58b95c911bb0abd7")
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch((error) => console.log(error));
});

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
// app.use('*', errorRoutes);


const port =  process.env.PORT || 4500;

MongoConnect(() => {
    app.listen(port);
});
