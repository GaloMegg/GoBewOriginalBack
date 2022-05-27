const { Schema, model } = require('mongoose');

const ImageSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageAlt: {
        type: String,
        required: true
    },
    imageOrder: {
        type: Number,
        default: 1
    },
    imageIsPrimary: {
        type: Boolean,
        default: false
    }
});

ImageSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    object.imageId = _id;
    return object;
});


module.exports = model('Image', ImageSchema);