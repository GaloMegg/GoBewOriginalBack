bcrypt = require('bcryptjs');
// const nodemailer = require("nodemailer")

const Users = require('../models/Users');
const User = require('../models/Users');
const { generateJWT, generateHash } = require('../helpers/jwt');
const { loginActivateMail } = require('./sendEmail');

const createUser = async (req, res) => {
    const { 
        userEmail, userPassword, userFirstName, userLastName,
        userIsActive, userIsAdmin, userIsGoogle, userIsSuperAdmin, userImage
     } = req.body;
    try {
        const hash = !userIsGoogle ? await generateHash( userFirstName ) : '';
        // const hash = await generateHash( userFirstName );
        const newUser = new User({ 
            userEmail, userPassword, userFirstName, userLastName,
            userIsActive, userIsAdmin, userIsGoogle, userIsSuperAdmin, userImage, hash
         })
        //  console.log(newUser);
         if(!userIsGoogle){
            // console.log('entro')
             const bcrypt = require('bcryptjs');
             const salt = bcrypt.genSaltSync(10);
             newUser.userPassword = bcrypt.hashSync(userPassword, salt);
            //  console.log(newUser.hash);
         } else {
             newUser.hash = '';
             newUser.userPassword = '';
         }

         await newUser.save()
         const token = await generateJWT( newUser._id, newUser.userName );
         let resMail = await loginActivateMail({userEmail, userFirstName, _id:newUser._id, hash, userIsGoogle})
         
         
        res.status(201).json({
            ok: true,
            user: {
                userFirstName: newUser.userFirstName,
                userEmail: newUser.userEmail,
                userLastName: newUser.userLastName,
                userId: newUser._id,
                token
            },
            resMail
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: error,
        })
    }
}

const updateUser = async (req, res) => {
    const { 
        userId, userFirstName, userLastName,
        userIsActive, userIsAdmin, userIsGoogle, userIsSuperAdmin
     } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, {
            userFirstName, userLastName,
            userIsActive, userIsAdmin, userIsGoogle, userIsSuperAdmin
        }, { new: true })
        res.status(201).json({
            ok: true,
            user: {
                userFirstName: user.userFirstName,
                userEmail: user.userEmail,
                userLastName: user.userLastName,
                userId: user._id
        }
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
}   
    
const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const user = await Users.findOne({userEmail, userIsActive:true});
        //si no existe el user devuelve null
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado.'
            })
        }

        //Confirmar las passwords
        const validPassword = bcrypt.compareSync(userPassword,user.userPassword); 
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            });
        }
        
        //GENERAR JWT
        const token = await generateJWT( user._id, user.userFirstName );
        // const token = await generateJWT( user._id, user.userFirstName, user.userIsAdmin, user.userIsSuperAdmin );
        
        res.json({
            ok: true,
            userId: user._id,
            userFirstName: user.userFirstName,
            userIsSuperAdmin: user.userIsSuperAdmin,
            userIsAdmin: user.userIsAdmin,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contraseña incorrecta'
        })
    }
} 
const loginUserGoogle = async (req, res) => {
    const { userEmail, userFirstName, userLastName,
        userIsActive, userIsGoogle, userImage } = req.body;
    try {
        let user;
        user = await Users.findOne({userEmail, userIsActive:true});
        //si no existe el user devuelve null
        if ( !user ) {
             user = new User({ 
                userEmail, userPassword:'', userFirstName, userLastName,
                userIsActive, userIsGoogle, userImage, hash:''
             })
            //  console.log(newUser);

    
             await user.save()
        }
        //GENERAR JWT
        const token = await generateJWT( user._id, user.userFirstName );
        res.json({
            ok: true,
            userId: user._id,
            userFirstName: user.userFirstName,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Usuario no encontrado'
        })
    }
} 
const loginUserAdmin = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const user = await Users.findOne({userEmail, userIsActive:true, userIsAdmin: true});
        //si no existe el user devuelve null
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado.'
            })
        }
        
        //Confirmar las passwords
        const validPassword = await bcrypt.compareSync(userPassword,user.userPassword); 
        

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            });
        }
        
        //GENERAR JWT
        // const token = await generateJWT( user._id, user.userFirstName);
        // const token = await generateJWT( user._id, user.userFirstName, user.userIsAdmin, user.userIsSuperAdmin );
        
        res.json({
            ok: true,
            userId: user._id,
            userFirstName: user.userFirstName,
            userIsSuperAdmin: user.userIsSuperAdmin,
            userIsAdmin: user.userIsAdmin,
            // token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contraseña incorrecta'
        })
    }
} 

const renewToken = async (req, res = response)=>{

    const { uid, name } = req;
    // console.log("newToken",uid, name, isAdmin, isSuperAdmin)
    try {
        // const token = await generateJWT( uid, name, isAdmin, isSuperAdmin );
        const token = await generateJWT( uid, name);
        res.json({
            ok: true,
            token,
            userId:uid,
            userFirstName:name,            

        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
};

const updateUserActiveState = async (req, res) => {
    const { userId, userIsActive } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, {
            userIsActive
        }, { new: true })
        res.status(201).json({
            ok: true,
            user: {
                userFirstName: user.userFirstName,
                userEmail: user.userEmail,
                userLastName: user.userLastName,
                userId: user._id,
                userIsActive: user.userIsActive
        }
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
}
module.exports = {
    createUser,
    updateUser,
    loginUser,
    loginUserGoogle,
    loginUserAdmin,
    renewToken,
    updateUserActiveState
}