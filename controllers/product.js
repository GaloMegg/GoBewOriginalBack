const Product = require('../models/Product');
const createProduct = async (req, res) => {
    const { productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories } = req.body;
    try {
    
        const newProduct = new Product({productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories})   
        await newProduct.save()

        res.status(201).json({
            ok: true,
            product: newProduct
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Ya existe un producto con ese nombre'
        })
    }
}
const updateProduct = async (req, res) => {
    // console.log('entro a updateProduct')
    const { productId, productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories } = req.body;
    try {
        const productToUpdate={productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories}    
        // console.log(productToUpdate)
        const product = await Product.findByIdAndUpdate(productId, productToUpdate, { new: true })

        res.status(201).json({
            ok: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            // msg: error
            msg: 'Ocurrió un error, el producto no pudos ser modificado.'
        })
    }
}

const updateProductActiveState = async (req, res) => {
    const { productId, productIsActive } = req.body;
    try {
        
        const product = await Product.findByIdAndUpdate(productId, {productIsActive}, { new: true })

        res.status(201).json({
            ok: true,
            product
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    updateProductActiveState
}