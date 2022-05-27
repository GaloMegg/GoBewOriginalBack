const express = require('express');
const { dbConnection } = require('./database/config')
const productRouter = require('./routes/products') 
const categoryRouter = require('./routes/categories') 
//TODO: instalar morgan



require('dotenv').config();
//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();


app.use(express.json());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/product', productRouter)
// app.use('/images', imageRouter)
app.use('/categories', categoryRouter)


app.listen(process.env.PORT,() => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});