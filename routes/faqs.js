const { Router } = require("express");
const { check } = require("express-validator");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const { createFaq } = require("../controllers/faq");
const { validateFields } = require("../middlewares/validateFields");
const FAQ = require("../models/FAQ");

// const Images = require("../models/Images");
const Product = require('../models/Product');
const router = Router();

const ObjectId = mongoose.Types.ObjectId;

router.post(
    '/new',
    [
        check('faqTitle', 'El titulo de la FAQ es obligatorio').not().isEmpty(),
        check('faqDescription', 'La descripcion es obligatoria').not().isEmpty(),
        check('faqOrder', 'El orden debe ser un numero').isInt(),
        validateFields
    ],
    createFaq
);

router.get('/', async (req, res) => {
    try {
        const faqList = await FAQ.find()
        
        res.status(200).json({
            ok: true,
            faqList
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
})


module.exports = router 
