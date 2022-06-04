const {Schema, model} = require("mongoose");

const addressSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    addressStreet: {
        type: String,
        // required: true
    },
    addressNumber: {
        type: Number,
        // required: true
    },
    addressFloor: {
        type: String
    },
    addressFlat: {
        type: String
    },
    addressCity: {
        type: String,
        // required: true
    },
    addressZipCode: {
        type: String,
        // required: true
    },
    provinceId: {
        type: Schema.ObjectId,
        ref: 'Province',
        // required: true
    },
     addressComment: {
        type: String
    },
    addressIsShipping: {
        type: Boolean,
        default: true
    },
    addressIsBilling: {
        type: Boolean,
        default: true
    }

});


module.exports = model('Address', addressSchema);