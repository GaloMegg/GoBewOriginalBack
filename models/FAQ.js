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

faqSchema.method('toJSON', function(){
    
    const { __v, _id, ...object } = this.toObject();
    object.faqId = _id;
    return object;
});

module.exports = model('FAQ', faqSchema);