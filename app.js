const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const { MongoConnect } = require("./util/database");

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const errorRoutes = require('./routes/error');


app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
//     User.findByPk(1)
//     .then(user => {
//         req.user = user;
//         next();
//     })
//     .catch((error) => console.log(error));
next();
});

app.use('/admin', adminRoutes);
// app.use('/shop', shopRoutes);
// app.use('*', errorRoutes);


const port =  process.env.PORT || 4500;

MongoConnect(() => {
    app.listen(port);
});
