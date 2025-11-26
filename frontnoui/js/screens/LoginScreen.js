console.log("[LoginScreen.js loaded]");

// 화면 로직
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("kakao-login-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      console.log("카카오 로그인 클릭됨");

      // 🔥 화면 전환 예시 (필요한 페이지로 이동)
      window.location.href = "./HomeScreen.html";
    });
  }
});
