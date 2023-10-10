require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const Mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');
const errorRoutes = require('./routes/error');


app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("65252caa7813ec60d34290c4")
    .then(user => {
        req.user = user;
        next();
    })
    .catch((error) => console.log(error));
});

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('*', errorRoutes);


const port =  process.env.PORT || 4500;

Mongoose
.connect(process.env.MONGOLINK)
.then(() => {
    User.findOne()
    .then(user => {
        if(!user){
            const user = new User({
                name: 'shubham',
                email: 'shubham@gmail.com',
                cart: {
                    items:[]
                }
            })
            user.save();
        }
    });
    app.listen(port);
})
.catch(error => {
    console.log('Error while connecting to server', error);
})
