const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderProduct = require("../models/orderProduct");
const Product = require("../models/Product");
const Image = require("../models/Images");
const { emailSender } = require("./sendEmail");
const { subjectPaidAccepted, subjectOrderEntered, htmlOrderEntered, htmlPaidAccepted, subjectPaidRejected, htmlPaidRejected,
    subjectOrderDelivered, htmlOrderDelivered, htmlOrderArrived, subjectOrderArrived, htmlOrderCancelled, subjectPaidCancelled } = require("./mailMsg");
const { objCarritoToReturn } = require("./orderAux");
const ObjectId = mongoose.Types.ObjectId;

const createOrder = async (req, res) => {
    const { userId, orderTotal } = req.body;

    const session = await Order.startSession();
    session.startTransaction();
    try {

        const opts = { session };
        const newOrder = new Order({ userId, orderTotal, orderState: 0 });
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
            { $match: { userId: ObjectId(userId), orderState: 0 } },
            // {$match: { $or: [{userId: ObjectId(userId),orderState:0}, {userId: ObjectId(userId),orderState:1}] }},
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'cart'
                }
            }
        ])
    if (!order) {
        return res.status(404).json({
            ok: false,
            msg: 'El usuario no tiene un carrito de compras'
        })
    }

    const products = order[0]?.cart?.map(item => item.productId)
    if (!products) return res.status(404).json({ ok: false, msg: 'El usuario no tiene un carrito de compras' })

    // const productsDB = await Product.find({_id: {$in: products}}).select('_id productName productStock')
    // const productsImage = await Image.find({productId: {$in: products}}).select('_id productId imageName imageAlt imageIsPrimary imageOrder')
    const productsDB = await Product
        .aggregate([
            { $match: { _id: { $in: products } } },
            {
                $lookup: {
                    from: 'images',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'images'
                }
            }])
    // console.log(productsDB)
    const obj = objCarritoToReturn(order[0], productsDB)

    res.status(200).json({
        ok: true,
        obj
    })
}


//trae la orden por id
const getCarritoByOrder = async (orderId) => {
    const order = await Order
        .aggregate([
            { $match: { _id: ObjectId(orderId) } },
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'cart'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ])
    if (!order) {
        throw {
            ok: false,
            msg: 'No existe una orden con ese id'
        }
    }
    const products = order[0]?.cart?.map(item => item.productId)

    if (!products) throw { ok: false, msg: 'El usuario no tiene un carrito de compras' }
    const productsDB = await Product.find({ _id: { $in: products } }).select('_id productName productStock')
    const obj = { ...objCarritoToReturn(order[0], productsDB) }
    return {
        ok: true,
        obj
    }
}

