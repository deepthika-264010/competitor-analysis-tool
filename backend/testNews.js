require("dotenv").config();

const newsService = require("./services/newsService");

async function test() {

    const news = await newsService.getNews("Microsoft");

    console.log(news);

}

test();