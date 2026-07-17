const companies = [

    "Microsoft",
    "Google",
    "Apple",
    "Amazon",
    "Tesla",
    "Oracle",
    "IBM",
    "Salesforce"

];

function extractCompany(message) {

    const lower = message.toLowerCase();

    for (const company of companies) {

        if (lower.includes(company.toLowerCase())) {

            return company;

        }

    }

    return null;

}

module.exports = {
    extractCompany
};