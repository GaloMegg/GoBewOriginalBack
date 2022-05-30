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

        res.status(201).json({
            ok: true,
            user: {
                userFirstName: newUser.userFirstName,
                userEmail: newUser.userEmail,
                userLastName: newUser.userLastName,
                userId: newUser._id
            }
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
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
    

module.exports = {
    createUser,
    updateUser
}