const updateCarrito = async (req, res) => {
    const { orderId, orderTotal } = req.body;
    const session = await Order.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        await OrderProduct.deleteMany({ orderId: ObjectId(orderId) }, opts);
        const order = await Order.findByIdAndUpdate(orderId, { orderTotal }, opts);

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
const orderEntered = async (req, res) => {
    const { orderId } = req.query;
    try {
        await updateOrderState(orderId, 1);
        // const order = await getCarritoByOrder(orderId);
        // const html =  htmlOrderEntered(order.obj)
        // const email = order.obj.user[0].userEmail
        // await emailSender(subjectOrderEntered, html, email)
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
const orderPaid = async (req, res) => {
    const { external_reference, payment_id, payment_type } = req.query;

    try {
        await updateOrderState(external_reference, 2, payment_id, payment_type)
        const order = await getCarritoByOrder(external_reference);
        const html = htmlPaidAccepted(order.obj)
        const email = order.obj.user[0].userEmail
        await emailSender(subjectPaidAccepted, html, email)
        res.redirect(`${process.env.URL_SITE_FRONT}order/${external_reference}`)
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}
//TODO: probar correo de rechazo de pago
//Estado 5 => PAGO RECHAZADO
const orderPaidRejected = async (req, res) => {
    const { external_reference } = req.query;
    // console.log(external_reference)
    try {
        await updateOrderState(external_reference, 5)
        const order = await getCarritoByOrder(external_reference);
        const html = htmlPaidRejected(order.obj)
        const email = order.obj.user[0].userEmail
        await emailSender(subjectPaidRejected, html, email)
        res.redirect(`${process.env.URL_SITE_FRONT}order/${external_reference}`)
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}
//TODO: enviar correo de orden pendiende de pago de pago
//Estado 7 => PAGO PENDIENTE
const orderPaidPending = async (req, res) => {
    const { external_reference } = req.query;
    try {
        await updateOrderState(external_reference, 7)

        res.redirect(`${process.env.URL_SITE_FRONT}order/${external_reference}`)
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

//TODO: fciones para cambiar estado cancelado, enviado, entregado (todas con su email)
//Estado 3 => ENVIADA
const orderDelivered = async (req, res) => {
    const { orderId } = req.query;
    try {
        await updateOrderState(orderId, 3);
        const order = await getCarritoByOrder(orderId);
        const html = htmlOrderDelivered(order.obj)
        const email = order.obj.user[0].userEmail
        await emailSender(subjectOrderDelivered, html, email)
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
//Estado 4 => RECIBIDA
const orderArrived = async (req, res) => {
    const { orderId } = req.query;
    try {
        await updateOrderState(orderId, 4);
        const order = await getCarritoByOrder(orderId);
        const html = htmlOrderArrived(order.obj)
        const email = order.obj.user[0].userEmail
        await emailSender(subjectOrderArrived, html, email)
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
//Estado 6 => CANCELADA
const orderCancelled = async (req, res) => {
    const { orderId } = req.query;
    try {
        await updateOrderState(orderId, 6);
        const order = await getCarritoByOrder(orderId);
        // console.log(order)
        const html = htmlOrderCancelled(order.obj)
        const email = order.obj.user[0].userEmail
        await emailSender(subjectPaidCancelled, html, email)
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

// Order state
// 0 Carrito
// 1 ingresada (restar al stock la cant)
// 2 pago aceptado
// 3 enviada
// 4 recibida
// 5 rechazada (al rechazar sumar al stock)
// 6 cancelada
// 7 pendiente de aprobación
const updateOrderState = async (orderId, orderState, payment_id = null, payment_type = null) => {
    const date = new Date();
    let session;
    // const orderDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    switch (orderState) {
        //INGRESADA
        case 1:
            await Order.findByIdAndUpdate(orderId, { orderState: 1, orderCreationDate: date });
            break;
        //PAGO ACEPTADO
        case 2:
            session = await Order.startSession();
            session.startTransaction();
            try {
                const opts = { session };

                await Order.findByIdAndUpdate(orderId, {orderState: 2, orderCreationDate: date, orderAceptDate: date, payment_id, payment_type}, opts);
                const orderProducts = await OrderProduct.find({orderId: ObjectId(orderId)},null, opts);
                await Promise.all(orderProducts.map(item =>Product.findByIdAndUpdate(item.productId, {"$inc":{productStock:-Number(item.productCant)}}, {new: true, opts})))

                await session.commitTransaction();
                session.endSession();
                return {
                    ok: true
                }
            } catch (error) {
                await session.abortTransaction();
                session.endSession();

                return {
                    ok: false,
                    msg: error
                }
            }

        //ENVIADA
        case 3:
            await Order.findByIdAndUpdate(orderId, {orderState: 3, orderDeliverDate: date}, {new: true});
            break;
        //RECIBIDA
        case 4:
            await Order.findByIdAndUpdate(orderId, {orderState: 4, orderArrivalDate: date}, {new: true});
            break;
        //RECHAZADA
        case 5:
            await Order.findByIdAndUpdate(orderId, {orderState: 5, orderRejectDate: date, orderCreationDate: date}, {new: true});
            break;
        //CANCELADA
        case 6:
            session = await Order.startSession();
            session.startTransaction();
            // console.log(6)
            try {
                const opts = { session };

                await Order.findByIdAndUpdate(orderId, {orderState: 6, orderCancelDate: date}, {new: true});
                const orderProducts = await OrderProduct.find({orderId: ObjectId(orderId)},null, opts);
                await Promise.all(orderProducts.map(item =>Product.findByIdAndUpdate(item.productId, {"$inc":{productStock:+Number(item.productCant)}}, {new: true, opts})))

                await session.commitTransaction();
                session.endSession();
                return {
                    ok: true
                }
            } catch (error) {
                await session.abortTransaction();
                session.endSession();

                return {
                    ok: false,
                    msg: error
                }
            }
            
        //PENDIENTE DE APROBACION
        case 7:
            await Order.findByIdAndUpdate(orderId, {orderState: 7, orderPendingDate: date, orderCreationDate: date}, {new: true});
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
        await OrderProduct.deleteMany({ orderId: ObjectId(orderId) }, opts);
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

const getOrderById = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await getCarritoByOrder(orderId)
        // console.log(order)
        res.json(order)
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

const getAllOrders = async (req, res) => {
    const { orderState } = req.query;
    const matchState = orderState ? { orderState: Number(orderState) } : {};
    try {
        const order = await Order

            .aggregate([
                { $match: matchState },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'orderproducts',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderproducts'
                    }
                },
                {
                    $unwind: {
                        path: "$orderproducts",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderproducts.productId',
                        foreignField: '_id',
                        as: 'orderproducts.products'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        orderState: { $first: "$orderState" },
                        orderTotal: { $first: "$orderTotal" },
                        orderCreationDate: { $first: "$orderCreationDate" },
                        orderAceptDate: { $first: "$orderAceptDate" },
                        orderDeliverDate: { $first: "$orderDeliverDate" },
                        orderCancelDate: { $first: "$orderCancelDate" },
                        user: { $first: "$user" },
                        orderproducts: { $push: "$orderproducts" }
                    }
                },

                {
                    "$project": {
                        "_id": 1,
                        "orderState": 1,
                        "orderTotal": 1,
                        "orderCreationDate": 1,
                        "orderAceptDate": 1,
                        "orderDeliverDate": 1,
                        "orderCancelDate": 1,
                        "user._id": 1,
                        "user.userEmail": 1,
                        "user.userFirstName": 1,
                        "user.userLastName": 1,
                        "orderproducts._id": 1,
                        "orderproducts.orderId": 1,
                        "orderproducts.productId": 1,
                        "orderproducts.productCant": 1,
                        "orderproducts.productPrice": 1,
                        "orderproducts.products._id": 1,
                        "orderproducts.products.productName": 1,
                    }
                },
            ])

        if (!order) {
            throw {
                ok: false,
                msg: 'No hay ordenes de compra ingresadas'
            }
        }
        res.json(order)
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

const getAllOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const order = await Order

            .aggregate([
                { $match: { userId: ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'orderproducts',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderproducts'
                    }
                },
                {
                    $unwind: {
                        path: "$orderproducts",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderproducts.productId',
                        foreignField: '_id',
                        as: 'orderproducts.products'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        orderState: { $first: "$orderState" },
                        orderTotal: { $first: "$orderTotal" },
                        orderCreationDate: { $first: "$orderCreationDate" },
                        orderAceptDate: { $first: "$orderAceptDate" },
                        orderDeliverDate: { $first: "$orderDeliverDate" },
                        orderCancelDate: { $first: "$orderCancelDate" },
                        orderproducts: { $push: "$orderproducts" }
                    }
                },

                {
                    "$project": {
                        "_id": 1,
                        "orderState": 1,
                        "orderTotal": 1,
                        "orderCreationDate": 1,
                        "orderAceptDate": 1,
                        "orderDeliverDate": 1,
                        "orderCancelDate": 1,
                        "orderproducts._id": 1,
                        "orderproducts.orderId": 1,
                        "orderproducts.productId": 1,
                        "orderproducts.productCant": 1,
                        "orderproducts.productPrice": 1,
                        "orderproducts.products._id": 1,
                        "orderproducts.products.productName": 1,
                    }
                }

            ])

        if (!order) {
            throw {
                ok: false,
                msg: 'No hay ordenes de compra ingresadas'
            }
        }
        res.json(order)
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: error
        })
    }
}

const updateShippingId = async (req, res) => {
    const { orderId, shippingAddressId } = req.body;
    // console.log(orderId, shippingAddressId)
    try {
        await Order.findByIdAndUpdate(orderId, { shippingAddressId });
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

module.exports = {
    createOrder,
    getCarritoByUser,
    updateCarrito,
    orderEntered,
    orderPaid,
    orderPaidRejected,
    deleteOrder,
    orderPaidPending,
    getOrderById,
    getAllOrders,
    updateShippingId,
    orderDelivered,
    orderArrived,
    orderCancelled,
    getAllOrdersByUser
}