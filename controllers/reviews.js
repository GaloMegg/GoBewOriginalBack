const Review = require('../models/Reviews');

const createReview = async (req, res) => {

    const { productId, userId, reviewStars, reviewComment, orderId } = req.body;

    try {
        const review = new Review({
            productId,
            userId,
            orderId,
            reviewStars,
            reviewComment
        })
        await review.save();
        res.status(201).json({
            ok: true,
            review
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            ok: false,
            msg: error
        })
    }
}



const listProductReviews = async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.find({ productId });
        res.status(201).json({
            ok: true,
            reviews
        })
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: error
        })
    }
}


const listOrderReviews = async (req, res) => {
    const { orderId } = req.params;
    try {
        const reviews = await Review.find({ orderId });
        res.status(201).json({
            ok: true,
            reviews
        })
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: error
        })
    }
            
}

module.exports = {
    createReview,
    listProductReviews,
    listOrderReviews
}