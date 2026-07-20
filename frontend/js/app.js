// =========================================
// Elements
// =========================================

const analyzeBtn = document.getElementById("analyzeBtn");
const askBtn = document.getElementById("askBtn");

const companyInput = document.getElementById("message");
const chatInput = document.getElementById("chatQuestion");

const loading = document.getElementById("loading");
const chatBox = document.getElementById("chatBox");

const companyOverview = document.getElementById("companyOverview");
const companyDetails = document.getElementById("companyDetails");
const competitorsDiv = document.getElementById("competitors");
const latestNewsDiv = document.getElementById("latestNews");

const currentCompany = document.getElementById("currentCompany");
const companyNameCard = document.getElementById("companyNameCard");
const competitorCount = document.getElementById("competitorCount");
const newsCount = document.getElementById("newsCount");
const statusCard = document.getElementById("statusCard");

let competitorChart = null;
let newsChart = null;

// =========================================
// Events
// =========================================

analyzeBtn.addEventListener("click", analyzeCompany);
askBtn.addEventListener("click", askQuestion);

companyInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        analyzeCompany();
    }

});

chatInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        askQuestion();
    }

});

// =========================================
// Analyze Company
// =========================================

async function analyzeCompany() {

    const company = companyInput.value.trim();

    if (!company) {

        alert("Please enter a company name.");
        return;

    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    loading.style.display = "block";

    try {

        const response = await fetch("https://competitor-analysis-tool-1.onrender.com/analyze-company", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: company

            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message || "Unable to analyze company.");

            return;

        }

        updateDashboard(data);

        displayCompanyOverview(data);

        displayCompanyDetails(data);

        displayCompetitors(data.competitors);

        displayLatestNews(data.latestNews);

        displaySWOT(data.swot);

        createCharts(data);

        showPage("dashboardPage");

    }

    catch (error) {

        console.error(error);

        alert("Unable to analyze company.");

    }

    finally {

        analyzeBtn.disabled = false;

        analyzeBtn.textContent = "Analyze Company";

        loading.style.display = "none";

    }

}

// =========================================
// Dashboard
// =========================================

function updateDashboard(data) {

    currentCompany.textContent = data.company;

    companyNameCard.textContent = data.company;

    competitorCount.textContent =

        data.competitors ? data.competitors.length : 0;

    newsCount.textContent =

        data.latestNews ? data.latestNews.length : 0;

    statusCard.textContent = "Completed";

}

// =========================================
// Company Overview
// =========================================

function displayCompanyOverview(data) {

    companyOverview.innerHTML = `

        <h2>${data.company}</h2>

        <br>

        <p>

            <strong>Website :</strong>

            <a href="${data.website}" target="_blank">

                ${data.website}

            </a>

        </p>

        <br>

        <p>

            ${data.websiteData.description || "No description available."}

        </p>

    `;

}

// =========================================
// Company Details
// =========================================

function displayCompanyDetails(data) {

    companyDetails.innerHTML = `

        <div class="details-grid">

            <div class="detail-item">

                <h4>Company</h4>

                <p>${data.company}</p>

            </div>

            <div class="detail-item">

                <h4>Website</h4>

                <p>

                    <a href="${data.website}" target="_blank">

                        ${data.website}

                    </a>

                </p>

            </div>

            <div class="detail-item">

                <h4>Website Title</h4>

                <p>

                    ${data.websiteData.title || "N/A"}

                </p>

            </div>

            <div class="detail-item">

                <h4>Description</h4>

                <p>

                    ${data.websiteData.description || "N/A"}

                </p>

            </div>

        </div>

        <br>

        <h3>Main Headings</h3>

        <br>

        <ul>

            ${(data.websiteData.headings || [])

                .map(item => `<li>${item}</li>`)

                .join("")}

        </ul>

    `;

}

// =========================================
// Competitors
// =========================================

function displayCompetitors(list) {

    if (!list || list.length === 0) {

        competitorsDiv.innerHTML = "<p>No competitors found.</p>";

        return;

    }

    competitorsDiv.innerHTML = list.map(company => `

        <div class="competitor-card">

            <h3>${company}</h3>

            <p>Competitor</p>

        </div>

    `).join("");

}

// =========================================
// Latest News
// =========================================

function displayLatestNews(news) {

    if (!news || news.length === 0) {

        latestNewsDiv.innerHTML = "<p>No news found.</p>";

        return;

    }

    latestNewsDiv.innerHTML = news.map(article => `

        <div class="news-card">

            <h3>${article.title}</h3>

            <p>

                ${article.description || "No description available."}

            </p>

            <a href="${article.url}" target="_blank">

                Read More →

            </a>

        </div>

    `).join("");

}
// =========================================
// SWOT
// =========================================

