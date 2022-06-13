const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./database/config')
const productRouter = require('./routes/products')
const payments = require('./routes/payments')
const categoryRouter = require('./routes/categories')
const usersRouter = require('./routes/users')
const imageRouter = require('./routes/images')
const faqRouter = require('./routes/faqs')
const addressRouter = require('./routes/address')
const reviewsRouter = require('./routes/reviews')
const wishListRouter = require('./routes/wishList')
const companyRouter = require('./routes/company')

require('dotenv').config();
//Crear el servidor de express
const app = express();
//CORS
app.use(cors())
//Base de datos
dbConnection();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter)
app.use('/images', imageRouter)
app.use('/categories', categoryRouter)
app.use('/payments', payments)
app.use('/address', addressRouter)
app.use('/faqs', faqRouter)
app.use('/reviews', faqRouter)
app.use('/wishList', wishListRouter)	
app.use('/company', companyRouter)
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});