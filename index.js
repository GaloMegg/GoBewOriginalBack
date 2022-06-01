const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./database/config')
const productRouter = require('./routes/products')
const categoryRouter = require('./routes/categories')
const usersRouter = require('./routes/users')
const imageRouter = require('./routes/images')
const faqRouter = require('./routes/faqs')
//TODO/users instalar morgan


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
app.use('/faqs', faqRouter)


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});