const trigger = document.getElementById("select-trigger");
const content = document.getElementById("select-content");
const valueEl = document.getElementById("select-value");
const items = document.querySelectorAll(".select-item");

trigger.addEventListener("click", () => {
  const opened = trigger.dataset.open === "true";
  trigger.dataset.open = !opened;
  content.classList.toggle("hidden");
  content.dataset.state = opened ? "closed" : "open";
});

document.addEventListener("click", (e) => {
  if (!trigger.contains(e.target) && !content.contains(e.target)) {
    trigger.dataset.open = "false";
    content.classList.add("hidden");
    content.dataset.state = "closed";
  }
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    items.forEach((i) => i.removeAttribute("data-selected"));

    item.dataset.selected = "true";
    valueEl.textContent = item.dataset.value;

    trigger.dataset.open = "false";
    content.classList.add("hidden");
  });
});
