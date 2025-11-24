document.querySelectorAll(".menubar-trigger").forEach(trigger => {
  trigger.addEventListener("click", e => {
    const menuName = trigger.dataset.menu;
    const content = document.querySelector(`[data-menu-content="${menuName}"]`);

    const isOpen = trigger.dataset.open === "true";

    // 전체 닫기
    document.querySelectorAll(".menubar-content").forEach(c => c.style.display = "none");
    document.querySelectorAll(".menubar-trigger").forEach(t => t.dataset.open = "false");

    // 현재만 토글
    if (!isOpen) {
      content.style.display = "block";
      trigger.dataset.open = "true";
    }
  });
});

// 외부 클릭 → 메뉴 닫기
document.addEventListener("click", e => {
  if (!e.target.closest(".menubar-root")) {
    document.querySelectorAll(".menubar-content").forEach(c => c.style.display = "none");
    document.querySelectorAll(".menubar-trigger").forEach(t => t.dataset.open = "false");
  }
});
