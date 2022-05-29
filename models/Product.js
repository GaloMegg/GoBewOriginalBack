const { Schema, model } = require("mongoose");
const Categories = require("./Category");


const ProductSchema = new Schema({
    
    productName: {
        type:String,
        required: true,
        unique: true   
    },
    productIsActive: {
        type: Boolean,
        default: true
    },
    productDescription: {
        type: String
    },
    productPrice: {
        type: Number,
        required: true
    },
    productStock: {
        type: Number,
        required: true,
        default: 0
    },
    productIsHighLight: {
        type: Boolean,
        default: false
    },
    productCreationDate: {
        type: Date, default: Date.now
    },

    productCategories: [
        {
            type: Schema.ObjectId,
            ref: 'Categories',
            required: true
        }
    ]

});



ProductSchema.method('toJSON', function(){
    
    const { __v, _id, ...object } = this.toObject();
    object.productId = _id;
    return object;
});




module.exports = model('Product', ProductSchema);


