document.addEventListener("DOMContentLoaded", () => {
  // Optional dynamic logic (like truncation for long breadcrumb chains)
  document.querySelectorAll(".breadcrumb").forEach(nav => {
    const items = nav.querySelectorAll(".breadcrumb-item");
    if (items.length > 5) {
      // collapse middle items if too many
      const ellipsis = document.createElement("span");
      ellipsis.className = "breadcrumb-ellipsis";
      ellipsis.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" stroke-width="2">
          <circle cx="5" cy="12" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="19" cy="12" r="1.5"/>
        </svg>
        <span class="sr-only">More</span>
      `;
      nav.querySelector("ol").insertBefore(ellipsis, items[2]);
      for (let i = 3; i < items.length - 1; i++) items[i].style.display = "none";
    }
  });
});
