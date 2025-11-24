document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("context-menu-trigger");
  const menu = document.getElementById("context-menu");

  // ------------------------------
  // Right-click to open
  // ------------------------------
  document.addEventListener("contextmenu", (e) => {
    if (!trigger.contains(e.target)) return;

    e.preventDefault();

    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.classList.remove("hidden");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

  // Close on scroll
  window.addEventListener("scroll", () => {
    menu.classList.add("hidden");
  });

  // ------------------------------
  // Checkbox Item
  // ------------------------------
  const checkboxItem = document.querySelector(".cm-checkbox-item");
  checkboxItem.addEventListener("click", () => {
    const checked = checkboxItem.getAttribute("data-checked") === "true";
    checkboxItem.setAttribute("data-checked", String(!checked));
  });

  // ------------------------------
  // Radio Group
  // ------------------------------
  const radioItems = document.querySelectorAll(".cm-radio-item");

  radioItems.forEach((item) => {
    item.addEventListener("click", () => {
      radioItems.forEach((r) => r.removeAttribute("data-selected"));
      item.setAttribute("data-selected", "true");
    });
  });
});
