

const canvas = document.getElementById("breathChart");
const ctx = canvas.getContext("2d");
const connectBtn = document.getElementById("connectBtn");
const connectionStatus = document.getElementById("connectionStatus");

const readings = [];
const MAX_POINTS = 150;

let port;
let startTime = null;

function drawChart() {
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

        if (line.trim() !== "" && Number.isFinite(voltage)) {
          readings.push(voltage);

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
