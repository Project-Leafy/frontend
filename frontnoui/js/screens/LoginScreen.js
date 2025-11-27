// js/screens/LoginScreen.js
console.log("[LoginScreen loaded]");

window.renderLoginScreen = async function () {
  const app = document.getElementById("app");

  // LoginScreen.html 전체를 불러온다
  const res = await fetch("./pages/LoginScreen.html");
  const fullHtml = await res.text();

  // <main>만 뽑아서 넣는다 (doctype, head, body 중복 방지)
  const match = fullHtml.match(/<main[\s\S]*<\/main>/);
  const content = match ? match[0] : fullHtml;

  app.innerHTML = content;

  // lucide 아이콘 다시 렌더링
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ✅ HTML에 실제로 있는 id 그대로 사용: kakao-login-btn
  const kakaoBtn = app.querySelector("#kakao-login-btn");

  if (kakaoBtn) {
    kakaoBtn.onclick = () => {
      // 로그인 후 바로 홈으로 이동
      // (main.js 안에 전역 함수 navigateTo("home")가 있다고 가정)
      navigateTo("home");
    };
  } else {
    console.warn("[LoginScreen] #kakao-login-btn 을 찾지 못했습니다.");
  }
};
