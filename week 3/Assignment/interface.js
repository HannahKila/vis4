
let total = 0;
let history = [];

let operationCount = {
    additions: 0,
    subtractions: 0
};

// Update the entire interface
function updateResults() {
    document.querySelector("#resultId").innerHTML = total;

    updateHistory();
    updateSummary();
    checkTotal();
}

// Step 1: Display operation history
function updateHistory() {
    let historyContent = "";

    for (let i = 0; i < history.length; i++) {
        historyContent += "<li>" + history[i] + "</li>";
    }

    document.querySelector("#historyList").innerHTML = historyContent;
}

// Step 2: Display operation summary
function updateSummary() {
    document.querySelector("#summary").innerHTML =
        `Total additions: ${operationCount.additions}, <br>
         Total subtractions: ${operationCount.subtractions}`;
}

// Step 3: Check whether total is positive, negative, or zero
function checkTotal() {
    if (total > 0) {
        document.querySelector("#totalMessage").innerHTML =
            "The total is positive.";
    } else if (total < 0) {
        document.querySelector("#totalMessage").innerHTML =
            "The total is negative.";
    } else {
        document.querySelector("#totalMessage").innerHTML =
            "The total is zero.";
    }
}

// Minus 2
document.getElementById("minusTwoBtn").addEventListener("click", function() {
    total = total - 2;
    history.push("-2");
    operationCount.subtractions = operationCount.subtractions + 1;
    updateResults();
});

// Minus 1
document.getElementById("minusOneBtn").addEventListener("click", function() {
    total = total - 1;
    history.push("-1");
    operationCount.subtractions = operationCount.subtractions + 1;
    updateResults();
});

// Plus 1
document.getElementById("plusOneBtn").addEventListener("click", function() {
    total = total + 1;
    history.push("+1");
    operationCount.additions = operationCount.additions + 1;
    updateResults();
});

// Plus 2
document.getElementById("plusTwoBtn").addEventListener("click", function() {
    total = total + 2;
    history.push("+2");
    operationCount.additions = operationCount.additions + 1;
    updateResults();
});

// Reset the total, but preserve history and operation counts
document.getElementById("resetBtn").addEventListener("click", function() {
    total = 0;
    history.push("Reset");
    updateResults();
});

// Step 4: Clear all data
function ClearAll() {
    total = 0;
    history = [];

    operationCount.additions = 0;
    operationCount.subtractions = 0;

    updateResults();
}

// Clear All button
document.getElementById("clearAllBtn").addEventListener("click", function() {
    ClearAll();
});

// Initialize the interface
updateResults();