const BASE_URL = 'http://localhost:8080/api/v1';

/**
 * 성장일지 생성 API 호출
 * POST /api/v1/plants/{plantId}/journal
 */
export async function createGrowthRecord(plantId, data) {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        alert('로그인이 필요합니다.');
        // 로그인 페이지 경로는 프로젝트 구조에 맞게 수정하세요
        window.location.href = '/login/login.html'; 
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/plants/${plantId}/journal`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '일지 저장에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating journal:', error);
        throw error;
    }
}
// ... 기존 createGrowthRecord 함수 아래에 추가 ...

/**
 * 성장일지 목록 조회 API 호출
 * GET /api/v1/plants/{plantId}/journal
 */
export async function getGrowthJournals(plantId) {
    const token = localStorage.getItem('accessToken');
    
    if (!token) return [];

    try {
        const response = await fetch(`${BASE_URL}/plants/${plantId}/journal`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('일지 목록을 불러오는데 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching journals:', error);
        return [];
    }
}

// myplant_journal_api.js 파일 내부에 추가

// [NEW] 이미지 파일만 서버(S3)로 보내고 URL을 받아오는 함수
export async function uploadImageFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    // 1. 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    
    try {
        // 2. 주소를 백엔드 포트(8080)까지 포함해서 정확히 적기
        // (ImageUploadController의 @RequestMapping("/api/images")와 맞춤)
        const response = await fetch('http://localhost:8080/api/images/upload', {
            method: 'POST',
            headers: {
                // 3. 인증 토큰 추가 (중요!)
                // 주의: Content-Type은 적지 않는다 (브라우저가 자동으로 boundary 설정함)
                'Authorization': `Bearer ${token}` 
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('이미지 업로드 실패');
        }

        const data = await response.json();
        return data.imageUrl; 
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}

