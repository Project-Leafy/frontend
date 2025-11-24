document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("progress-root");
  const indicator = root.querySelector(".progress-indicator");

  let value = Number(root.dataset.value || 0);

  function setProgress(v) {
    value = Math.max(0, Math.min(100, v));
    root.dataset.value = value;

    // TSX transform 공식:
    // translateX(-(100 - value)%)
    const offset = 100 - value;
    indicator.style.transform = `translateX(-${offset}%)`;
  }

  // 초기 값 설정
  setProgress(value);

  // 데모용 컨트롤
  document.getElementById("increase").addEventListener("click", () => {
    setProgress(value + 10);
  });

  document.getElementById("decrease").addEventListener("click", () => {
    setProgress(value - 10);
  });
});
