document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll("[data-slot='table-row']");

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const already = row.getAttribute("data-selected") === "true";
      row.setAttribute("data-selected", already ? "false" : "true");
    });
  });
});
