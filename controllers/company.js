const Company = require("../models/Company");


const createCompany = async (req, res) => {
    const { companyName, companyEmail, companyPhone, companyAddress, companyDescription, companyFacebook, companyTwitter, companyInstagram, companyMap, companyIsActive } = req.body;
    // console.log(req.body);
    try {
        const newCompany = new Company({ companyName, companyEmail, companyPhone, companyAddress, companyDescription, companyFacebook, companyTwitter, companyInstagram, companyMap, companyIsActive });
        // console.log(newCompany);
        await newCompany.save();
        res.status(201).json({
            ok: true,
            company:{
                companyId: newCompany._id,
                companyName: newCompany.companyName,
                companyEmail: newCompany.companyEmail,
                companyPhone: newCompany.companyPhone,
                companyAddress: newCompany.companyAddress,
                companyDescription: newCompany.companyDescription,
                companyFacebook: newCompany.companyFacebook,
                companyTwitter: newCompany.companyTwitter,
                companyInstagram: newCompany.companyInstagram,
                companyMap: newCompany.companyMap,
                companyIsActive: newCompany.companyIsActive

            }
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: 'No se pudo crear la compañía'
        })
    }
}


const getActiveCompany = async (req, res) => {
    try {
        const company = await Company.find({ companyIsActive: true });
        res.status(201).json({
            ok: true,
            company : {
                companyId: company[0]._id,
                companyName: company[0].companyName,
                companyEmail: company[0].companyEmail,
                companyPhone: company[0].companyPhone,
                companyAddress: company[0].companyAddress,
                companyDescription: company[0].companyDescription,
                companyFacebook: company[0].companyFacebook,
                companyTwitter: company[0].companyTwitter,
                companyInstagram: company[0].companyInstagram,
                companyMap: company[0].companyMap,
                companyIsActive: company[0].companyIsActive
            }
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: 'No se pudo obtener la compañía'
        })
    }
}

const getCompany = async (req, res) => {
    const { companyId } = req.params;
    try {
        const company = await Company.findById(companyId.toString());
        res.status(201).json({
            ok: true,
            company: {
                companyId: company._id,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
                companyPhone: company.companyPhone,
                companyAddress: company.companyAddress,
                companyDescription: company.companyDescription,
                companyFacebook: company.companyFacebook,
                companyTwitter: company.companyTwitter,
                companyInstagram: company.companyInstagram,
                companyMap: company.companyMap,

            }
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: 'No se pudo obtener la compañía'
        })
    }
}


const updateCompany = async (req, res) => {
    const { companyId } = req.params;
    // console.log(companyId)
    const { companyName, companyEmail, companyPhone, companyAddress, companyDescription, companyFacebook, companyTwitter, companyInstagram, companyMap, companyIsActive } = req.body;
    // console.log(req.body);
    try {
        const company = await Company.findByIdAndUpdate(companyId, { companyName, companyEmail, companyPhone, companyAddress, companyDescription, companyFacebook, companyTwitter, companyInstagram, companyMap, companyIsActive });
        res.status(201).json({
            ok: true,
            company
        });
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: 'No se pudo actualizar la compañía'
        })
    }
}

module.exports = {
    createCompany,
    getCompany,
    updateCompany,
    getActiveCompany
}