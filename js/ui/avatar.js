document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".avatar").forEach((avatar) => {
    const img = avatar.querySelector("img");
    const fallback = avatar.querySelector(".avatar-fallback");

    if (!img) return;

    // fallback 표시 / 이미지 로드 실패 처리
    img.addEventListener("error", () => {
      if (fallback) fallback.style.display = "flex";
      img.style.display = "none";
    });

    img.addEventListener("load", () => {
      if (fallback) fallback.style.display = "none";
      img.style.display = "block";
    });
  });
});
