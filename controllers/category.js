const Category = require("../models/Category")

const getCategoriesBySup = async (categoryId) => {

    return await Category.find({ categoryIdSup: categoryId })
}


const getCategoryById = async (categoryId) => {
    return await Category.findById(categoryId)
}

const listActiveCategories = async () => {
    // Category.
}
// console.log(getCategoryById('6290d82d6655f25f6df9a9f6'))
module.exports = {
    getCategoriesBySup,
    getCategoryById
}