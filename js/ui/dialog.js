document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("dialog-trigger");
  const portal = document.getElementById("dialog-portal");

  let overlay = null;
  let content = null;

  function openDialog() {
    portal.innerHTML = `
      <div class="dialog-overlay" data-state="open"></div>

      <div class="dialog-content" data-state="open">
        <button class="dialog-close" id="dialog-close" aria-label="Close">
          ✕
        </button>

        <div class="dialog-header">
          <h2 class="dialog-title">샘플 타이틀</h2>
          <p class="dialog-description">이건 샘플 Dialog입니다.</p>
        </div>

        <div class="dialog-footer">
          <button class="dialog-trigger">Confirm</button>
          <button class="dialog-trigger" id="dialog-close-footer">Cancel</button>
        </div>
      </div>
    `;

    overlay = portal.querySelector(".dialog-overlay");
    content = portal.querySelector(".dialog-content");

    // close buttons
    portal.querySelector("#dialog-close").addEventListener("click", closeDialog);
    portal.querySelector("#dialog-close-footer").addEventListener("click", closeDialog);

    // click outside
    overlay.addEventListener("click", closeDialog);

    // ESC
    document.addEventListener("keydown", escClose);
  }

  function closeDialog() {
    if (!overlay || !content) return;

    overlay.dataset.state = "closed";
    content.dataset.state = "closed";

    setTimeout(() => {
      portal.innerHTML = "";
    }, 150);

    document.removeEventListener("keydown", escClose);
  }

  function escClose(e) {
    if (e.key === "Escape") closeDialog();
  }

  trigger.addEventListener("click", openDialog);
});
