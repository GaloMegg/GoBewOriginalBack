const Faq = require('../models/FAQ');

const createFaq = async (req, res) => {
    const { faqTitle, faqDescription, faqOrder } = req.body;

    try {
        const newFaq = new Faq({ faqTitle, faqDescription, faqOrder })
        await newFaq.save()

        res.status(200).json({
            ok: true,
            faq: newFaq
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
}



module.exports = {
    createFaq
}