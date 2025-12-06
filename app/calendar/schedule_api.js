import { BACKEND_URL } from '../../assets/js/config.js';

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
// 2. 일정 추가
export async function addSchedule(scheduleData) {
    const token = localStorage.getItem('accessToken');
    
    // ✅ 명시적으로 숫자로 변환
    // ▼▼▼ 여기를 수정하세요! (키 이름을 밑줄로 변경) ▼▼▼
    const payload = {
        plant_id: scheduleData.plant_id,
        schedule_type: scheduleData.schedule_type,
        next_due_date: scheduleData.next_due_date,
        recurrence_pattern: scheduleData.recurrence_pattern
    };

    console.log('최종 전송 데이터:', payload); // ✅ 디버깅용
    console.log('plant_id 타입:', typeof payload.plant_id);
    console.log('recurrence_pattern 타입:', typeof payload.recurrence_pattern); // ✅ 디버깅용

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