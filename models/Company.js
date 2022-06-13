const { Schema, model } = require("mongoose");

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    companyEmail: {
        type: String,

    },
    companyPhone: {
        type: String
    },
    companyAddress: {
        type: String
    },
    companyDescription: {
        type: String
    },
    companyFacebook: {
        type: String
    },
    companyTwitter: {
        type: String
    },
    companyInstagram: {
        type: String
    },
    companyMap: {
        type: String
    },
    companyIsActive: {
        type: Boolean,
        default: true
    }

});

module.exports = model('Company', companySchema);