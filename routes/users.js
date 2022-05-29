const { Router } = require('express');
const User = require('../models/Users');

const router = Router();

router.post('/new', async (req, res) => {
    try {
        const newUser = new User(req.body)
        await newUser.save()

        res.status(201).json({
            ok: true,
            user: newUser
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
});


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