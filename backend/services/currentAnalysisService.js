let currentAnalysis = null;

function setAnalysis(data) {
    currentAnalysis = data;
}

function getAnalysis() {
    return currentAnalysis;
}

module.exports = {
    setAnalysis,
    getAnalysis
};