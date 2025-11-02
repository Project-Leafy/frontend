//역할: /app/ 폴더 안의 모든 페이지(main.html 등) 상단에 포함되어, 토큰이 없는 사용자를 home.html로 쫓아내는 보안 가드 역할을 한다.
// 페이지가 로드될 때 즉시 실행되는 인증 검사
(function() {
    const token = localStorage.getItem('accessToken');
    
    // ✨ [중요] 현재 경로가 '/app/'으로 시작하는지 확인한다.
    if (window.location.pathname.startsWith('/app/')) {
        
        // '/app/' 페이지인데 토큰이 없으면
        if (!token) {
            alert('로그인이 필요합니다.');
            // (public) 로그인 페이지로 강제 이동
            window.location.replace('/home.html');
        }
    }
})();

// 모든 페이지에서 공용으로 사용할 로그아웃 함수
function logout() {
    localStorage.removeItem('accessToken');
    alert('로그아웃되었습니다.');
    window.location.replace('/home.html');
}