import { fetchApi } from '/assets/js/core_api.js';

/**
 * [추가] 백엔드 API로부터 특정 '내 식물'의 상세 정보를 가져옵니다.
 * (main.html의 getMyPlants()와 동일하게 fetchApi를 사용한다고 가정)
 * @param {number} myPlantId - '내 식물'의 ID
 * @returns {Promise<any>} 내 식물 상세 정보 (plant.id 원본 JSON 포함)
 */
export async function getMyPlantDetail(myPlantId) {
    const response = await fetchApi(`/api/v1/my-plants/${myPlantId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('내 식물 상세 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
}

/**
 * 식물 식별 API(POST /api/v1/plants/identify)를 호출합니다.
 * FormData 객체를 인자로 받아 fetch 요청을 보냅니다.
 * Authorization 헤더에 localStorage에서 가져온 JWT 토큰을 포함시킵니다.
 * multipart/form-data 요청 시에는 Content-Type 헤더를 직접 설정하지 않습니다.
 * * @param {FormData} formData - 'image' 키를 포함하는 FormData 객체
 * @returns {Promise<any>} 식별 결과 데이터 Promise
 */
export async function identifyPlant(formData) {
    const response = await fetchApi('/api/v1/plants/identify', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('식물 식별에 실패했습니다.');
    }
    return response.json();
}

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

/**
 * [추가됨] 최종 식물 등록 API(POST /api/v1/my-plants)를 호출합니다.
 * @param {object} plantData - { speciesId, nickname, adoptionDate, imageUrl }
 * @returns {Promise<any>} 등록된 식물 정보 데이터 Promise
 */
export async function registerMyPlant(plantData) {
    const response = await fetchApi('/api/v1/my-plants', {
        method: 'POST',
        body: JSON.stringify(plantData)
    });

    if (!response.ok) {
        throw new Error('최종 식물 등록에 실패했습니다.');
    }
    return response.json();
}

// plant_api.js에 추가
export async function updateMyPlantInfo(plantId, updateData) {
    const response = await fetch(`/api/plants/${plantId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            // 인증 토큰이 필요하면 추가
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
    });

    if (!response.ok) {
        throw new Error('식물 정보 업데이트 실패');
    }

    return await response.json();
}

/**
 * [추가] 내 식물을 삭제하는 API(DELETE /api/v1/my-plants/{myPlantId})를 호출합니다.
 * @param {number} myPlantId - 삭제할 '내 식물'의 ID
 * @returns {Promise<Response>} HTTP 응답 Promise
 */
export async function deleteMyPlant(myPlantId) {
    const response = await fetchApi(`/api/v1/my-plants/${myPlantId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('내 식물 삭제에 실패했습니다.');
    }

    return response;
}
