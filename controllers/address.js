const Address = require("../models/Address");

const createUserAddress = async (req, res) => {
    const { userId, addressComment } = req.body;
    
    try {
        const newAddress = new Address({userId, addressComment});
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


module.exports = {
    createUserAddress
}