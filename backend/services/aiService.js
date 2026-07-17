const OpenAI = require("openai");

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_API_KEY,
});

const companyExtractor = require("./companyExtractor");
const analysisRepository = require("../repository/analysisRepository");

async function chat(message) {

    console.log("========== AI CHAT ==========");
    console.log("User Message:", message);

    try {

        // Try to extract company from the question
        let company = companyExtractor.extractCompany(message);

        console.log("Extracted Company:", company);

        // If no company is mentioned, use the last analyzed company
        if (!company) {
            company = await analysisRepository.getLastCompany();
            console.log("Last Company From DB:", company);
        }

        // No company available
        if (!company) {
            return "Please analyze a company first.";
        }

        // Load analysis from PostgreSQL
        const analysis = await analysisRepository.getAnalysis(company);

        console.log("Analysis Found:", !!analysis);

        if (!analysis) {
            return `No analysis found for ${company}. Please analyze the company first.`;
        }

        // Ask the LLM
        const completion = await client.chat.completions.create({

            model: process.env.HF_MODEL,

            messages: [

                {
                    role: "system",
                    content: `
You are an AI Competitor Intelligence Assistant.

You are provided with structured company analysis.

Answer ONLY the user's question.

Rules:

- Do NOT generate the full report unless the user asks for it.
- Keep answers short and professional.
- If asked about competitors, return only competitors.
- If asked about SWOT, return only SWOT.
- If asked about news, return only news.
- If asked about website insights, return only website insights.
- Use Markdown formatting.
- Never invent information.
- If the answer is unavailable, say:
"This information is not available in the stored company analysis."
`
                },

                {
                    role: "user",
                    content: `
Company Name:
${analysis.company_name}

Website Data:
${JSON.stringify(analysis.website_data, null, 2)}

Competitors:
${JSON.stringify(analysis.competitors, null, 2)}

Latest News:
${JSON.stringify(analysis.latest_news, null, 2)}

SWOT:
${JSON.stringify(analysis.swot, null, 2)}

User Question:
${message}

Answer ONLY the user's question.
`
                }

            ],

            temperature: 0.3,
            max_tokens: 500

        });

        console.log("AI Response Generated");

        return completion.choices[0].message.content;

    }
    catch (error) {

        console.error("========== AI SERVICE ERROR ==========");
        console.error(error);

        return "Unable to answer your question.";

    }

}

module.exports = {
    chat
};