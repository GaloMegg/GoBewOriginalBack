const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    },
    orderState: {
        type: Number,
        required: true
    },
    shippingAddressId: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    billingAddressId: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    orderCreationDate: {
        type: Date
    },
    orderAceptDate: {
        type: Date
    },
    orderDeliverDate: {
        type: Date
    },
    orderCancelDate: {
        type: Date
    },
    orderDeliverPrice: {
        type: Number,
        required: true
    }
});

module.exports = model('Order', orderSchema);