(function () {
  /**
   * 초기화: data-switch 요소들을 모두 활성화
   */
  function initSwitches() {
    document.querySelectorAll("[data-switch]").forEach((sw) => {
      const thumb = sw.querySelector(".switch-thumb");

      // 초기 checked 상태
      let checked = sw.getAttribute("data-checked") === "true";

      // 업데이트 함수
      function update() {
        sw.setAttribute("data-checked", checked);
      }

      // 이벤트 등록
      sw.addEventListener("click", () => {
        if (sw.getAttribute("data-disabled") === "true") return;

        checked = !checked;
        update();

        // 커스텀 이벤트 발행
        sw.dispatchEvent(
          new CustomEvent("switch-change", { detail: { checked } })
        );
      });

      update();
    });
  }

  document.addEventListener("DOMContentLoaded", initSwitches);
})();
