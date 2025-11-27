// 백엔드 API 서버 주소 (포트 8081 확인!)
const BASE_URL = 'http://localhost:8081/api';

// 예시: 서버 상태 확인 API 호출 함수 (아직 백엔드에 만들지 않음)
async function checkServerStatus() {
    try {
        // 백엔드의 '/api/health' 경로로 GET 요청 (예시)
        const response = await fetch(`${BASE_URL}/health`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Server Status:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        // 사용자에게 오류 메시지 표시 (예: content 영역에)
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = '<p style="color: red;">Error connecting to server.</p>';
        }
    }
}

// 다른 API 호출 함수들을 여기에 추가할 예정...
// ex) async function login(username, password) { ... }
// ex) async function getPlants() { ... }