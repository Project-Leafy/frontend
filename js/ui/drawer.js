document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".drawer-trigger");
  const portal = document.getElementById("drawer-portal");

  let overlay = null;
  let content = null;

  function openDrawer(direction) {
    // 기존 Drawer 제거
    portal.innerHTML = "";

    // 마크업 생성
    portal.innerHTML = `
      <div class="drawer-overlay" data-state="open"></div>

      <div class="drawer-content" data-direction="${direction}" data-state="open">
        <div class="drawer-handle"></div>

        <button class="drawer-close-icon-btn" type="button" aria-label="Close">
          <!-- 간단한 X 아이콘 (SVG) -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2" />
            <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>

        <div class="drawer-header">
          <h2 class="drawer-title">Drawer (${direction})</h2>
          <p class="drawer-description">
            This is a <strong>${direction}</strong> drawer example. 디자인과 동작만 테스트용입니다.
          </p>
        </div>

        <div class="drawer-footer">
          <button class="drawer-btn secondary" type="button" id="drawer-close-btn">Close</button>
          <button class="drawer-btn primary" type="button">Confirm</button>
        </div>
      </div>
    `;

    overlay = portal.querySelector(".drawer-overlay");
    content = portal.querySelector(".drawer-content");

    // 이벤트 바인딩
    const closeBtn = portal.querySelector("#drawer-close-btn");
    const closeIconBtn = portal.querySelector(".drawer-close-icon-btn");

    if (overlay) overlay.addEventListener("click", closeDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (closeIconBtn) closeIconBtn.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", handleEsc);
  }

  function closeDrawer() {
    if (!overlay || !content) return;

    overlay.dataset.state = "closed";
    content.dataset.state = "closed";

    // 애니메이션 시간 후 DOM 제거
    setTimeout(() => {
      portal.innerHTML = "";
      overlay = null;
      content = null;
    }, 200);

    document.removeEventListener("keydown", handleEsc);
  }

  function handleEsc(e) {
    if (e.key === "Escape") {
      closeDrawer();
    }
  }

  // Trigger 클릭 핸들러
  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.getAttribute("data-direction") || "bottom";
      openDrawer(direction);
    });
  });
});
