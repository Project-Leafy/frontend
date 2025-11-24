document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("popover-trigger");
  const content = document.getElementById("popover-content");

  let isOpen = false;

  function openPopover() {
    content.classList.remove("hidden");
    content.classList.add("show");
    isOpen = true;
  }

  function closePopover() {
    content.classList.add("hidden");
    content.classList.remove("show");
    isOpen = false;
  }

  trigger.addEventListener("click", () => {
    if (isOpen) closePopover();
    else openPopover();
  });

  // 바깥 클릭 → 닫기
  document.addEventListener("click", (e) => {
    if (!isOpen) return;

    const isInside =
      content.contains(e.target) || trigger.contains(e.target);

    if (!isInside) closePopover();
  });
});
