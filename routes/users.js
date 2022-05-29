const { Router } = require('express');
const { check, body, request } = require('express-validator');

const User = require('../models/Users');
const { createUser, updateUser } = require('../controllers/user');
const { validateFields } = require('../middlewares/validateFields');
const { firstNameReq, lastNameReq, idInvalid } = require('../controllers/errMsg');
const router = Router();

router.post(
    '/new',
    [
        check('email', 'El email es obligatorio.').not().isEmpty(),
        check('email', 'El email no es válido.').isEmail(),
        check('email').custom(value => {
            return User.find({email:value}).then(user => {
              if (user.length>0) {
                return Promise.reject('Ya hay un usuario con ese email.');
             }
            });
          }),
        check('password', 'La contraseña es obligatoria.').not().isEmpty(),
        check('password', 'La contraseña debe tener al menos 7 caracteres.')
            .not()
            .isIn(['123456', 'password1', 'god123'])
            .withMessage('No es una constraseña segura')
            .isLength({ min: 6 })
            .matches(/\d/),
        check('firstName', firstNameReq).not().isEmpty(),
        check('lastName', lastNameReq).not().isEmpty(),
        validateFields
    ],
     createUser
);
router.put(
    '/',
    [
        check('id').custom(value => {
            return User.findById(value).then(user => {
              if (user.length<1) {
                return Promise.reject(idInvalid);
             }
            });
          }),
        check('firstName', firstNameReq).not().isEmpty(),
        check('lastName', lastNameReq).not().isEmpty(),
        validateFields
    ],
     updateUser
);


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('_id email isActive isAdmin creationDate isGoogle firstName lastName isSuperAdmin');
        res.status(201).json(user);
    } catch (error) {
        res.status(404).send('No existe un usuario con el id seleccionado')

    }
});


router.get('/auth', async (req, res) => {
    const { email, password } = req.body;



})

module.exports = router;