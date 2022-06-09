const createReview = (req, res) => {

    const { productId, userId, reviewStars, reviewComment } = req.body;

    try {
        const review = new Review({
            productId,
            userId,
            reviewStars,
            reviewComment
        })
        await review.save();
        res.status(201).json({
            ok: true,
            review
        })
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: error
        })
    }
}



listProductReviews = async (req, res) => {
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




module.exports = {
    createReview,
    listProductReviews
}