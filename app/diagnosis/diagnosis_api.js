import { fetchApi } from '/assets/js/core_api.js';

/**
 * 특정 식물의 모든 진단 기록을 가져옵니다.
 * @param {number} myPlantId - '내 식물'의 ID
 * @returns {Promise<Array>} 진단 기록 목록 Promise
 */
export async function getDiagnosisHistory(myPlantId) {
    const response = await fetchApi(`/api/v1/diagnosis/plants/${myPlantId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('진단 기록을 가져오는데 실패했습니다.');
    }
    return response.json();
}
