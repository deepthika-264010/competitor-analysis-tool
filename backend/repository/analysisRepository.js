const pool = require("../config/db");

async function getAnalysis(company) {

    const result = await pool.query(
        `
        SELECT *
        FROM company_analysis
        WHERE LOWER(company_name)=LOWER($1)
        `,
        [company]
    );

    return result.rows[0];
}

async function saveAnalysis(
    company,
    websiteData,
    competitors,
    latestNews,
    swot
) {

    await pool.query(
        `
        INSERT INTO company_analysis
        (
            company_name,
            website_data,
            competitors,
            latest_news,
            swot,
            updated_at
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            NOW()
        )

        ON CONFLICT(company_name)

        DO UPDATE SET

            website_data = EXCLUDED.website_data,

            competitors = EXCLUDED.competitors,

            latest_news = EXCLUDED.latest_news,

            swot = EXCLUDED.swot,

            updated_at = NOW()
        `,
        [
            company,
            JSON.stringify(websiteData),
            JSON.stringify(competitors),
            JSON.stringify(latestNews),
            JSON.stringify(swot)
        ]
    );

}

// ----------------------------
// Save last analyzed company
// ----------------------------
async function setLastCompany(company) {

    await pool.query(
        `
        UPDATE app_state
        SET last_company = $1
        WHERE id = 1
        `,
        [company]
    );

}

// ----------------------------
// Get last analyzed company
// ----------------------------
async function getLastCompany() {

    const result = await pool.query(
        `
        SELECT last_company
        FROM app_state
        WHERE id = 1
        `
    );

    return result.rows[0]?.last_company;

}

module.exports = {
    getAnalysis,
    saveAnalysis,
    setLastCompany,
    getLastCompany
};