function displaySWOT(swot) {

    if (!swot) return;

    document.getElementById("strengthsList").innerHTML =
        (swot.strengths.points || [])
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("weaknessesList").innerHTML =
        (swot.weaknesses.points || [])
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("opportunitiesList").innerHTML =
        (swot.opportunities.points || [])
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("threatsList").innerHTML =
        (swot.threats.points || [])
            .map(item => `<li>${item}</li>`)
            .join("");

}
// =========================================
// Analytics Charts
// =========================================

function createCharts(data) {
    
    const competitorCanvas =
        document.getElementById("competitorChart");

    /*const newsCanvas =
        document.getElementById("newsChart");*/

    if (competitorChart)
        competitorChart.destroy();

    /*if (newsChart)
        newsChart.destroy();
console.log("Complete Response");
console.log(data);
console.log("SWOT");
console.log(data.swot);
    // ===============================
    // SWOT SCORE CHART
    // ===============================
console.log([
    data.swot.strengths.score,
    data.swot.weaknesses.score,
    data.swot.opportunities.score,
    data.swot.threats.score
]);*/
    competitorChart = new Chart(competitorCanvas, {

        type: "bar",

        data: {

            labels: [

                "Strengths",

                "Weaknesses",

                "Opportunities",

                "Threats"

            ],

            datasets: [{

                label: "SWOT Score",

                data: [

                    data.swot.strengths.score,

                    data.swot.weaknesses.score,

                    data.swot.opportunities.score,

                    data.swot.threats.score

                ],

    backgroundColor: [
        "#4CAF50",
        "#F44336",
        "#2196F3",
        "#FF9800"
    ],

    borderColor: [
        "#4CAF50",
        "#F44336",
        "#2196F3",
        "#FF9800"
    ],

    borderWidth: 1

            }]
            

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    });

    // ===============================
    // NEWS SENTIMENT
    // ===============================

    /*newsChart = new Chart(newsCanvas, {

        type: "doughnut",

        data: {

            labels: [

                "Positive",

                "Neutral",

                "Negative"

            ],

            datasets: [{

                data: [

                    data.sentiment.positive,

                    data.sentiment.neutral,

                    data.sentiment.negative

                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });*/

}

// =========================================
// AI Chat
// =========================================

async function askQuestion() {

    const question = chatInput.value.trim();

    if (!question) return;

    appendUserMessage(question);

    chatInput.value = "";

    askBtn.disabled = true;

    askBtn.textContent = "Thinking...";

    try {

        const response = await fetch(
            "http://localhost:3000/chat",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    message: question

                })

            }
        );

        const data = await response.json();

        appendAIMessage(marked.parse(data.response));

    }

    catch (error) {

        console.error(error);

        appendAIMessage("Unable to contact server.");

    }

    finally {

        askBtn.disabled = false;

        askBtn.textContent = "Send";

    }

}

// =========================================
// Chat Helpers
// =========================================

function appendUserMessage(message) {

    chatBox.innerHTML += `

        <div class="user-message">

            ${message}

        </div>

    `;

    chatBox.scrollTop = chatBox.scrollHeight;

}

function appendAIMessage(message) {

    chatBox.innerHTML += `

        <div class="ai-message">

            ${message}

        </div>

    `;

    chatBox.scrollTop = chatBox.scrollHeight;

}

// =========================================
// Navigation
// =========================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {

        page.style.display = "none";
        if(pageId==="analyticsPage"){

    setTimeout(()=>{

        if(competitorChart){

            competitorChart.resize();

        }

        if(newsChart){

            newsChart.resize();

        }

    },100);

}

    });

    document.querySelectorAll(".sidebar-menu li").forEach(item => {

        item.classList.remove("active");

    });

    const page = document.getElementById(pageId);

    if (page) {

        page.style.display = "block";

    }

    const menuItems = document.querySelectorAll(".sidebar-menu li");

    switch (pageId) {

        case "dashboardPage":
            menuItems[0].classList.add("active");
            break;

        case "companiesPage":
            menuItems[1].classList.add("active");
            break;

        case "newsPage":
            menuItems[2].classList.add("active");
            break;

        case "swotPage":
            menuItems[3].classList.add("active");
            break;

        case "analyticsPage":
            menuItems[4].classList.add("active");
            break;

        case "chatPage":
            menuItems[5].classList.add("active");
            break;

    }

}

// =========================================
// Initial Page
// =========================================

showPage("dashboardPage");