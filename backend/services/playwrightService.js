const { chromium } = require("playwright");

async function scrapeWebsite(url) {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    try {

        await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 60000
        });

        const title = await page.title();

        const description = await page.evaluate(() => {

            const meta =
                document.querySelector('meta[name="description"]') ||
                document.querySelector('meta[property="og:description"]');

            return meta
                ? meta.content
                : "No description available";

        });

        const headings = await page.locator("h1").evaluateAll(elements =>
            elements
                .map(el => el.textContent.trim())
                .filter(Boolean)
        );

        const subHeadings = await page.locator("h2").evaluateAll(elements =>
            elements
                .map(el => el.textContent.trim())
                .filter(Boolean)
        );

        const navigation = await page.locator("nav a").evaluateAll(elements =>
            elements
                .map(el => el.textContent.trim())
                .filter(Boolean)
        );

        const links = await page.locator("a").evaluateAll(elements =>
            elements
                .map(el => ({
                    text: el.textContent.trim(),
                    href: el.href
                }))
                .filter(link => link.text)
        );

        return {
            title,
            description,
            headings,
            subHeadings,
            navigation,
            links
        };

    }
    catch (error) {

        console.error("Playwright Error:", error.message);

        return {

            title: "",
            description: "Unable to scrape website",
            headings: [],
            subHeadings: [],
            navigation: [],
            links: []

        };

    }
    finally {

        await browser.close();

    }

}

module.exports = {
    scrapeWebsite
};