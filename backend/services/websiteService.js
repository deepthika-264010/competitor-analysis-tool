const websites = {

    Microsoft: "https://www.microsoft.com",

    Google: "https://about.google",

    Apple: "https://www.apple.com",

    Amazon: "https://www.amazon.com"

};

function getWebsite(company){

    company =
        company.charAt(0).toUpperCase() +
        company.slice(1).toLowerCase();

    return websites[company];

}

module.exports = {

    getWebsite

};