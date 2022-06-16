const Image = require('../models/Images')

const createImage = async (req, res) => {
    const { productId, imageName, imageAlt, imageOrder, imageIsPrimary } = req.body;

    try {
        const newImage = new Image({ productId, imageName, imageAlt, imageOrder, imageIsPrimary });
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
        const ImageToUpdate = { productId, imageName, imageAlt, imageOrder, imageIsPrimary };
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


const deleteImage = async (req, res) => {
    const { imageId } = req.params;

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

const getImagesByProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const imgs = await Image.find({ productId });
        res.status(201).json({
            err: true,
            imgs
        })
    } catch (error) {
        res.status(404).json({
            ok: false,
            err: 'No se encontraron imágens'
        })
    }
}


module.exports = {
    updateImage,
    createImage,
    deleteImage,
    getImagesByProduct
}