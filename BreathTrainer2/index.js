

const canvas = document.getElementById("breathChart");
const ctx = canvas.getContext("2d");
const connectBtn = document.getElementById("connectBtn");
const connectionStatus = document.getElementById("connectionStatus");

const readings = [];
const MAX_POINTS = 150;

// Smoothness settings
const SMOOTHING = 0.05;
const DEAD_ZONE = 0.07; // volts
const BASELINE = 2.5;   // approximate zero-pressure voltage

let filteredVoltage = null;

let port;
let startTime = null;

/*function drawChart() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(0, 0, width, height);

  // Grid lines
  ctx.strokeStyle = "#dddddd";
  ctx.lineWidth = 1;

  for (let i = 1; i < 5; i++) {
    const y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  if (readings.length < 2) return;

  const minValue = Math.min(...readings);
  const maxValue = Math.max(...readings);
  const range = Math.max(maxValue - minValue, 0.05);
  const padding = 15;

  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2;
  ctx.beginPath();

  readings.forEach((value, index) => {
    const x = (index / (MAX_POINTS - 1)) * width;
    const y =
      height - padding -
      ((value - minValue) / range) * (height - padding * 2);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}
  */

function drawChart() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const padding = 15;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(0, 0, width, height);

  // Grid lines
  ctx.strokeStyle = "#dddddd";
  ctx.lineWidth = 1;

  for (let i = 1; i < 5; i++) {
    const y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  if (!readings || readings.length < 2) return;

  const values = readings.filter(Number.isFinite);
  if (values.length < 2) return;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(maxValue - minValue, 0.05);

  const points = values.map((value, index) => ({
    x: (index / Math.max(MAX_POINTS - 1, 1)) * width,
    y: height - padding -
      ((value - minValue) / range) * (height - padding * 2)
  }));

  // Smooth curve
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;

    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      midX,
      midY
    );
  }

  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
}


async function connectArduino() {
  if (!("serial" in navigator)) {
    connectionStatus.textContent =
      "Web Serial is not supported. Please use desktop Chrome.";
    return;
  }

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    connectionStatus.textContent = "Arduino connected";
    startTime = Date.now();

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable).catch(() => {});
    const reader = decoder.readable.getReader();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += value;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();

    for (const line of lines) {
  const voltage = Number(line.trim());
  console.log("Arduino data:", line, voltage);
  navigator.serial.getPorts().then(ports => console.log(ports.length, ports))

if (line.trim() !== "" && Number.isFinite(voltage)) {

  // 1. Low-pass filter: reduce rapid fluctuations
  if (filteredVoltage === null) {
    filteredVoltage = voltage;
  } else {
    filteredVoltage += SMOOTHING * (voltage - filteredVoltage);
  }

  // 2. Remove small fluctuations around baseline
  let displayVoltage = filteredVoltage;
  const deviation = filteredVoltage - BASELINE;

  if (Math.abs(deviation) < DEAD_ZONE) {
    displayVoltage = BASELINE;
  }

  readings.push(displayVoltage);

  if (readings.length > MAX_POINTS) {
    readings.shift();
  }

  drawChart();

  document.getElementById("lengthValue").textContent =
    ((Date.now() - startTime) / 1000).toFixed(1);
}

      }
    }
  } catch (error) {
    connectionStatus.textContent =
      "Connection failed: " + error.message;
  }
}

connectBtn.addEventListener("click", connectArduino);

window.addEventListener("resize", drawChart);
drawChart();
