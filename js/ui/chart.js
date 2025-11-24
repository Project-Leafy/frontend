document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("leafyChart");
  const ctx = canvas.getContext("2d");

  const data = [
    { day: "월", moisture: 45 },
    { day: "화", moisture: 60 },
    { day: "수", moisture: 55 },
    { day: "목", moisture: 72 },
    { day: "금", moisture: 68 },
    { day: "토", moisture: 63 },
    { day: "일", moisture: 70 },
  ];

  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";
  document.body.appendChild(tooltip);

  const padding = 50;
  const maxValue = Math.max(...data.map(d => d.moisture)) + 10;
  const stepX = (canvas.width - padding * 2) / (data.length - 1);

  // y좌표 변환
  function getY(value) {
    const height = canvas.height - padding * 2;
    return canvas.height - padding - (value / maxValue) * height;
  }

  // Draw grid
  ctx.strokeStyle = "#E5E5E0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + ((canvas.height - padding * 2) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = "#4A7C59";
  ctx.lineWidth = 3;
  data.forEach((point, i) => {
    const x = padding + i * stepX;
    const y = getY(point.moisture);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw dots
  data.forEach((point, i) => {
    const x = padding + i * stepX;
    const y = getY(point.moisture);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#4A7C59";
    ctx.fill();
  });

  // Draw X labels
  ctx.fillStyle = "#6B7280";
  ctx.font = "12px Pretendard";
  data.forEach((point, i) => {
    const x = padding + i * stepX;
    ctx.fillText(point.day, x - 6, canvas.height - padding + 20);
  });

  // Tooltip 기능
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hovered = null;
    data.forEach((point, i) => {
      const px = padding + i * stepX;
      const py = getY(point.moisture);
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist < 8) hovered = { ...point, x: px, y: py };
    });

    if (hovered) {
      tooltip.style.opacity = 1;
      tooltip.style.left = `${rect.left + hovered.x + 10}px`;
      tooltip.style.top = `${rect.top + hovered.y - 30}px`;
      tooltip.innerHTML = `<strong>${hovered.day}</strong><br/>수분: ${hovered.moisture}%`;
    } else {
      tooltip.style.opacity = 0;
    }
  });
});
