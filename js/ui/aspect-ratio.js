document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".aspect-ratio").forEach(container => {
    const ratio = container.dataset.ratio || "1/1";
    const [w, h] = ratio.split("/").map(Number);
    const padding = (h / w) * 100;
    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.style.borderRadius = "8px";
    container.style.background = "#f1f5f9";

    // Remove any accidental inline ratios (safety)
    container.querySelectorAll("img, video").forEach(el => {
      el.style.position = "absolute";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.objectFit = "cover";
      el.style.top = 0;
      el.style.left = 0;
    });
  });
});
