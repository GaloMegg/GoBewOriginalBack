const User = require('../models/Users');
bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const { 
        email, password, firstName, lastName,
        isActive, isAdmin, isGoogle, isSuperAdmin
     } = req.body;
    try {
        const newUser = new User({ 
            email, password, firstName, lastName,
            isActive, isAdmin, isGoogle, isSuperAdmin
         })

         const bcrypt = require('bcryptjs');
         const salt = bcrypt.genSaltSync(10);
        //  console.log(salt)
        //  console.log(password);
         newUser.password = bcrypt.hashSync(password, salt); 
        //  console.log(newUser.password);
        await newUser.save()

        res.status(201).json({
            ok: true,
            user: {
                firstName: newUser.firstName,
                email: newUser.email,
                lastName: newUser.lastName,
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
        id, firstName, lastName,
        isActive, isAdmin, isGoogle, isSuperAdmin
     } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, {
            firstName, lastName,
            isActive, isAdmin, isGoogle, isSuperAdmin
        }, { new: true })
        res.status(201).json({
            ok: true,
            user: {
                firstName: user.firstName,
                email: user.email,
                lastName: user.lastName,
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