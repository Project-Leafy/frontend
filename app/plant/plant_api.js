import { fetchApi } from '../../assets/js/core_api.js';

/**
* 백엔드 API로부터 현재 로그인한 사용자의 '내 식물' 목록을 가져옵니다.
* @returns {Promise<Array>} 내 식물 목록 데이터 Promise
*/
export async function getMyPlants() {
// 백엔드에 구현된 '/api/v1/my-plants' 엔드포인트를 호출합니다.
    const response = await fetchApi('/api/v1/my-plants', {
        method: 'GET',
    });

    if (!response.ok) {
    throw new Error('내 식물 목록을 가져오는데 실패했습니다.');
    }

    return response.json();
}

/**
 * 백엔드 API로부터 식물 목록을 가져옵니다.
 * @returns {Promise<any>} 식물 목록 데이터 Promise
 */
export async function getPlants() {
    const response = await fetchApi('/api/v1/plants', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('식물 목록을 가져오는데 실패했습니다.');
    }

    return response.json();
}

// 예: 특정 식물의 상세 정보를 가져오는 함수
/**
 * 특정 식물의 상세 정보를 가져옵니다.
 * @param {number} plantId - 식물 ID
 * @returns {Promise<any>} 식물 상세 정보 데이터 Promise
 */
export async function getPlantById(plantId) {
    const response = await fetchApi(`/api/v1/plants/${plantId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('식물 상세 정보를 가져오는데 실패했습니다.');
    }

    return response.json();
}
