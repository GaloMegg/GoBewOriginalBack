const { Router }= require("express");
const { check } = require("express-validator");
const { updateWishList, getWishListByUser, getWishListAllByUser } = require("../controllers/wishList");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const User = require("../models/Users");
const Product = require("../models/Product");

const router = Router();

router.post('/new',
[
    check("userId", "El usuario es obligatorio").not().isEmpty(),
    check('userId').custom(value => {
      
        return User.findById(value).then(user => {
          if (user.lenght === 0) {
            return Promise.reject('No hay un usuario con ese id.');
          }
        });
      }),
    check("productId", "El producto es obligatorio").not().isEmpty(),
    check('productId').custom(value => {
        
          return Product.findById(value).then(product => {
            if (product.lenght === 0) {
                return Promise.reject('No hay un producto con ese id.');
            }
          })
    }),
    validateFields,
    validateJWT
],
updateWishList
);


router.get('/getByUser/:userId',
    [
        check("userId", "El id es obligatorio").not().isEmpty(),
        validateFields,
        validateJWT
    ],
    getWishListByUser
)

router.get('/getAllByUser/:userId',
    [
        check("userId", "El id es obligatorio").not().isEmpty(),
        validateFields,
        validateJWT
    ],
    getWishListAllByUser
)




module.exports = router;