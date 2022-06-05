const Address = require("../models/Address");
const Order = require("../models/Order");

const createUserAddress = async (req, res) => {
    const { userId, addressComment, orderId } = req.body;
    const addressIsShipping = true;
    const addressIsBilling = true;
    const session = await Order.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        const newAddress = new Address({ userId, addressComment, addressIsShipping, addressIsBilling }, opts);
        await newAddress.save();
        await Order.findByIdAndUpdate(orderId, { shippingAddressId: newAddress._id }, opts);

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            ok: true,
            newAddress,
            orderId
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


const addressListByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const addresses = await Address.find({ userId });
        res.status(201).json({
            ok: true,
            addresses
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: error
        });
    }

}
const addressGetByOrderId = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        const address = await Address.findById(order.shippingAddressId);

        res.status(201).json({
            ok: true,
            orderId,
            address
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: error
        });
    }
}
module.exports = {
    createUserAddress,
    addressListByUserId,
    addressGetByOrderId
}