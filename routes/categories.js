const { Router } = require('express');
const Categories = require('../models/categories');

const router = Router();


router.post('/new', async (req, res) => {
    try {
    const newCategory = new Categories(req.body)   
    await newCategory.save()
        
        res.status(201).json({
            ok: true,
            category: newCategory
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
})

router.get('/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        
        const category = await Categories.findById(categoryId.toString())
        // if(!category) throw 'No existe una categoría con el id seleccionado.'
        // if(!category) res.status(404).send('No existe una categoría con el id seleccionado')

        res.status(201).json(category);
    } catch (error) {
        res.status(404).send('No existe una categoría con el id seleccionado')
        
    }
})


module.exports = router;