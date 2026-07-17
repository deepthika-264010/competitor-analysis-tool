require("dotenv").config();

const OpenAI = require("openai");

console.log("HF_API_KEY:", process.env.HF_API_KEY ? "Loaded ✅" : "Not Loaded ❌");
console.log("HF_MODEL:", process.env.HF_MODEL);

const client = new OpenAI({
    apiKey: process.env.HF_API_KEY,
    baseURL: "https://router.huggingface.co/v1"
});

async function test() {
    try {
        const response = await client.chat.completions.create({
            model: process.env.HF_MODEL,
            messages: [
                {
                    role: "user",
                    content: "Say hello."
                }
            ]
        });

        console.log(response.choices[0].message.content);

    } catch (err) {
        console.error(err);
    }
}

test();