const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.HF_API_KEY,
    baseURL: "https://router.huggingface.co/v1"
});

async function analyzeNews(news) {

    if (!news || news.length === 0) {
        return {
            positive: 0,
            neutral: 0,
            negative: 0
        };
    }

    const prompt = `
Analyze the sentiment of these business news articles.

Count how many articles are Positive, Neutral and Negative.

IMPORTANT:
Return ONLY a JSON object.
Do NOT use markdown.
Do NOT use \`\`\`json.
Do NOT write explanations.

Format:

{
  "positive":0,
  "neutral":0,
  "negative":0
}

News:

${news.map((article, index) => `
${index + 1}. ${article.title}
${article.description || ""}
`).join("\n")}

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

            temperature: 0.2

        });

        const content = completion.choices[0].message.content;

        let jsonText = content;

// Remove markdown if present
jsonText = jsonText.replace(/```json/g, "");
jsonText = jsonText.replace(/```/g, "");
jsonText = jsonText.trim();

return JSON.parse(jsonText);
    }
    catch (error) {

        console.error("Sentiment Error:", error);

        return {

            positive: 0,
            neutral: 0,
            negative: 0

        };

    }

}

module.exports = {

    analyzeNews

};