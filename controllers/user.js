const { generateJWT } = require('../helpers/jwt');
const Users = require('../models/Users');
const User = require('../models/Users');
bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const { 
        userEmail, userPassword, userFirstName, userLastName,
        userIsActive, userIsAdmin, userIsGoogle, userIsSuperAdmin
     } = req.body;
    try {
        const newUser = new User({ 
            userEmail, userPassword, userFirstName, userLastName,
            userIsActive, userIsAdmin, userIsGoogle, userIsSuperAdmin
         })

         const bcrypt = require('bcryptjs');
         const salt = bcrypt.genSaltSync(10);
        //  console.log(salt)
        //  console.log(userPassword);
         newUser.userPassword = bcrypt.hashSync(userPassword, salt); 
        //  console.log(newUser.userPassword);
        await newUser.save()
        const token = await generateJWT( newUser._id, newUser.userName ); 
        res.status(201).json({
            ok: true,
            user: {
                userFirstName: newUser.userFirstName,
                userEmail: newUser.userEmail,
                userLastName: newUser.userLastName,
                userId: newUser._id,
                token
            }
        })
    } catch (error) {
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
        const token = await generateJWT( user._id, user.userFirstName, user.userIsAdmin, user.userIsSuperAdmin );
        
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
        // console.log(user.userPassword, userPassword);
        //Confirmar las passwords
        const validPassword = await bcrypt.compareSync(userPassword,user.userPassword); 
        console.log(validPassword);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            });
        }
        // console.log(user._id, user.userName)
        //GENERAR JWT
        const token = await generateJWT( user._id, user.userFirstName, user.userIsAdmin, user.userIsSuperAdmin );
        
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

const renewToken = async (req, res = response)=>{

    const { uid, name, isAdmin, isSuperAdmin } = req;
    console.log(uid, name, isAdmin, isSuperAdmin)
    try {
        const token = await generateJWT( uid, name, isAdmin, isSuperAdmin );
        res.json({
            ok: true,
            token,
            userId:uid,
            userFirstName:name,            
            userIsSuperAdmin:isSuperAdmin,
            userIsAdmin:isAdmin
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
};
module.exports = {
    createUser,
    updateUser,
    loginUser,
    loginUserAdmin,
    renewToken
}