const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderProduct = require("../models/orderProduct");
const Product = require("../models/Product");
const ObjectId = mongoose.Types.ObjectId;

const createOrder = async (req, res) => {
    const { userId, orderTotal } = req.body;

    const session = await Order.startSession();
    session.startTransaction();
    try {
        
        const opts = { session };
        const newOrder = new Order({userId, orderTotal, orderState:0 });
        await newOrder.save(opts);

        const orderId = newOrder._id;
        const orderProduct = req.body.cart.map(item => {
            return {
                orderId,
                productId: item._id,
                productCant: item.quantity,
                productPrice: item.productPrice
            }
        })
        
        const cart = await OrderProduct.insertMany(orderProduct, opts);
        
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            ok: true,
            orderId: newOrder._id,
            userId: newOrder.userId,
            orderTotal: newOrder.orderTotal,
            shippingAddressId: '',
            cart
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(501).json({
            ok: false,
            msg: error
        });
    }
}

//Carrito es una orden con estado 0
const getCarritoByUser = async (req, res) => {
    const { userId } = req.params;
    const order = await Order
    .aggregate([
        {$match: {userId: ObjectId(userId),orderState:0}},
        {$lookup: {
            from: 'orderproducts',
            localField:  '_id',
            foreignField:'orderId',
            as: 'cart'            
        }}
    ])
    if(!order){
        return res.status(404).json({
            ok: false,
            msg: 'El usuario no tiene un carrito de compras'
        })
    }

    const products = order[0].cart.map(item =>  item.productId)
        
    const productsDB = await Product.find({_id: {$in: products}}).select('_id productName')
    // console.log(productsDB)
    const obj = {
        orderId : order[0]._id,
        _id : order[0]._id,
        orderState : order[0].orderState,
        orderTotal : order[0].orderTotal,
        userId : order[0].userId,
        shippingAddressId : order[0].shippingAddressId,
        cart : order[0].cart.map(item => {
            return {
                _id : item._id,
                productId : item.productId,
                productName: productsDB.filter(product => product._id.toString() === item.productId.toString())[0].productName,
                productCant : item.productCant,
                productPrice : item.productPrice
            }
        })
    }
  

    res.status(200).json({
        ok: true,
        obj
        // ,
        // order,
        // productsDB
    })
}
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
const updateCarrito = async (req, res) => {
    const { orderId, orderTotal } = req.body;
    // console.log(orderId, orderTotal)    
    const session = await Order.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        // console.log(1)
        await OrderProduct.deleteMany({orderId: ObjectId(orderId)}, opts);
        // console.log(2)
        const order = await Order.findByIdAndUpdate(orderId, {orderTotal}, opts);            
        // console.log(3)
        // console.log(order)       
        
        const orderProduct = req.body.cart.map(item => {
            return {
                orderId,
                productId: item._id,
                productCant: item.quantity,
                productPrice: item.productPrice
            }
        })
        
        const cart = await OrderProduct.insertMany(orderProduct, opts);
        
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            ok: true,
            orderId,
            userId: order.userId,
            orderTotal,
            shippingAddressId: '',
            cart
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(501).json({
            ok: false,
            msg: error
        });
    }   
}
//Estado 1 => COMPRA INGRESADA
//TODO: Enviar correo de compra ingresada (en proceso?)

const orderEntered = async (req, res) => {
    const { orderId } = req.query;
    try {
        await updateOrderState(orderId, 1)
        res.json({
            ok: true,
            orderId
        })
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}
//Estado 2 => PAGO ACEPTADO
//TODO: Enviar correo de confirmacion de pago

const orderPaid = async (req, res) => {
    const { external_reference, payment_id, payment_type } = req.query;
    
    try {
        await updateOrderState(external_reference, 2, payment_id, payment_type )
        res.json({
            ok: true,
            orderId: external_reference
        })
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

const orderPaidRejected = async (req, res) => {
    const { external_reference } = req.query;
    try {
        await updateOrderState(external_reference, 5)
        res.json({
            ok: true,
            orderId: external_reference
        })
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}
const orderPaidPending = async (req, res) => {
    const { external_reference } = req.query;
    try {
        await updateOrderState(external_reference, 7)
        res.json({
            ok: true,
            orderId: external_reference
        })
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

const updateOrderState = async (orderId, orderState, payment_id = null, payment_type = null) => {
    const date = new Date();
    const orderDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    // console.log(orderDate)
    switch (orderState) {
        case 1:
            await Order.findByIdAndUpdate(orderId, {orderState: 1, orderCreationDate: orderDate});
            break;
        case 2:
            const session = await Order.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                await Order.findByIdAndUpdate(orderId, {orderState: 2, orderAceptDate: orderDate, paymentId: payment_id, paymentType: payment_type}, opts);
                const orderProducts = await OrderProduct.find({orderId: ObjectId(orderId)},null, opts);
                // console.log(1, orderProducts)
                await Promise.all(orderProducts.map(item =>Product.findByIdAndUpdate(item.productId, {"$inc":{productStock:-Number(item.productCant)}}, {new: true, opts})))
                await session.commitTransaction();
                session.endSession();
                return {
                    ok: true
                }
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                // console.log(error)
                return {
                    ok: false,
                    msg: error
                }
            }
        case 5:
            await Order.findByIdAndUpdate(orderId, {orderState: 5, orderRejectDate: orderDate});
            break;
        case 7:
            await Order.findByIdAndUpdate(orderId, {orderState: 7, orderPendingDate: orderDate});
            break;
        default:
            break;
    }
}

const deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    const session = await Order.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        await OrderProduct.deleteMany({orderId: ObjectId(orderId)}, opts);
        await Order.findByIdAndDelete(orderId, opts);
        await session.commitTransaction();
        session.endSession();
        res.json({
            ok: true,
            orderId
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

module.exports = {
    createOrder,
    getCarritoByUser,
    updateCarrito,
    orderEntered,
    orderPaid,
    orderPaidRejected,
    deleteOrder,
    orderPaidPending
}