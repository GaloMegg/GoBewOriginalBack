const { Router } = require('express');
const { check } = require('express-validator');

const User = require('../models/Users');
const { createUser, updateUser, loginUser, loginUserGoogle, loginUserAdmin, renewToken, updateUserActiveState } = require('../controllers/user');
const { validateFields } = require('../middlewares/validateFields');
const { firstNameReq, lastNameReq, idInvalid } = require('../controllers/errMsg');
const { validateJWT } = require('../middlewares/validateJWT');
const { sendEmail } = require('../controllers/sendEmail');
const router = Router();

router.post(
    '/new',
    [
        check('userEmail', 'El email es obligatorio.').not().isEmpty(),
        check('userEmail', 'El email no es válido.').isEmail(),
        check('userEmail').custom(value => {
            return User.find({ userEmail: value }).then(user => {
                if (!user) {
                    return Promise.reject('Ya hay un usuario con ese email.');
                }
            });
        }),
        check('userPassword', 'La contraseña es obligatoria.').not().isEmpty(),
        check('userPassword', 'La contraseña debe tener al menos 6 caracteres.')
            .not()
            .isIn(['123456', 'password1', 'god123'])
            .withMessage('No es una constraseña segura')
            .isLength({ min: 5 }),
        // .matches(/\d/),
        check('userFirstName', firstNameReq).not().isEmpty(),
        check('userLastName', lastNameReq).not().isEmpty(),
        validateFields
    ],
    createUser
);
router.post(
    '/newGoogle',
    [
        check('userEmail', 'El email es obligatorio.').not().isEmpty(),
        check('userEmail', 'El email no es válido.').isEmail(),
        check('userEmail').custom(value => {
            return User.find({userEmail:value}).then(user => {
              if (!user) {
                return Promise.reject('Ya hay un usuario con ese email.');
             }
            });
          }),
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
                if (!user) {
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
router.put(
    '/isActive',
    [
        check('userId').custom(value => {
            return User.findById(value).then(user => {
                if (!user) {
                    return Promise.reject(idInvalid);
                }
            });
        }),
        check('userIsActive').isBoolean(),
        validateFields
    ],
    updateUserActiveState
);

router.post(
    '/auth',
    [
        check('userEmail', 'El email es obligatorio').isEmail(),
        check('userPassword', 'El password debe tener al menos 6 letras').isLength({ min: 6 }),
        validateFields
    ],
    loginUser
)
router.post(
    '/authGoogle', 
    [
        check('userEmail', 'El email es obligatorio').isEmail(),
        // check('userPassword', 'El password debe tener al menos 6 letras').isLength({ min: 6 }),
        validateFields
    ],
    loginUserGoogle
)
router.post(
    '/authAdmin',
    [
        check('userEmail', 'El email es obligatorio').isEmail(),
        check('userPassword', 'El password debe tener al menos 6 letras').isLength({ min: 6 }),
        validateFields
    ],
    loginUserAdmin
)
// router.get('/adminRenew',validateJWT, renewToken);
router.get('/renew',validateJWT, renewToken);

router.put(
    '/activate',
    
    [
        check('userId.*.hash.*.userEmail').custom(value => {
            return User.find(value).then(user => {
              if (!user) {
                return Promise.reject(idInvalid);
             }
            });
          })
    ]
    
)

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            ok: true,
            users
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error: ' + error
        })
    }

})

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('_id userEmail userIsActive userIsAdmin userCreationDate userIsGoogle userFirstName userLastName userIsSuperAdmin');
        res.status(201).json(user);
    } catch (error) {
        res.status(404).send('No existe un usuario con el id seleccionado')

    }
});



module.exports = router;