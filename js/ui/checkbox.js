document.addEventListener("DOMContentLoaded", () => {
  const check = document.getElementById("leafyCheck");

  check.addEventListener("change", () => {
    if (check.checked) {
      check.setAttribute("data-state", "checked");
      console.log("✅ 체크됨: 식물 상태 자동 분석 활성화");
    } else {
      check.setAttribute("data-state", "unchecked");
      console.log("❎ 체크 해제됨");
    }
  });
});
