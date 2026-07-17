const express = require("express");

const router = express.Router();

const companyAnalysisController =
require("../controllers/companyAnalysisController");

router.post(

    "/analyze-company",

    companyAnalysisController.analyzeCompany

);

module.exports = router;