const {Schema, model} = require("mongoose");

const provinceSchema = new Schema({
    provinceName: {
        type: String,
        required: true
    }
});


module.exports = model('Province', provinceSchema);