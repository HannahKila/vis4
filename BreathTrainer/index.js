
const canvas = document.getElementById("breathChart");
const ctx = canvas.getContext("2d");

const lengthValue = document.getElementById("lengthValue");
const pressureValue = document.getElementById("pressureValue");
const fluctuateValue = document.getElementById("fluctuateValue");
const stabilityValue = document.getElementById("stabilityValue");

let elapsed = 0;
let isTraining = true;

// Store recent breath measurements
let breathHistory = [];

// Demo target curve
function targetBreath(t) {
    return 0.42 + 0.025 * Math.sin(t * 0.35);
}

// Demo actual breath curve
function actualBreath(t) {
    return targetBreath(t)
        + 0.035 * Math.sin(t * 0.8)
        + 0.012 * Math.sin(t * 1.7)
        + (t > 13 ? 0.04 * (t - 13) / 7 : 0);
}

// Draw chart and update responsive canvas size
function drawChart() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const left = 20;
    const right = 0;
    const top = 4;
    const bottom = 26;

    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = "#b8b8b8";
    ctx.lineWidth = 1;

    const horizontalLines = 8;
    const verticalLines = 8;

    for (let i = 0; i <= horizontalLines; i++) {
        const y = top + chartHeight * i / horizontalLines;

        ctx.moveTo(left, y);
        ctx.lineTo(width - right, y);
    }

    for (let i = 1; i <= verticalLines; i++) {
        const x = left + chartWidth * i / verticalLines;

        ctx.moveTo(x, top);
        ctx.lineTo(x, height - bottom);
    }

    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = "#555555";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    [5, 10, 15, 20].forEach(value => {
        const x = left + chartWidth * value / 23;
        ctx.fillText(value, x, height - bottom + 8);
    });

    // Map breath data to chart coordinates
    function pointX(t) {
        return left + chartWidth * t / 23;
    }

    function pointY(value) {
        return top + chartHeight * (1 - value);
    }

    // Draw target line
    ctx.beginPath();
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([1, 4]);
    ctx.lineCap = "round";

    for (let t = 0; t <= elapsed; t += 0.15) {
        const x = pointX(t);
        const y = pointY(targetBreath(t));

        if (t === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // Draw actual breath line
    ctx.beginPath();
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let t = 0; t <= elapsed; t += 0.15) {
        const x = pointX(t);
        const y = pointY(actualBreath(t));

        if (t === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

// Update metrics from demo data
function updateMetrics() {
    const currentTime = Math.min(elapsed, 23);

    const actual = actualBreath(currentTime);
    const target = targetBreath(currentTime);

    // Demo values only, not calibrated sensor measurements
    const pressure = Math.max(
        0,
        0.7 + (actual - target) * 2
    );

    const difference = Math.abs(actual - target);
    const stability = Math.max(
        0,
        Math.min(100, Math.round(100 - difference * 200))
    );

    breathHistory.push(difference);

    if (breathHistory.length > 20) {
        breathHistory.shift();
    }

    const averageDifference =
        breathHistory.reduce((sum, value) => sum + value, 0)
        / breathHistory.length;

    lengthValue.textContent = Math.floor(elapsed);
    pressureValue.textContent = pressure.toFixed(1);
    fluctuateValue.textContent =
        "±" + (averageDifference * 10).toFixed(1);
    stabilityValue.textContent = stability;
}

// Start demo animation
function animate() {
    if (!isTraining) return;

    elapsed += 0.1;

    // Loop the demo after 23 seconds
    if (elapsed > 23) {
        elapsed = 0;
        breathHistory = [];
    }

    drawChart();
    updateMetrics();
}

drawChart();
updateMetrics();

const animationTimer = window.setInterval(animate, 100);

// Redraw the chart when the viewport changes
window.addEventListener("resize", drawChart);