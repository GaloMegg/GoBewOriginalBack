const { Router } = require("express");
const Images = require("../models/Images");
const Product = require('../models/Product');

const router = Router();


router.post('/new', async (req, res) => {
    const { productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories } = req.body;
    try {
    
        const newPorduct = new Product({productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories})   
        await newPorduct.save()

        res.status(201).json({
            ok: true,
            porduct: newPorduct
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
})
router.get('/highlight', async (req, res) => {
    try {
        const productList = await Product
                        .aggregate([
                            {$match: {productIsHighLight: true, productIsActive:true}},
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
        const products = await Product.find({ productName : { $regex: '.*' + productName + '.*' } })
        res.json(products)
    } catch (error) {
        res.status(400).json({err: 'Ha ocurrido un error.'})
    }
})

router.get('cat/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        // const products = await
    } catch (error) {
        
    }
})

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const productList = await Product
                                    .find({_id: productId})
                                    .populate({
                                        path:'productCategories', 
                                        select: '_id categoryName',
                                        match: { categoryIsActive: true},
                                        populate: { 
                                            path: 'categorySupId', 
                                            match: { categoryIsActive: true},
                                            select: '_id categoryName' 
                                        }})
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

router.get('/', async (req, res) => {
    try {
        const productList = await Product
            .aggregate([
                // {$match: {productIsHighLight: true, productIsActive:true}},
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




module.exports= router;