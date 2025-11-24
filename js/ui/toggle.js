document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-slot='toggle']").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (toggle.disabled) return;

      const current = toggle.getAttribute("data-state") || "off";
      const next = current === "on" ? "off" : "on";
      toggle.setAttribute("data-state", next);
    });
  });
});
