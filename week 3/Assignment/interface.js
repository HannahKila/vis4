
let total = 0;
let history = [];

// Update the result and operation history
function updateResults() {
    document.querySelector("#resultId").innerHTML = total;
    updateHistory();
}

// Display operation history
function updateHistory() {
    let historyContent = "";

    for (let i = 0; i < history.length; i++) {
        historyContent += "<li>" + history[i] + "</li>";
    }

    document.querySelector("#historyList").innerHTML = historyContent;
}

// Minus 2 button
document.getElementById("minusTwoBtn").addEventListener("click", function() {
    total = total - 2;
    history.push("-2");
    updateResults();
});

// Minus 1 button
document.getElementById("minusOneBtn").addEventListener("click", function() {
    total = total - 1;
    history.push("-1");
    updateResults();
});

// Plus 1 button
document.getElementById("plusOneBtn").addEventListener("click", function() {
    total = total + 1;
    history.push("+1");
    updateResults();
});

// Plus 2 button
document.getElementById("plusTwoBtn").addEventListener("click", function() {
    total = total + 2;
    history.push("+2");
    updateResults();
});

// Reset button
document.getElementById("resetBtn").addEventListener("click", function() {
    total = 0;
    history.push("Reset");
    updateResults();
});
