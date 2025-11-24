document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-slot='toggle-group']").forEach((group) => {
    const type = group.getAttribute("data-type") || "single";

    group.querySelectorAll(".toggle-group-item").forEach((item) => {
      item.addEventListener("click", () => {
        const isOn = item.getAttribute("data-state") === "on";

        if (type === "single") {
          group.querySelectorAll(".toggle-group-item").forEach((i) =>
            i.setAttribute("data-state", "off")
          );
          item.setAttribute("data-state", isOn ? "off" : "on");
        } else {
          item.setAttribute("data-state", isOn ? "off" : "on");
        }
      });
    });
  });
});
