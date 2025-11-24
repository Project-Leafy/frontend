document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".hover-card-root");
  if (!root) return;

  const trigger = root.querySelector(".hover-card-trigger");
  const content = root.querySelector(".hover-card-content");
  if (!trigger || !content) return;

  let hoverInside = false;
  let hideTimer = null;

  const showCard = () => {
    clearTimeout(hideTimer);
    content.classList.add("is-visible");
  };

  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!hoverInside) {
        content.classList.remove("is-visible");
      }
    }, 120);
  };

  // Trigger 이벤트
  trigger.addEventListener("mouseenter", () => {
    hoverInside = true;
    showCard();
  });

  trigger.addEventListener("mouseleave", () => {
    hoverInside = false;
    scheduleHide();
  });

  // Content 이벤트
  content.addEventListener("mouseenter", () => {
    hoverInside = true;
    showCard();
  });

  content.addEventListener("mouseleave", () => {
    hoverInside = false;
    scheduleHide();
  });
});
