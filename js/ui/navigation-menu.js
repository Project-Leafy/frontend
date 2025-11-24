document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navigation-menu");
  if (!nav) return;

  const triggers = Array.from(
    nav.querySelectorAll(".navigation-menu-trigger"),
  );
  const contents = Array.from(
    nav.querySelectorAll(".navigation-menu-content"),
  );
  const viewportInner = nav.querySelector(".navigation-menu-viewport-inner");
  const indicator = nav.querySelector(".navigation-menu-indicator");

  if (!viewportInner || !indicator) return;

  let currentIndex = -1;

  function updateIndicator(index) {
    const trigger = triggers[index];
    if (!trigger) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = trigger.getBoundingClientRect();

    const center =
      btnRect.left - navRect.left + btnRect.width / 2;

    indicator.style.left = `${center - 4}px`; // 4px = arrow width/2
    indicator.classList.add("is-visible");
  }

  function openMenu(index) {
    const isSame = index === currentIndex;

    // 같은 메뉴면 토글 (닫기)
    if (isSame) {
      closeMenu();
      return;
    }

    const direction =
      currentIndex === -1
        ? "right"
        : index > currentIndex
        ? "right"
        : "left";

    currentIndex = index;

    triggers.forEach((btn, i) => {
      if (i === index) {
        btn.setAttribute("data-open", "true");
      } else {
        btn.removeAttribute("data-open");
      }
    });

    const content = contents[index];
    if (!content) return;

    // viewport 내용 교체
    viewportInner.innerHTML = content.innerHTML;

    // 애니메이션 클래스 초기화
    viewportInner.classList.remove(
      "slide-from-left",
      "slide-from-right",
      "is-open",
    );

    // reflow 해서 애니메이션 트리거
    void viewportInner.offsetWidth;

    viewportInner.classList.add("is-open");
    viewportInner.classList.add(
      direction === "right" ? "slide-from-right" : "slide-from-left",
    );

    updateIndicator(index);
  }

  function closeMenu() {
    currentIndex = -1;
    triggers.forEach((btn) => btn.removeAttribute("data-open"));
    viewportInner.classList.remove(
      "is-open",
      "slide-from-left",
      "slide-from-right",
    );
    indicator.classList.remove("is-visible");
  }

  // Trigger 클릭 이벤트
  triggers.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      openMenu(index);
    });
  });

  // 메뉴 밖 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) {
      closeMenu();
    }
  });
});
