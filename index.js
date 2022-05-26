const express = require('express');
const { dbConnection } = require('./database/config')

require('dotenv').config();
//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();


app.use(express.json());


app.listen(process.env.PORT,() => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});