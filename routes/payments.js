const { Router } = require('express');
const router = Router()
const mercadopago = require("mercadopago")
require('dotenv').config()
// curl -X POST -H "Content-Type: application/json" "https://api.mercadopago.com/users/test_user?access_token=process.env.ACCESS_TOKEN_TEST" -d "{'site_id':'MLA'}"

// {
//     "id":1135343864,
//     "nickname":"TESTBJDGFP2X",
//     "password":"qatest8792",
//     "site_status":"active",
//     "email":"test_user_88823899@testuser.com"
// } // !VENDEDOR

// {"id":1135402335,
// "nickname":"TEST51JAI1FW",
// "password":"qatest3386",
// "site_status":"active",
// "email":"test_user_46812042@testuser.com"
// } // !COMPRADOR

mercadopago.configure({ access_token: process.env.ACCESS_TOKEN_TEST })

router.post('/pay', async (req, res) => {
    // const { cart } = 
    console.log(req.body)
    const id = 10
    //Cargar una orden en la base de datos y recuperar el ID 

    let preferencesPer = {
        transaction_amount: req.body.reduce((a, b) => a + b.price * b.quantity, 0),
        items: req.body.map(item => {
            return {
                title: item.productName,
                unit_price: item.productPrice,
                quantity: item.quantity,
            }
        }
        ),
        // Esto debe ser el ID de la base de datos de la orden
        external_references: `${id}`,
        back_urls: {
            success: `http://localhost:4000/payments/success`,
            failure: `http://localhost:4000/payments/failure`,
            pending: `http://localhost:4000/payments/pending`
        },
        payment_methods: {
            excluded_payment_methods: [
                { id: "atm" },
                { id: "ticket" }
            ],
            installments: 1
        }
    }
    mercadopago.preferences.create(preferencesPer).then(response => {
        res.json({ global: response.body.id })
    })
})

router.get('/success', (req, res) => {
    //? por query recibo el id, el status, la EXTERNAL REFERENCE que va a ser el ID de la orden en la base de datos, y la merchant order ID
    //! buscar en la base de datos la orden con ese ID (External reference) y en la RESPUESTA devolver a 
    //*res.redirect(FRONT_URL/compra realizada)

})
router.get('/failure', (req, res) => {
    //? por query recibo el id el status la EXTERNAL REFERENCE que va a ser el ID de la orden en la base de datos y la merchant order ID
    //! buscar en la base de datos la orden con ese ID (External reference) y en la RESPUESTA devolver a 
    //*res.redirect(FRONT_URL/compra fallida)

})
router.get('/pending', (req, res) => {
    //? por query recibo el id el status la EXTERNAL REFERENCE que va a ser el ID de la orden en la base de datos y la merchant order ID
    //! buscar en la base de datos la orden con ese ID (External reference) y en la RESPUESTA devolver a
    //*res.redirect(FRONT_URL/compra pendiente)
})
module.exports = router;
