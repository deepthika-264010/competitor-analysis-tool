const companyAnalysisService = require("../services/companyAnalysisService");

async function analyzeCompany(req, res) {

    try {

        const { message } = req.body;

        const result =
            await companyAnalysisService.analyzeCompany(message);

        res.json(result);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to analyze company."

        });

    }

}

module.exports = {

    analyzeCompany

};