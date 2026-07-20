const OpenAI = require("openai");

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_API_KEY
});

async function getCompetitors(company) {
    try {

        console.log("Using Model:", process.env.HF_MODEL);

        const completion = await client.chat.completions.create({
            model: process.env.HF_MODEL,

            messages: [
                {
                    role: "system",
                    content: `
You are a business intelligence expert.

Return ONLY valid JSON.

Example:

{
  "competitors": [
    "Google",
    "Amazon",
    "Apple",
    "Oracle",
    "Salesforce"
  ]
}

Rules:
- Return exactly 5 competitors.
- No explanation.
- No markdown.
- No extra text.
`
                },
                {
                    role: "user",
                    content: `Find the top 5 competitors of ${company}.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        console.log("Raw AI Response:");
        console.log(content);

        // Extract JSON even if extra text exists
        const match = content.match(/\{[\s\S]*\}/);

        if (!match) {
            throw new Error("No JSON found in AI response.");
        }

        const result = JSON.parse(match[0]);

        return result.competitors || [];

    } catch (error) {

        console.error("Competitor Service Error:");
        console.error(error);

        return [];
    }
}

module.exports = {
    getCompetitors
};