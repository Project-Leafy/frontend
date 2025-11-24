document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-slot='tooltip']").forEach((tooltip) => {
    const trigger = tooltip.querySelector("[data-slot='tooltip-trigger']");
    const content = tooltip.querySelector("[data-slot='tooltip-content']");
    const arrow = content.querySelector(".tooltip-arrow");
    const delay = Number(tooltip.getAttribute("data-delay") || 0);
    const side = content.getAttribute("data-side") || "top";

    // 포털처럼 body 끝으로 이동
    document.body.appendChild(content);

    let timer;

    const show = () => {
      timer = setTimeout(() => {
        positionTooltip(trigger, content, arrow, side);
        content.setAttribute("data-state", "open");
      }, delay);
    };

    const hide = () => {
      clearTimeout(timer);
      content.setAttribute("data-state", "closed");
    };

    trigger.addEventListener("mouseenter", show);
    trigger.addEventListener("mouseleave", hide);
    trigger.addEventListener("focus", show);
    trigger.addEventListener("blur", hide);
  });
});

// Tooltip positioning
function positionTooltip(trigger, content, arrow, side) {
  const rect = trigger.getBoundingClientRect();
  const cRect = content.getBoundingClientRect();

  let top = 0;
  let left = 0;

  switch (side) {
    case "top":
      top = rect.top - cRect.height - 10;
      left = rect.left + rect.width / 2 - cRect.width / 2;
      arrow.style.left = cRect.width / 2 - 5 + "px";
      arrow.style.top = cRect.height - 5 + "px";
      break;

    case "bottom":
      top = rect.bottom + 10;
      left = rect.left + rect.width / 2 - cRect.width / 2;
      arrow.style.left = cRect.width / 2 - 5 + "px";
      arrow.style.top = "-5px";
      break;

    case "left":
      top = rect.top + rect.height / 2 - cRect.height / 2;
      left = rect.left - cRect.width - 10;
      arrow.style.top = cRect.height / 2 - 5 + "px";
      arrow.style.left = cRect.width - 5 + "px";
      break;

    case "right":
      top = rect.top + rect.height / 2 - cRect.height / 2;
      left = rect.right + 10;
      arrow.style.top = cRect.height / 2 - 5 + "px";
      arrow.style.left = "-5px";
      break;
  }

  content.style.top = top + "px";
  content.style.left = left + "px";
}
