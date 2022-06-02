const Image = require('../models/Images')

const createImage =async (req, res) => {
    const {  productId, imageName, imageAlt, imageOrder, imageIsPrimary } = req.body;

    try {
        const newImage = new Image({productId, imageName, imageAlt, imageOrder, imageIsPrimary});
        await newImage.save();
        res.status(201).json({
            err: 'ok',
            image: newImage
        });
    } catch (error) {
        res.status(501).json({
            err: 'err',
            msg: error
        })
    }
}


const updateImage = async (req, res) => {
        
    const { imageId, productId, imageName, imageAlt, imageOrder, imageIsPrimary } = req.body;

    try {
        const ImageToUpdate = {productId, imageName, imageAlt, imageOrder, imageIsPrimary};
        // console.log(ImageToUpdate);
        await Image.findByIdAndUpdate(imageId, ImageToUpdate, { new: true });
        res.status(201).json({
            err: 'ok',
            image: ImageToUpdate
        });
    } catch (error) {
        res.status(501).json({
            err: 'err',
            msg: error
        })
    }
}


const deleteImage =async (req, res) => {
    const {  imageId } = req.params;

    try {
        
        await Image.findByIdAndDelete(imageId);
        res.status(201).json({
            err: 'ok',
            
        });
    } catch (error) {
        res.status(501).json({
            err: 'err',
            msg: error
        })
    }
}

module.exports = {
    updateImage,
    createImage,
    deleteImage
}