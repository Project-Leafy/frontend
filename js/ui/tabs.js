document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll("[data-slot='tabs-trigger']");
  const contents = document.querySelectorAll("[data-slot='tabs-content']");

  function activateTab(value) {
    // Trigger 상태 변경
    triggers.forEach((t) => {
      if (t.getAttribute("data-value") === value) {
        t.setAttribute("data-state", "active");
      } else {
        t.removeAttribute("data-state");
      }
    });

    // Content 표시 변경
    contents.forEach((c) => {
      if (c.getAttribute("data-value") === value) {
        c.style.display = "block";
      } else {
        c.style.display = "none";
      }
    });
  }

  // 초기 상태
  const defaultTab = triggers[0]?.getAttribute("data-value");
  if (defaultTab) activateTab(defaultTab);

  // 클릭 이벤트 연결
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const value = trigger.getAttribute("data-value");
      activateTab(value);
    });
  });
});
