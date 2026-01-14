const express = require('express');
const { connectToMongoDB } = require('./connect');
const app = express();

const PORT = 3000;
const path = require('path');
//requred middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
//import route files
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

connectToMongoDB("")
    .then(() => console.log("mongoDB connected"));
//set EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use('/user', userRoute);
app.use('/', staticRoute);
app.listen(PORT, () => console.log("PORT started at 3000"));
