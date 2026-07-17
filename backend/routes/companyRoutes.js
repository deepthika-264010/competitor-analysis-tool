const express = require("express");

const router = express.Router();

const companyController = require("../controllers/companyController");

router.post("/analyze", companyController.analyzeCompany);

module.exports = router;