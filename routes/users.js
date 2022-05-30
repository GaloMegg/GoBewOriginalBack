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
        check('userEmail', 'El email es obligatorio.').not().isEmpty(),
        check('userEmail', 'El email no es válido.').isEmail(),
        check('userEmail').custom(value => {
            return User.find({userEmail:value}).then(user => {
              if (user.length>0) {
                return Promise.reject('Ya hay un usuario con ese email.');
             }
            });
          }),
        check('userPassword', 'La contraseña es obligatoria.').not().isEmpty(),
        check('userPassword', 'La contraseña debe tener al menos 7 caracteres.')
            .not()
            .isIn(['123456', 'password1', 'god123'])
            .withMessage('No es una constraseña segura')
            .isLength({ min: 6 })
            .matches(/\d/),
        check('userFirstName', firstNameReq).not().isEmpty(),
        check('userLastName', lastNameReq).not().isEmpty(),
        validateFields
    ],
     createUser
);
router.put(
    '/',
    [
        check('userId').custom(value => {
            return User.findById(value).then(user => {
              if (user.length<1) {
                return Promise.reject(idInvalid);
             }
            });
          }),
        check('userFirstName', firstNameReq).not().isEmpty(),
        check('userLastName', lastNameReq).not().isEmpty(),
        validateFields
    ],
     updateUser
);


router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('_id userEmail userIsActive userIsAdmin userCreationDate userIsGoogle userFirstName userLastName userIsSuperAdmin');
        res.status(201).json(user);
    } catch (error) {
        res.status(404).send('No existe un usuario con el id seleccionado')

    }
});


router.get('/auth', async (req, res) => {
    const { userEmail, userPassword } = req.body;



})

module.exports = router;