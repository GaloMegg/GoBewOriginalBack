const { Router } = require('express');
const { updateImage, createImage, deleteImage, getImagesByProduct } = require('../controllers/image');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();
//PEDIR AL FRONT QUE ENVÍE HEADERS PARA POST Y DELETE!!!!
// router.post('/new', validateJWT, createImage)
router.post('/new', createImage)

router.put(
    '/',
    // validateJWT,
    updateImage
)

router.delete('/:imageId', deleteImage)


router.get('/byProduct/:productId',  getImagesByProduct)

module.exports = router;
