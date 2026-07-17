const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.HF_API_KEY,
    baseURL: "https://router.huggingface.co/v1"
});

async function generateSWOT(company, websiteData, competitors, latestNews) {

    const prompt = `
You are an expert business analyst.

Generate a SWOT analysis for the following company.

Company:
${company}

Website Title:
${websiteData.title || ""}

Website Description:
${websiteData.description || ""}

Main Headings:
${(websiteData.headings || []).slice(0, 10).join(", ")}

Competitors:
${(competitors || []).join(", ")}

Latest News:
${(latestNews || [])
    .slice(0, 5)
    .map(news => news.title)
    .join("\n")}

Return ONLY valid JSON in this format:

{
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "opportunities": [
    "...",
    "...",
    "..."
  ],
  "threats": [
    "...",
    "...",
    "..."
  ]
}

Do not include markdown.
Do not include explanations.
Return JSON only.
`;

    try {

        console.log("Using Model:", process.env.HF_MODEL);

        const completion = await client.chat.completions.create({
            model: process.env.HF_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3
        });

        const content = completion.choices[0].message.content;

        console.log("Raw SWOT Response:");
        console.log(content);

        // Extract JSON even if extra text exists
        const match = content.match(/\{[\s\S]*\}/);

        if (!match) {
            throw new Error("No JSON found in AI response.");
        }

        return JSON.parse(match[0]);

    } catch (error) {

        console.error("SWOT Error:");
        console.error(error);

        return {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: []
        };
    }
}

module.exports = {
    generateSWOT
};