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
        res.json({
            ok:false,
            msg: error
        })
    }
}
const updateProduct = async (req, res) => {
    const { productId, productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories } = req.body;
    try {
    
        const productToUpdate={productName, productIsActive, productDescription, productPrice, productStock, productIsHighLight, productCategories}    
        const product = await Product.findByIdAndUpdate(productId, productToUpdate, { new: true })

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
    updateProduct
}