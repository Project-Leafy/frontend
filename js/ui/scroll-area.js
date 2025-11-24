document.addEventListener("DOMContentLoaded", () => {
  const area = document.querySelector(".scroll-area");
  const viewport = area.querySelector(".scroll-viewport");
  const content = area.querySelector(".scroll-content");
  const scrollbar = area.querySelector(".scrollbar.vertical");
  const thumb = scrollbar.querySelector(".thumb");

  function updateThumb() {
    const viewportHeight = viewport.clientHeight;
    const contentHeight = content.scrollHeight;

    // 컨텐츠가 뷰포트보다 작으면 스크롤바 숨기기
    if (contentHeight <= viewportHeight) {
      thumb.style.height = "0px";
      thumb.style.transform = "translateY(0)";
      return;
    }

    const ratio = viewportHeight / contentHeight;
    const thumbHeight = Math.max(20, viewportHeight * ratio);
    thumb.style.height = thumbHeight + "px";

    const scrollTop = viewport.scrollTop;                 // ✅ 여기!
    const maxScroll = contentHeight - viewportHeight;
    const trackHeight = viewportHeight - thumbHeight;

    const scrollRatio = scrollTop / maxScroll;
    thumb.style.transform = `translateY(${trackHeight * scrollRatio}px)`;
  }

  viewport.addEventListener("scroll", updateThumb);
  window.addEventListener("resize", updateThumb);

  updateThumb();
});
