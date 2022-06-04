const Address = require("../models/Address");

const createUserAddress = async (req, res) => {
    const { userId, addressComment } = req.body;
    const addressIsShipping = true;
    const addressIsBilling = true;
    try {
        const newAddress = new Address({userId, addressComment, addressIsShipping, addressIsBilling});
        await newAddress.save();
        res.status(201).json({
            ok: true,
            newAddress
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: error
        });
    }
}


const addressListByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const addresses = await Address.find({userId});
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

module.exports = {
    createUserAddress,
    addressListByUserId
}