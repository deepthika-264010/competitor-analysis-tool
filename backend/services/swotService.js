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

Return ONLY valid JSON.

Example:

{
  "strengths": {
    "score": 85,
    "points": [
      "...",
      "...",
      "..."
    ]
  },
  "weaknesses": {
    "score": 40,
    "points": [
      "...",
      "...",
      "..."
    ]
  },
  "opportunities": {
    "score": 72,
    "points": [
      "...",
      "...",
      "..."
    ]
  },
  "threats": {
    "score": 35,
    "points": [
      "...",
      "...",
      "..."
    ]
  }
}

Rules:

- score must be between 0 and 100.
- Return JSON only.
- Do not include markdown.
- Do not include explanations.
`;

    try {

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

        const match = content.match(/\{[\s\S]*\}/);

        if (!match) {
            throw new Error("No JSON found.");
        }

        return JSON.parse(match[0]);

    }
    catch (error) {

        console.error(error);

        return {

            strengths: {
                score: 0,
                points: []
            },

            weaknesses: {
                score: 0,
                points: []
            },

            opportunities: {
                score: 0,
                points: []
            },

            threats: {
                score: 0,
                points: []
            }

        };

    }

}

module.exports = {
    generateSWOT
};