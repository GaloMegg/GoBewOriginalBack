const { Router } = require("express");
const Product = require('../models/Product');
const Product_Category = require("../models/Product_Category");

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

//TODO: add ProductCategory en el insert del product, TRANSACTION BULKSAVE
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
                                    .find()
                                    .populate({path:'productCategories', select: '_id categoryName categoryIsActive', populate: { path: 'categorySupId', select: '_id categoryName categoryIsActive' }})
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

router.get('/highlight', async (req, res) => {
    try {
        const productList = await Product
                                    .find({productIsHighLight: true, productIsActive:true})
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


module.exports= router;