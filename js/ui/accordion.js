document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".accordion-item");

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const content = item.querySelector(".accordion-content");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // 모든 아코디언 닫기
      items.forEach((el) => {
        el.classList.remove("active");
        const c = el.querySelector(".accordion-content");
        c.classList.remove("open");
        c.style.maxHeight = null;
      });

      // 클릭한 항목 열기
      if (!isOpen) {
        item.classList.add("active");
        content.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
});
