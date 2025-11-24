const trigger = document.getElementById("dropdown-trigger");
const content = document.getElementById("dropdown-content");
const submenuTrigger = document.getElementById("submenu-trigger");
const submenuContent = document.getElementById("submenu-content");

// Dropdown open / close
trigger.addEventListener("click", () => {
  content.classList.toggle("hidden");

  const rect = trigger.getBoundingClientRect();
  content.style.top = rect.bottom + 4 + "px";
  content.style.left = rect.left + "px";
});

// Checkbox
const checkboxItem = document.getElementById("checkbox-item");
checkboxItem.addEventListener("click", () => {
  const checked = checkboxItem.dataset.checked === "true";
  checkboxItem.dataset.checked = (!checked).toString();
});

// Radio
const radioLight = document.getElementById("radio-light");
const radioDark = document.getElementById("radio-dark");

radioLight.addEventListener("click", () => {
  radioLight.dataset.checked = "true";
  radioDark.dataset.checked = "false";
});

radioDark.addEventListener("click", () => {
  radioDark.dataset.checked = "true";
  radioLight.dataset.checked = "false";
});

// === SubMenu Logic ===
submenuTrigger.addEventListener("mouseenter", () => {
  submenuContent.classList.remove("hidden");
});

submenuTrigger.addEventListener("mouseleave", () => {
  setTimeout(() => {
    if (!submenuContent.matches(":hover"))
      submenuContent.classList.add("hidden");
  }, 120);
});

submenuContent.addEventListener("mouseenter", () => {
  submenuContent.classList.remove("hidden");
});

submenuContent.addEventListener("mouseleave", () => {
  submenuContent.classList.add("hidden");
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!content.contains(e.target) && e.target !== trigger) {
    content.classList.add("hidden");
    submenuContent.classList.add("hidden");
  }
});
