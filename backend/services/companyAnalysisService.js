const websiteService = require("./websiteService");
const playwrightService = require("./playwrightService");
const newsService = require("./newsService");
const companyExtractor = require("./companyExtractor");
const competitorService = require("./competitorService");
const swotService = require("./swotService");
const companySummaryService = require("./companySummaryService");

const analysisRepository = require("../repository/analysisRepository");

async function analyzeCompany(message) {

    // Extract company name
    const company = companyExtractor.extractCompany(message);

    if (!company) {
        return {
            success: false,
            message: "Company not found."
        };
    }

    // ==================================================
    // STEP 1 : Check Database
    // ==================================================

    const existingAnalysis = await analysisRepository.getAnalysis(company);

    if (existingAnalysis) {

        console.log("✅ Analysis loaded from PostgreSQL");
    await analysisRepository.setLastCompany(company);
        return {
            success: true,
            company: existingAnalysis.company_name,
            website: websiteService.getWebsite(existingAnalysis.company_name),
            websiteData: existingAnalysis.website_data,
            competitors: existingAnalysis.competitors,
            latestNews: existingAnalysis.latest_news,
            swot: existingAnalysis.swot
        };
    }

    console.log("❌ Company not found in DB");
    console.log("🔍 Performing fresh analysis...");

    // ==================================================
    // STEP 2 : Fresh Analysis
    // ==================================================

    const website = websiteService.getWebsite(company);

    let websiteData = {};

    if (website) {
        websiteData = await playwrightService.scrapeWebsite(website);
    }

    websiteData = companySummaryService.createSummary(websiteData);

    const latestNews = await newsService.getNews(company);

    const competitors = await competitorService.getCompetitors(company);

    const swot = await swotService.generateSWOT(
        company,
        websiteData,
        competitors,
        latestNews
    );

    // ==================================================
    // STEP 3 : Save to PostgreSQL
    // ==================================================

    await analysisRepository.saveAnalysis(
        company,
        websiteData,
        competitors,
        latestNews,
        swot
    );
    await analysisRepository.setLastCompany(company);
    console.log("💾 Analysis saved to PostgreSQL");

    // ==================================================
    // STEP 4 : Return Result
    // ==================================================

    return {

        success: true,

        company,

        website,

        websiteData,

        competitors,

        latestNews,

        swot

    };

}

module.exports = {
    analyzeCompany
};