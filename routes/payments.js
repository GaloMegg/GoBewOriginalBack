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
    console.log("/pay", req.body)
    const { cart, orderTotal } = req.body
    //! req.body= {
    // !    userId: userResponse.userId,
    //  !   orderTotal: totalCart,
    //   !  orderState: 0,
    //    ! shippingAddress: null,
    //     !zip: null,
    //  !   cart
    // }
    //Cargar una orden en la base de datos y recuperar el ID 
    const id = "1234567asdasdasd89"



    let preferencesPer = {
        transaction_amount: orderTotal,
        items: cart.map(item => {
            return {
                title: item.productName,
                unit_price: item.productPrice,
                quantity: item.quantity,
            }
        }
        ),
        // Esto debe ser el ID de la base de datos de la orden
        external_reference: id,
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
    // {
    //     collection_id: '1251735767',
    //     collection_status: 'approved',
    // !   payment_id: '1251735767',
    // !   status: 'approved',
    // !   external_reference: '1234567asdasdasd89',
    //     payment_type: 'credit_card',
    //     merchant_order_id: '4891524835',
    //     preference_id: '1135343864-853663a1-142c-4824-901b-51fad1f0c8c8',
    //     site_id: 'MLA',
    //     processing_mode: 'aggregator',
    //     merchant_account_id: 'null'
    //   }


    res.redirect("http://localhost:3000/")

})
router.get('/failure', (req, res) => {
    //? por query recibo el id el status la EXTERNAL REFERENCE que va a ser el ID de la orden en la base de datos y la merchant order ID
    //! buscar en la base de datos la orden con ese ID (External reference) y en la RESPUESTA devolver a 
    //*res.redirect(FRONT_URL/compra fallida)
    res.redirect("http://localhost:3000/")

})
router.get('/pending', (req, res) => {
    //? por query recibo el id el status la EXTERNAL REFERENCE que va a ser el ID de la orden en la base de datos y la merchant order ID
    //! buscar en la base de datos la orden con ese ID (External reference) y en la RESPUESTA devolver a
    //*res.redirect(FRONT_URL/compra pendiente)
    res.redirect("http://localhost:3000/")
})
module.exports = router;
