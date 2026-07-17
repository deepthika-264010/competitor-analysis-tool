function createSummary(websiteData) {
    return {
        title: websiteData.title,
        description: websiteData.description,
        headings: websiteData.headings.slice(0, 5),
        subHeadings: websiteData.subHeadings.slice(0, 8),
        navigation: websiteData.navigation
            .filter(item =>
                !item.toLowerCase().includes("privacy") &&
                !item.toLowerCase().includes("cookies") &&
                !item.toLowerCase().includes("terms") &&
                !item.toLowerCase().includes("support")
            )
            .slice(0, 10)
    };
}

module.exports = {
    createSummary
};