import { BACKEND_URL } from '/assets/js/config.js';

const BASE_URL = `${BACKEND_URL}/api/v1/schedules`;

// 1. 내 일정 전체 조회
export async function getMySchedules() {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    try {
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('일정 불러오기 실패');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// 2. 일정 추가
export async function addSchedule(scheduleData) {
    const token = localStorage.getItem('accessToken');
    
    const payload = {
        plant_id: scheduleData.plant_id,
        schedule_type: scheduleData.schedule_type,
        next_due_date: scheduleData.next_due_date,
        frequency_days: scheduleData.frequency_days
    };

    console.log('최종 전송 데이터:', payload); // ✅ 디버깅용
    console.log('plant_id 타입:', typeof payload.plant_id);
    console.log('frequency_days 타입:', typeof payload.frequency_days); // ✅ 디버깅용

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || '일정 추가 실패');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function deleteSchedule(scheduleId) {
    const token = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch(`${BASE_URL}/${scheduleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('일정 삭제 실패');
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * [추가] 초기 스케줄 일괄 생성
 * @param {Array<object>} scheduleRequests - 스케줄 설정 요청 객체 배열
 */
export async function createInitialSchedules(scheduleRequests) {
    const token = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch(`${BASE_URL}/initial-setup`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleRequests)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || '초기 일정 설정에 실패했습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}