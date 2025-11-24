document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("alert-dialog");
  const trigger = document.getElementById("alert-trigger");
  const cancelBtn = document.getElementById("alert-cancel");
  const confirmBtn = document.getElementById("alert-confirm");

  // Dialog 열기
  trigger.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  // 닫기 함수
  const closeDialog = () => {
    overlay.classList.add("hidden");
  };

  cancelBtn.addEventListener("click", closeDialog);
  confirmBtn.addEventListener("click", () => {
    alert("삭제가 완료되었습니다 🌿");
    closeDialog();
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDialog();
  });
});
