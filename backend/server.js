require("dotenv").config();
require("./config/db");
const express = require("express");
const cors = require("cors");
const companyAnalysisRoutes =require("./routes/companyAnalysisRoutes");
const companyRoutes = require("./routes/companyRoutes");
const aiRoutes = require("./routes/aiRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Competitor Intelligence Backend is Running!");
});

app.use(companyRoutes);
app.use(aiRoutes);
app.use(companyAnalysisRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
