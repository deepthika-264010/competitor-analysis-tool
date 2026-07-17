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

// =========================================
// Events
// =========================================

analyzeBtn.addEventListener("click", analyzeCompany);
askBtn.addEventListener("click", askQuestion);

// =========================================
// Analyze Company
// =========================================

async function analyzeCompany() {

    const company = companyInput.value.trim();

    if (!company) {
        alert("Please enter a company name.");
        return;
    }

    loading.style.display = "block";

    try {

        const response = await fetch(
            "http://localhost:3000/analyze-company",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: company
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!data.success) {
            alert(data.message || "Unable to analyze company.");
            return;
        }

        displayCompanyOverview(data);
        displayCompanyDetails(data);
        displayCompetitors(data.competitors);
        displayLatestNews(data.latestNews);
        displaySWOT(data.swot);

        showPage("dashboardPage");

    }
    catch (error) {

        console.error(error);
        alert("Unable to analyze company.");

    }
    finally {

        loading.style.display = "none";

    }

}

// =========================================
// Company Overview
// =========================================

function displayCompanyOverview(data) {

    companyOverview.innerHTML = `
        <b>Company</b><br>
        ${data.company}

        <br><br>

        <b>Website</b><br>

        <a href="${data.website}" target="_blank">
            ${data.website}
        </a>
    `;

}

// =========================================
// Company Details
// =========================================

function displayCompanyDetails(data) {

    companyDetails.innerHTML = `

        <h3>${data.company}</h3>

        <p>
            <strong>Website :</strong>
            <a href="${data.website}" target="_blank">
                ${data.website}
            </a>
        </p>

        <p>

            <strong>Title :</strong>

            ${data.websiteData.title || "N/A"}

        </p>

        <p>

            <strong>Description :</strong>

            ${data.websiteData.description || "N/A"}

        </p>

        <h4>Main Headings</h4>

        <ul>

        ${(data.websiteData.headings || [])
            .map(h => `<li>${h}</li>`)
            .join("")}

        </ul>

    `;

}

// =========================================
// Competitors
// =========================================

function displayCompetitors(list) {

    if (!list || list.length === 0) {

        competitorsDiv.innerHTML = "No competitors found.";

        return;

    }

    competitorsDiv.innerHTML = `
        <ul>
            ${list.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;

}

// =========================================
// Latest News
// =========================================

function displayLatestNews(news) {

    if (!news || news.length === 0) {

        latestNewsDiv.innerHTML = "No news found.";

        return;

    }

    latestNewsDiv.innerHTML = news.map(article => `

        <div class="news-card">

            <h4>${article.title}</h4>

            <p>

                ${article.description || ""}

            </p>

            <a href="${article.url}" target="_blank">

                Read More

            </a>

            <hr>

        </div>

    `).join("");

}

// =========================================
// SWOT
// =========================================

function displaySWOT(swot) {

    if (!swot) return;

    document.getElementById("strengthsList").innerHTML =
        (swot.strengths || [])
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("weaknessesList").innerHTML =
        (swot.weaknesses || [])
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("opportunitiesList").innerHTML =
        (swot.opportunities || [])
            .map(item => `<li>${item}</li>`)
            .join("");

    document.getElementById("threatsList").innerHTML =
        (swot.threats || [])
            .map(item => `<li>${item}</li>`)
            .join("");

}

// =========================================
// Chat
// =========================================

async function askQuestion() {

    const question = chatInput.value.trim();

    if (!question) return;

    appendUserMessage(question);

    chatInput.value = "";

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

        appendAIMessage("❌ Unable to contact server.");

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

    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.style.display = "block";

    }

}