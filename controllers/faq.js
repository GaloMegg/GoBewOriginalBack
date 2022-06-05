const FAQ = require('../models/FAQ');
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

const updateFaq = async (req, res) => {
    const { faqTitle, faqDescription, faqOrder, faqId } = req.body;

    try {
        const faqToUpdate = { faqTitle, faqDescription, faqOrder }
        const faq = await FAQ.findByIdAndUpdate(faqId, faqToUpdate, { new: true })

        res.status(201).json({
            ok: true,
            faq: {
                faqTitle : faq.faqTitle,
                faqDescription: faq.faqDescription,
                faqOrder: faq.faqOrder,
                faqId: faq.faqId
            }
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
}

module.exports = {
    createFaq,
    updateFaq
}