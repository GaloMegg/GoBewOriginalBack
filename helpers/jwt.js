const jwt = require("jsonwebtoken"); 


const generateJWT = ( uid, name, isAdmin, isSuperAdmin ) => {

    return new Promise((resolve, reject ) => {
        const payload = { uid, name, isAdmin, isSuperAdmin };

        jwt.sign(payload, process.env.SECRET_JWT_SEED,{
            expiresIn: '2h'
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject( 'Err: No se pudo generar el token' );
            }

            resolve( token ); 
        })

    })

}

module.exports = {
    generateJWT
}