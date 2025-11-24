// JS is minimal since badges are mostly static UI
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".badge").forEach(badge => {
    const variant = badge.dataset.variant || "default";
    badge.setAttribute("data-variant", variant);
  });
});
