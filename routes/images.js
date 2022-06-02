const { Router } =require('express');
const { updateImage, createImage, deleteImage } = require('../controllers/image');
const { validateJWT } = require('../middlewares/validateJWT');
const Image = require('../models/Images')

const router = Router();
//PEDIR AL FRONT QUE ENVÍE HEADERS PARA POST Y DELETE!!!!
// router.post('/new', validateJWT, createImage)
router.post('/new',  createImage)

router.put(
    '/', 
    validateJWT,
    updateImage
   )

<<<<<<< HEAD
    try {
        const newImage = new Image({productId, imageName, imageAlt, imageOrder, imageIsPrimary});
        await newImage.save();
        res.status(201).json({
            err: 'ok',
            image: newImage
        });
    } catch (error) {
        // res.status(501).json({
        //     err: 'err',
        //     msg: error
        // })
        console.log("problema tuyo")
    }
})

router.delete('/:imageId', async (req, res) => {
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
})
=======
router.delete('/:imageId', deleteImage)
>>>>>>> b1c917491a00d5be444e496b7acb23cdf38d1310


module.exports = router;
