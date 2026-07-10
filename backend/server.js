const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Competitor Intelligence Backend is Running!");
});

app.post("/analyze", (req, res) => {

    console.log(req.body);

    res.json({
        message: "Company received successfully"
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});