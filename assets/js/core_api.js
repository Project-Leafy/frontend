const BASE_URL = 'http://3.38.12.121:8080'; // 백엔드 서버 주소

/**
 * 백엔드 API에 요청을 보냅니다.
 * @param {string} path - API 경로 (예: '/home', '/api/v1/users/me')
 * @param {object} options - fetch 옵션 (method, body 등)
 * @returns {Promise<Response>} - fetch 응답 Promise
 */

/**
 * 로그아웃 함수
 * 모든 페이지에서 공용으로 사용할 로그아웃 함수
 */
export function logout() {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');  // 나중에 UI 바꾸는게 좋을듯
    window.location.href = '/login'; // 로그인 페이지로 리다이렉트
}


/**
* `fetchApi()` 함수
* 이 프로젝트의 모든 백엔드 API 통신을 담당하는 핵심 함수입니다.
자동 인증 처리: localStorage에서 accessToken을 가져와 Authorization 헤더에 자동으로
추가해줍니다. 따라서 각 API 요청 함수마다 토큰을 추가하는 코드를 중복해서 작성할 필요가
없습니다.
* 헤더 관리: 기본적으로 Content-Type을 application/json으로 설정하고, 필요시 다른 헤더를
추가하거나 덮어쓸 수 있도록 유연하게 설계되어 있습니다.
* 인증 실패 시 자동 로그아웃: 이 함수의 가장 중요한 부분 중 하나입니다. API 요청이
실패하고 서버에서 401 (인증 실패) 또는 403 (권한 없음) 상태 코드를 받으면, "인증이
만료되었다"는 알림을 띄우고 위에서 설명한 logout() 함수를 자동으로 호출합니다. 이는
사용자가 토큰이 만료된 상태로 앱을 계속 사용하는 것을 방지하는 매우 중요한 기능입니다.
에러 처리: try...catch 블록으로 네트워크 에러 등 예기치 못한 문제를 처리하고, 콘솔에
에러를 기록하여 디버깅을 돕습니다.
 */
export async function fetchApi(path, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // 기존 헤더 덮어쓰기
    };

    // ✨ [핵심 수정] 전송할 데이터가 파일(FormData)인 경우,
    // Content-Type 헤더를 아예 삭제해야 브라우저가 자동으로 'multipart/form-data'와 'boundary'를 설정합니다.
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }
    
    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    console.log('Sending token:', token); // 토큰 확인을 위한 로그 추가

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
