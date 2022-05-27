
const { Schema, model } = require('mongoose');

const Product_CategorySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    }
})

module.exports = model('Product_Category', Product_CategorySchema)