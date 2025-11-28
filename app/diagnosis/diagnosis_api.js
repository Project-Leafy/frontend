import { fetchApi } from '../../assets/js/core_api.js';

/**
 * 1. 진단할 내 식물 목록 가져오기
 */
export async function getMyPlantsForSelect() {
    // 페이징 없이 목록을 가져오기 위해 size를 넉넉하게 잡음
    const response = await fetchApi('/api/v1/my-plants?size=100', { method: 'GET' });
    
    if (!response.ok) {
        throw new Error('식물 목록을 불러오는데 실패했습니다.');
    }
    return await response.json();
}

/**
 * 2. 식물 건강 진단 요청 (이미지 전송)
 */
export async function requestDiagnosis(myPlantId, imageFile) {
    const formData = new FormData();
    formData.append('myPlantId', myPlantId);
    formData.append('image', imageFile);
    
    // 위치 정보 (필요시 주석 해제)
    // formData.append('lat', 37.5); 
    // formData.append('lon', 127.0);

    return fetchApi('/api/v1/diagnosis', {
        method: 'POST',
        body: formData,
        // 이제 여기서 headers를 조작할 필요가 없습니다. core_api.js가 처리합니다.
    });
}