const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
    categoryName : {
        type : String,
        required : true
    },
    categoryIsActive : {
        type : Boolean,
        default: true
    },
    categorySupId : {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        default: null
    },
})

CategorySchema.method('toJSON', function(){
    
    const { __v, _id,  ...object } = this.toObject();
    object.categoryId = _id;
    return object;
});


module.exports= model('Categories', CategorySchema);