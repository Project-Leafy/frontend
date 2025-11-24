// js/main.js
let currentScreen = "home";
const screenElement = document.getElementById("screen");
const navElement = document.getElementById("bottom-nav");

function loadScreen(screen) {
  currentScreen = screen;
  fetch(`pages/${screen}.html`)
    .then(res => {
      if (!res.ok) throw new Error("페이지 불러오기 실패");
      return res.text();
    })
    .then(html => {
      screenElement.innerHTML = html;
      renderBottomNav();
      window.scrollTo(0, 0);
    })
    .catch(err => console.error(err));
}

function renderBottomNav() {
  if (["home", "feed", "calendar", "recommend"].includes(currentScreen)) {
    navElement.style.display = "block";
  } else {
    navElement.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadScreen("home");
  renderBottomNav();
});
