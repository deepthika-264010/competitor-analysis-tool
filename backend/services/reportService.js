function buildReport(company, websiteData, latestNews) {

    let report = "";

    report += `Company: ${company}\n\n`;

    report += "========== WEBSITE ==========\n";

    report += `Title: ${websiteData.title || "N/A"}\n`;

    report += `Description: ${websiteData.description || "N/A"}\n\n`;

    report += "========== MAIN HEADINGS ==========\n";

    if (websiteData.headings && websiteData.headings.length > 0) {

        websiteData.headings.forEach(heading => {

            report += `• ${heading}\n`;

        });

    }

    report += "\n";

    report += "========== NAVIGATION ==========\n";

    if (websiteData.navigation && websiteData.navigation.length > 0) {

        websiteData.navigation
            .slice(0, 15)
            .forEach(item => {

                report += `• ${item}\n`;

            });

    }

    report += "\n";

    report += "========== LATEST NEWS ==========\n";

    if (latestNews && latestNews.length > 0) {

        latestNews.forEach(news => {

            report += `• ${news.title}\n`;

            report += `Source: ${news.source}\n`;

            report += `${news.description || ""}\n\n`;

        });

    }

    return report;

}

module.exports = {

    buildReport

};