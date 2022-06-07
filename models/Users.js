const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    userEmail: {
        type: String,
        unique: true,
        required: true,
        //  index: {
        //      unique: true,
        //      collation: { locale: 'es', strength: 2 }
        // }
    },
    userPassword: {
        type: String
    },
    userIsActive: {
        type: Boolean,
        default: true
    },
    userIsAdmin: {
        type: Boolean,
        default: false
    },
    userCreationDate: {
        type: Date,
        default: Date.now
    },
    userIsGoogle: {
        type: Boolean,
        default: false
    },
    userFirstName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    userIsSuperAdmin: {
        type: Boolean,
        default: false
    },
    hash: {
        type: String,
        default: ""
    },
    userImage: {
        type: String,
        default: ""
    }
})
// , {
//     collation: { locale: 'es', strength: 2 }
//  }

//  index: {
//     unique: true,
//     collation: { locale: 'en', strength: 2 }
//   }

module.exports = model('User', UserSchema)