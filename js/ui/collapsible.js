document.addEventListener("DOMContentLoaded", () => {
  const collapsible = document.querySelector(".collapsible");
  const trigger = collapsible.querySelector(".collapsible-trigger");
  const content = collapsible.querySelector(".collapsible-content");

  trigger.addEventListener("click", () => {
    const isOpen = collapsible.getAttribute("data-open") === "true";
    collapsible.setAttribute("data-open", String(!isOpen));
  });
});
