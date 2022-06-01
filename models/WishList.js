const { Schema, model } = require("mongoose");

const wishListSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.ObjectId,
        ref: 'Product',
        required: true
    }
});


module.exports = model('WishList', wishListSchema);