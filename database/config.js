const mongoose  = require("mongoose");

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.MONGO_CONN); 
        console.log('DB Online')
    } catch {
        
        throw new Error('Error al inicializar la base de datos');
    }

}

module.exports = {
    dbConnection
}

