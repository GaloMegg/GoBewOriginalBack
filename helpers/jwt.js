const jwt = require("jsonwebtoken"); 


// const generateJWT = ( uid, name, isAdmin, isSuperAdmin ) => {
const generateJWT = ( uid, name ) => {

    return new Promise((resolve, reject ) => {
        const payload = { uid, name };

        jwt.sign(payload, process.env.SECRET_JWT_SEED,{
            expiresIn: '72h'
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject( 'Err: No se pudo generar el token' );
            }

            resolve( token ); 
        })

    })

}
const generateHash = ( name ) => {

    return new Promise((resolve, reject ) => {
        const payload = { name };
        console.log(name)
        console.log(process.env.SECRET_JWT_SEED_MAIL)
        jwt.sign(payload, process.env.SECRET_JWT_SEED_MAIL,{
            expiresIn: '2h'
        }, ( err, hash ) => {
            if ( err ) {
                console.log(err);
                reject( 'Err: No se pudo generar el hash' );
            }

            resolve( hash ); 
        })

    })

}

module.exports = {
    generateJWT,
    generateHash
}