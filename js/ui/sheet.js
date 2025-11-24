const root = document.getElementById("sheet-root");
const openBtn = document.getElementById("open-sheet");
const closeBtn = document.getElementById("close-sheet");
const overlay = root.querySelector(".sheet-overlay");

openBtn.addEventListener("click", () => {
  root.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  root.classList.remove("active");
});

overlay.addEventListener("click", () => {
  root.classList.remove("active");
});
