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