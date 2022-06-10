const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    userEmail:{
        type: String,
        unique: true,
        required: true,
    },
    userPassword:{
        type: String
    },
    userIsActive:{
        type: Boolean,
        default: true
    },
    userIsAdmin:{
        type: Boolean,
        default: false
    },
    userCreationDate:{
        type: Date,
        default: Date.now
    },
    userIsGoogle:{
        type: Boolean,
        default: false
    },
    userFirstName:{
        type: String,
        required: true
    },
    userLastName:{
        type: String,
        required: true
    },
    userIsSuperAdmin:{
        type: Boolean,
        default: false
    },
    hash: {
        type: String,
        default: ""
    },
    userImage:{
        type: String,
        default: ""
    }
})

module.exports = model('User', UserSchema)