const competitorService = require("../services/competitorService");

function analyzeCompany(req, res) {

    const company = req.body.company;

    const competitors = competitorService.getCompetitors(company);

    res.json({
        company,
        competitors
    });
}

module.exports = {
    analyzeCompany
};