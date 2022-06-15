const { Router } = require("express");
const { check } = require("express-validator");
const mongoose = require("mongoose");
const { idInvalid } = require("../controllers/errMsg");
const { createProduct, updateProduct, updateProductActiveState } = require("../controllers/product");
const { validateFields } = require("../middlewares/validateFields");

// const Images = require("../models/Images");
const Product = require('../models/Product');
const router = Router();

const ObjectId = mongoose.Types.ObjectId;


router.post(
    '/new',
    [
        check('productName', 'El nombre del producto es obligatorio.').not().isEmpty(),
        check('productDescription', 'La descripción del producto es obligatoria.').not().isEmpty(),
        check('productPrice', 'El precio del producto es obligatorio.').not().isEmpty(),
        check('productPrice', 'El precio del producto debe ser un número.').isNumeric(),
        check('productStock', 'El stock del producto es obligatorio.').not().isEmpty(),
        check('productStock', 'El stock del producto debe ser un número.').isInt(),
        check('productCategories', 'La categoría del producto es obligatoria.').isArray({ min: 1 }),
        validateFields
    ],
    createProduct
);
router.put(
    '/',
    [
        check('productId').custom(value => {
            return Product.findById(value).then(product => {
                if (!product) {
                    return Promise.reject(idInvalid);
                }
            });
        }),
        check('productName', 'El nombre del producto es obligatorio.').not().isEmpty(),
        // check('productDescription', 'La descripción del producto es obligatoria.').not().isEmpty(),
        check('productPrice', 'El precio del producto es obligatorio.').not().isEmpty(),
        check('productPrice', 'El precio del producto debe ser un número.').isNumeric(),
        check('productStock', 'El stock del producto es obligatorio.').not().isEmpty(),
        check('productStock', 'El stock del producto debe ser un número.').isInt(),
        check('productCategories', 'La categoría del producto es obligatoria.').isArray({ min: 1 }),
        // check('productIsActive', 'EL estado debe ser true o false.').isBoolean(),
        // check('productIsHighLight', 'EL estado destacado debe ser true o false.').isBoolean(),

        validateFields
    ],
    updateProduct
);

router.put(
    '/isActive',
    [
        check('productId').custom(value => {
            return Product.findById(value).then(product => {
              if (!product) {
                return Promise.reject(idInvalid);
             }
            });
          }),
        check('productIsActive').isBoolean(),
        validateFields
    ],
    updateProductActiveState
);

router.get('/highlight', async (req, res) => {
    try {
        const productList = await Product
            .aggregate([
                { $match: { productIsHighLight: true, productIsActive: true } },
                {
                    $lookup: {
                        from: 'images',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'images'
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'productCategories',
                        foreignField: '_id',
                        as: 'categories'
                    }
                }
            ])

        res.status(200).json({
            ok: true,
            productList
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
})


router.get('/name/:productName', async (req, res) => {
    let { productName } = req.params;

    try {
        const products = await Product
            .aggregate([
                // {'$regex' : '^string$'}
                { $match: { productName: { $regex: '.*' + productName + '.*', '$options': 'i' }, productIsActive: true } },
                {
                    $lookup: {
                        from: 'images',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'images'
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'productCategories',
                        foreignField: '_id',
                        as: 'categories'
                    }
                }
            ])
        res.json(products)
    } catch (error) {
        res.status(400).json({ err: 'Ha ocurrido un error.' })
    }
})
router.get('/nameAll/:productName', async (req, res) => {
    let { productName } = req.params;
    
    try {
        const products = await Product
        .aggregate([
            // {'$regex' : '^string$'}
            {$match: { productName : { $regex: '.*' + productName + '.*', '$options' : 'i' } }},
            {$lookup: {
                from: 'images',
                localField:  '_id',
                foreignField:'productId',
                as: 'images'
            }},
            {$lookup: {
                from: 'categories',
                localField: 'productCategories',
                foreignField: '_id',
                as: 'categories'
            }}
        ])
        res.json(products)
    } catch (error) {
        res.status(400).json({err: 'Ha ocurrido un error.'})
    }
})

router.get('/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await Product
            .aggregate([
                {
                    $lookup: {
                        from: "categories",
                        pipeline: [
                            { $match: { $or: [{ _id: ObjectId(categoryId) }, { categorySupId: ObjectId(categoryId) }] } }
                        ],
                        as: "categories"
                    }
                }
            ])
        res.json(products)

    } catch (error) {
        console.log(error)
        res.status(400).json({ err: 'Ha ocurrido un error.' })
    }
})

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const productList = await Product
        .aggregate([
            {$match: { _id:  ObjectId(productId) }},
            {$lookup: {
                from: 'images',
                localField:  '_id',
                foreignField:'productId',
                as: 'images'
            }},
            {$lookup: {
                from: 'categories',
                localField: 'productCategories',
                foreignField: '_id',
                as: 'categories'
            }}
        ])        

        res.status(200).json({
            ok: true,
            productList
        })
    } catch (error) {
        // console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const productList = await Product
            .aggregate([
                // {$match: {productIsHighLight: true, productIsActive:true}},
                {
                    $lookup: {
                        from: 'images',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'images'
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'productCategories',
                        foreignField: '_id',
                        as: 'categories'
                    }
                }
            ])
        // .find()
        // .populate({path:'productCategories', select: '_id categoryName categoryIsActive', populate: { path: 'categorySupId', select: '_id categoryName categoryIsActive' }})
        res.status(200).json({
            ok: true,
            productList
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
})




module.exports = router;