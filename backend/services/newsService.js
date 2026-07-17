const axios = require("axios");

async function getNews(company) {

    try {

        const response = await axios.get(
            "https://newsapi.org/v2/everything",
            {
                params: {
                   q: company,
    qInTitle: company,
    language: "en",
    sortBy: "publishedAt",
    pageSize: 5,
    apiKey: process.env.NEWS_API_KEY
                }
            }
        );

        const articles = response.data.articles
    .filter(article => {

        const title = (article.title || "").toLowerCase();
        const description = (article.description || "").toLowerCase();
        const companyName = company.toLowerCase();

        return (
            title.includes(companyName) ||
            description.includes(companyName)
        );

    })
    .map(article => ({
        title: article.title,
        description: article.description,
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url
    }));

        return articles;

    }
    catch(error){

        console.error(error.response?.data || error.message);

        return [];

    }

}

module.exports = {

    getNews

};