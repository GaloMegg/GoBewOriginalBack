const Address = require("../models/Address");
const Order = require("../models/Order");

const createUserAddress = async (req, res) => {
    const { userId, addressComment,addressStreet, addressNumber, addressFloor, addressFlat, addressCity, addressZipCode, addressProvince, orderId } = req.body;
    const addressIsShipping = true;
    const addressIsBilling = true;

    
    const session = await Order.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        const newAddress = new Address({ userId, addressComment, addressIsShipping, addressIsBilling, addressStreet, addressNumber, addressFloor, addressFlat, addressCity, addressZipCode, addressProvince }, opts);
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

const updateUserAddress = async (req, res) => {
    const { addressId } = req.params; 
    const { addressComment,addressStreet, addressNumber, addressFloor, addressFlat, addressCity, addressZipCode, addressProvince } = req.body;
    const addressIsShipping = true;
    const addressIsBilling = true;
    try {
        const address = await Address.findByIdAndUpdate(addressId, { addressComment, addressIsShipping, addressIsBilling, addressStreet, addressNumber, addressFloor, addressFlat, addressCity, addressZipCode, addressProvince }, { new: true });
        res.status(201).json({
            ok: true,
            address
        })
        
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: 'No se pudo acutalizar la dirección.'
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
    addressGetByOrderId,
    updateUserAddress
}