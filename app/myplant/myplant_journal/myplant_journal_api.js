import { fetchApi } from '../../../assets/js/core_api.js';

/**
 * 성장일지 생성 API 호출
 * POST /api/v1/plants/{plantId}/journal
 */
export async function createGrowthRecord(plantId, data) {
    try {
        const response = await fetchApi(`/api/v1/plants/${plantId}/journal`, {
            method: 'POST',
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

/**
 * 성장일지 목록 조회 API 호출
 * GET /api/v1/plants/{plantId}/journal
 */
export async function getGrowthJournals(plantId) {
    try {
        const response = await fetchApi(`/api/v1/plants/${plantId}/journal`, {
            method: 'GET',
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

// [NEW] 이미지 파일만 서버(S3)로 보내고 URL을 받아오는 함수
export async function uploadImageFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetchApi('/api/images/upload', {
            method: 'POST',
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

/**
 * 성장일지 상세 조회 API 호출 (정확한 경로로 수정!)
 */
export async function getJournalDetail(recordId) {
    const response = await fetchApi(`/api/v1/journal/${recordId}`, {
        method: 'GET'
    });

    if (!response.ok) throw new Error('상세 조회 실패');
    return await response.json();
}

/**
 * 성장일지 삭제 API 호출 (백엔드 정확한 경로!)
 * DELETE /api/v1/journal/{recordId}
 */
export async function deleteJournal(recordId) {
    try {
        const response = await fetchApi(`/api/v1/journal/${recordId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || '삭제 실패');
        }
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
}
/**
 * [NEW] 성장일지 수정 API 호출
 * PATCH /api/v1/journal/{recordId}
 */
export async function updateGrowthJournal(recordId, updateData) {
    try {
        const response = await fetchApi(`/api/v1/journal/${recordId}`, {
            method: "PATCH",
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "일지 수정에 실패했습니다.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating journal:", error);
        throw error;
    }
}

