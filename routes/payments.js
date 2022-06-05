const { Router } = require('express');
const { check } = require('express-validator');
const router = Router()
const mercadopago = require("mercadopago");
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const { createOrder, getCarritoByUser, updateCarrito, orderEntered } = require('../controllers/order');
const User = require('../models/Users');
const Product = require('../models/Product');
const Order = require('../models/Order');
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
    // console.log(req.body)
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
/**
{
  userId: '629a6e92b98b31e4c460864b',
  orderTotal: 186471,
  shippingAddressId: '',
  cart: [
    {
      _id: '6290d8e06655f25f6df9a9f8',
      quantity: 2,
      productPrice: 20001,
      productName: 'Celular ZTEA'
    },
    {
      _id: '6290d9a66655f25f6df9a9fc',
      quantity: 1,
      productPrice: 146469,
      productName: 'Celular Xiaomi Redmi Note 10 PRO 8GB + 128 GB Onyx Grey'
    }
  ]
}
 */
router.post('/order',
    [
        check("userId", "El id del usuario es obligatorio").not().isEmpty(),
        check('userId').custom(value => {
            return User.findById(value).then(user => {
                if (!user) {
                    return Promise.reject('No hay un usuario con ese id.');
                }
            });
        }),
        // check("shippingAddressId", "La direccion de envio es obligatorio").not().isEmpty(),
        // check("shippingAddressId").custom(value => {
        //     return Address.findById(value).then(address => {
        //         if (!address) {
        //             return Promise.reject('No hay una direccion con ese id.');
        //         }
        //     });
        // }),
        check("orderTotal", "El total de la orden es obligatorio").not().isEmpty(),
        check("orderTotal").isNumeric(),
        check("cart", "Los items de la orden son obligatorios").isArray({min: 1}),
        check("cart.*._id", "El id del producto es obligatorio").not().isEmpty(),
        check("cart.*._id").custom(value => {
            return Product.findById(value).then(product => {
                if (!product) {
                    return Promise.reject('No hay un producto con ese id.');
                }
            });
        }),
        check("cart.*.productPrice", "El precio del producto es obligatorio").not().isEmpty(),
        check("cart.*.productPrice").isNumeric(),
        check("cart.*.quantity", "La cantidad del producto es obligatorio").not().isEmpty(),
        check("cart.*.quantity").isNumeric(),
        validateFields,
        validateJWT
    ],
    createOrder
)

router.get(
    '/order/carrito/:userId',
    [
        check("userId", "El id del usuario es obligatorio").not().isEmpty(),
        check('userId').custom(value => {
            return User.findById(value).then(user => {
                if (!user) {
                    return Promise.reject('No hay un usuario con ese id.');
                }
            });
        }),
        validateFields,
        validateJWT
    ],
    getCarritoByUser
)


router.put('/order/updatecarrito',
    [
        check("orderId", "El id de la orden es obligatorio").not().isEmpty(),
        check('orderId').custom(value => {
            return Order.findById(value).then(order => {
                if (!order) {
                    return Promise.reject('No hay una orden con ese id.');
                }
            });
        }),
        check("cart", "Los items de la orden son obligatorios").isArray({min: 1}),
        check("cart.*._id", "El id del producto es obligatorio").not().isEmpty(),
        check("cart.*._id").custom(value => {
            return Product.findById(value).then(product => {
                if (!product) {
                    return Promise.reject('No hay un producto con ese id.');
                }
            });
        }),
        check("cart.*.productPrice", "El precio del producto es obligatorio").not().isEmpty(),
        check("cart.*.productPrice").isNumeric(),
        check("cart.*.quantity", "La cantidad del producto es obligatorio").not().isEmpty(),
        check("cart.*.quantity").isNumeric(),
        validateFields,
        validateJWT
    ],
    updateCarrito
)

router.get('/entered',
[
    check("orderId", "El id de la orden es obligatorio").not().isEmpty(),
    check('orderId').custom(value => {
        return Order.findById(value).then(order => {
            if (!order) {
                return Promise.reject('No hay una orden con ese id.');
            }
        });
    }),
    validateFields,
    validateJWT
],
orderEntered
)
module.exports = router;
