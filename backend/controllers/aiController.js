const aiService = require("../services/aiService");

async function chat(req, res) {

    const message = req.body.message;

    const response = await aiService.chat(message);

    res.json({
        response
    });

}

module.exports = {
    chat
};