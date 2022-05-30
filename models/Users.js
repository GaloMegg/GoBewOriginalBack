const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    creationDate:{
        type: Date,
        default: Date.now
    },
    isGoogle:{
        type: Boolean,
        default: false
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    isSuperAdmin:{
        type: Boolean,
        default: false
    }
})


module.exports = model('User', UserSchema)