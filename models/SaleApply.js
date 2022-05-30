const { Schema, model } = require('mongoose');

const saleApplySchema = new Schema({
    saleId: {
        type: Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    saleApplyFrom: {
        type: Date,
        required: true,
        default: Date.now
    },
    saleApplyTo: {
        type: Date,
        required: true,
        default: Date.now
    },
    saleApplyIsActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = model('SaleApply', saleApplySchema);