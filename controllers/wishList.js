const mongoose = require("mongoose");
const WishList = require('../models/WishList');
const ObjectId = mongoose.Types.ObjectId;

const updateWishList = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        
        const existsWishList = await WishList.findOne({ userId, productId });
        console.log(existsWishList)
        !existsWishList 
            ? await WishList.create({ userId, productId }) 
            : await WishList.findOneAndDelete({ userId, productId });
        
        res.json({
            ok: true,
            message: 'WishList actualizado'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error',
        });
    }

}


const getWishListByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const wishList = await WishList.find({ userId });

        res.json({
            ok: true,
            wishList
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Error'
        });
    }
}

const getWishListAllByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const wishList = await WishList
        .aggregate([
            { $match: { userId: ObjectId(userId) } },
            {$lookup: {
                from: 'products',                
                localField:  'productId',
                foreignField:'_id',
                as: 'product'            
            }},
            {$unwind: '$product'},
            {
                $lookup: {
                    from: 'images',
                    localField: 'productId',
                    foreignField: 'productId',
                    as: 'images'
                }
            },
            // {$unwind: '$images'},
            // {$group: {
            //     _id: '$productId',
            //     product: { $first: '$product' },
            //     images: { $first: '$images' }
            // }},
            {
                "$project": {
                    "_id": 1,
                    "product._id":1,
                    "product.productName": 1,
                    "product.productDescription": 1,
                    "product.productPrice": 1,
                    "product.productStock": 1,
                    "images.productId": 1,
                    "images.imageName": 1,
                    "images.imageIsPrimary": 1,
                }
            }
        ])
        res.json({
            ok: true,
            wishList
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Error'
        });
    }
}



module.exports = {
    updateWishList,
    getWishListByUser,
    getWishListAllByUser
}