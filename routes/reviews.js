const { Router } = require("express");
const { check } = require("express-validator");
const { createReview } = require("../controllers/reviews");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");
const User = require("../models/Users");
const router = Router();


router.post('/',
[
    check("userId", "El id del usuario es obligatorio").not().isEmpty(),
    check('userId').custom(value => {
        
        return User.findById(value).then(user => {
            if (!user) {
            return Promise.reject('Ya hay un usuario con ese id.');
            }
        });
    }),
    check('productId', "El id del producto es obligatorio").not().isEmpty(), 
    check('productId').custom(value => {
        return Product.findById(value).then(product => {
            if (!product) {
            return Promise.reject('Ya hay un producto con ese id.');
            }
        });
    }),
    check('reviewStars', "La calificación es obligatoria").not().isEmpty(),
    check('reviewStars', "La calificación debe ser un número").isNumeric(),
    check('reviewComment', "El comentario es obligatorio").not().isEmpty()
],
createReview)