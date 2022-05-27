const { Router } = require("express");
const Product = require('../models/Product');
const Product_Category = require("../models/Product_Category");

const router = Router();


router.post('/new', async (req, res) => {
    const { productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories } = req.body;
    try {
    
        const newPorduct = new Product({productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight})   
        await newPorduct.save()

        res.status(201).json({
            ok: true,
            porduct: newPorduct,
            cat: pCategory,
            productCategories
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
})

//TODO: add ProductCategory en el insert del product, TRANSACTION BULKSAVE


router.get('/', async (req, res) => {
    try {
        const productList = await Product.find()
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