const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    productId: {
        type: Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    reviewStars: {
        type: Number,
        required: true
    },
    reviewComment: {
        type: String,
        required: true
    }
});

module.exports = model('Review', reviewSchema);