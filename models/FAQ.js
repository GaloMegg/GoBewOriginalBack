const { Schema, model } = require('mongoose');

const faqSchema = new Schema({
    faqTitle:{
        type: String,
        required: true
    },
    faqDescription:{
        type: String,
        required: true
    },
    faqOrder:{
        type: Number
    }
});

module.exports = model('FAQ', faqSchema);