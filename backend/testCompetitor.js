require("dotenv").config();

const competitorService = require("./services/competitorService");

async function test() {

    const competitors =
        await competitorService.getCompetitors("Microsoft");

    console.log(competitors);

}

test();