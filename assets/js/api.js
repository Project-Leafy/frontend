const BASE_URL = 'http://localhost:8080'; // 백엔드 서버 주소

/**
 * 백엔드 API에 요청을 보냅니다.
 * @param {string} path - API 경로 (예: '/home', '/api/v1/users/me')
 * @param {object} options - fetch 옵션 (method, body 등)
 * @returns {Promise<Response>} - fetch 응답 Promise
 */
async function fetchApi(path, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // 기존 헤더 덮어쓰기
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const response = await fetch(BASE_URL + path, {
            ...options,
            headers: headers,
        });

        // ✨ [중요] 인증 실패 시 자동 로그아웃 처리
        if (response.status === 401 || response.status === 403) {
            alert('인증이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
            logout(); // auth.js의 로그아웃 함수 호출
            // 에러를 발생시켜 .catch()로 넘김
            throw new Error('Authentication failed'); 
        }

        return response;

    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 .catch()로 잡을 수 있게 함
    }
}