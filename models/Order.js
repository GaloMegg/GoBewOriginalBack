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
        ref: 'Address',
        default:null
    },
    billingAddressId: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        default:null
    },
    orderCreationDate: {
        type: Date,
        default:null
    },
    orderAceptDate: {
        type: Date,
        default:null
    },
    orderDeliverDate: {
        type: Date,
        default:null
    },
    orderCancelDate: {
        type: Date,
        default:null
    },
    orderDeliverPrice: {
        type: Number,
        default:null
    },
    payment_id: {
        type: String,
        default:null
    },
    payment_type: {
        type: String,
        default:null
    }
});

module.exports = model('Order', orderSchema);