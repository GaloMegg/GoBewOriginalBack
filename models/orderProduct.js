const { Schema, model } = require('mongoose');

const orderProductSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    saleApplyId: {
        type: Schema.Types.ObjectId,
        ref: 'SaleApply'
    },
    productCant: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    }
});

module.exports = model('OrderProduct', orderProductSchema);