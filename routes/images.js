const { Router } =require('express');
const Image = require('../models/Images')

const router = Router();

router.post('/new', async (req, res) => {
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
})


module.exports = router;
