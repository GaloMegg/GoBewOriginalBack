const { Router } = require("express");
const { getCompany, createCompany, updateCompany, getActiveCompany } = require("../controllers/company");

const router = Router();


router.post("/", createCompany);

router.get("/getActive", getActiveCompany)
router.get("/:companyId", getCompany)

router.put("/:companyId", updateCompany)


module.exports = router;