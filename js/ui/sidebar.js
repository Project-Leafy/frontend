// -----------------------------------------
// Sidebar Core Logic
// -----------------------------------------

const sidebar = document.getElementById("sidebar");
const sidebarWrapper = document.querySelector(".sidebar-wrapper");
const overlay = document.getElementById("sidebar-mobile-overlay");
const trigger = document.getElementById("sidebar-trigger");
const submenuTrigger = document.getElementById("submenu-trigger");
const submenu = document.getElementById("submenu");

// -----------------------------------------
// Desktop toggle
// -----------------------------------------
function toggleDesktopSidebar() {
  sidebar.classList.toggle("collapsed");
  sidebarWrapper.dataset.state = sidebar.classList.contains("collapsed")
    ? "collapsed"
    : "expanded";
}

trigger.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    openMobileSidebar();
  } else {
    toggleDesktopSidebar();
  }
});

// -----------------------------------------
// Mobile Sidebar
// -----------------------------------------
function openMobileSidebar() {
  sidebar.classList.add("mobile-open");
  overlay.classList.remove("hidden");
}

function closeMobileSidebar() {
  sidebar.classList.remove("mobile-open");
  overlay.classList.add("hidden");
}

overlay.addEventListener("click", closeMobileSidebar);

// -----------------------------------------
// Submenu Toggle
// -----------------------------------------
submenuTrigger?.addEventListener("click", () => {
  submenu.classList.toggle("hidden");
});

// -----------------------------------------
// Tooltip Logic (when collapsed)
// -----------------------------------------
let tooltipEl = null;

function createTooltip() {
  tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip";
  document.body.appendChild(tooltipEl);
}

createTooltip();

document.querySelectorAll(".sidebar-menu-button").forEach((btn) => {
  btn.addEventListener("mouseenter", (e) => {
    if (!sidebar.classList.contains("collapsed")) return;

    const label = btn.querySelector("span");
    if (!label) return;

    tooltipEl.textContent = label.textContent;
    tooltipEl.classList.add("show");

    const rect = btn.getBoundingClientRect();
    tooltipEl.style.top = rect.top + "px";
    tooltipEl.style.left = rect.right + 8 + "px";
  });

  btn.addEventListener("mouseleave", () => {
    tooltipEl.classList.remove("show");
  });
});

// -----------------------------------------
// Keyboard Shortcut: Ctrl/Cmd + B
// -----------------------------------------
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
    e.preventDefault();
    if (window.innerWidth <= 768) {
      openMobileSidebar();
    } else {
      toggleDesktopSidebar();
    }
  }
});
