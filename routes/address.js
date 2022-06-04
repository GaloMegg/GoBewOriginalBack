const { Router } = require("express");
const { check } = require("express-validator");
const { createUserAddress } = require("../controllers/address");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");
const User = require("../models/Users");
const router = Router();


router.post(
    "/", 
    [
        check("userId", "El id del usuario es obligatorio").not().isEmpty(),
        check('userId').custom(value => {
          console.log(value);
            return User.findById(value).then(user => {
              if (!user) {
                return Promise.reject('Ya hay un usuario con ese id.');
             }
            });
          }),
        check("addressComment", "El comentario es obligatorio").not().isEmpty(),
        validateFields,
        validateJWT
    ],
    createUserAddress)


module.exports = router;