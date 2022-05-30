const { Schema, model } = require("mongoose");

const saleSchema = new Schema({
    saleName: {
        type: String,
        required: true
    },
    salePercentage: {
        type: Number,
        required: true
    }

});


module.exports = model('Sale', saleSchema);