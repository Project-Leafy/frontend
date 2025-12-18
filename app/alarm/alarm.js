import { getMySchedules } from '../calendar/schedule_api.js';

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 타입별 한글 변환
function getTypeName(type) {
    const names = { water: '물주기', repot: '분갈이', fertilize: '비료주기' };
    return names[type.toLowerCase()] || type;
}

// 아이콘 및 색상 설정
function getIconInfo(type) {
    const t = type.toLowerCase();
    if (t === 'water') return { icon: 'droplets', color: 'bg-blue' };
    if (t === 'repot') return { icon: 'scissors', color: 'bg-yellow' }; // 가위 대신 삽 아이콘(shovel)이 있다면 변경 가능
    return { icon: 'sprout', color: 'bg-green' };
}

// 개별 카드 HTML 생성 함수
function createCardHTML(schedule) {
    const { icon, color } = getIconInfo(schedule.scheduleType);
    const typeName = getTypeName(schedule.scheduleType);
    const plantName = schedule.plantNickname || '내 식물';
    const dateStr = formatDate(schedule.nextDueDate);

    return `
        <div class="schedule-card">
            <div class="icon-circle ${color}">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="info">
                <p>${plantName} - ${typeName}</p>
                <span>${dateStr} 예정</span>
            </div>
        </div>
    `;
}

// 메인 로직
async function loadAlarms() {
    const listEl = document.getElementById('alarmList');
    
    try {
        const schedules = await getMySchedules();

        if (!schedules || schedules.length === 0) {
            listEl.innerHTML = `
                <div class="empty">
                    <img src="https://img.icons8.com/ios/100/cccccc/alarm.png" alt="empty" style="width:50px; margin-bottom:10px; opacity:0.5;">
                    <p>등록된 일정이 없어요<br>새로운 식물을 등록해보세요!</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        // --- [날짜별 그룹화 로직] ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 초기화 (오늘 00시 00분)

        const pastList = [];
        const todayList = [];
        const futureList = [];

        schedules.forEach(s => {
            const dueDate = new Date(s.nextDueDate);
            dueDate.setHours(0, 0, 0, 0); // 비교 대상 날짜도 시간 초기화

            if (dueDate < today) {
                pastList.push(s);
            } else if (dueDate.getTime() === today.getTime()) {
                todayList.push(s);
            } else {
                futureList.push(s);
            }
        });

        // 정렬: 과거 일정은 오래된 순, 미래 일정은 가까운 순
        const sortByDate = (a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate);
        pastList.sort(sortByDate);
        todayList.sort(sortByDate);
        futureList.sort(sortByDate);

        // --- [HTML 렌더링] ---
        let finalHtml = '';

        // 1. 오늘 알람 (가장 중요)
        if (todayList.length > 0) {
            finalHtml += `
                <div class="alarm-section">
                    <h3 class="section-title text-red">🚨 오늘 해야 할 일 (${todayList.length})</h3>
                    ${todayList.map(createCardHTML).join('')}
                </div>
            `;
        }

        // 2. 다가오는 알람
        if (futureList.length > 0) {
            finalHtml += `
                <div class="alarm-section">
                    <h3 class="section-title">📅 다가오는 일정</h3>
                    ${futureList.map(createCardHTML).join('')}
                </div>
            `;
        }

        // 3. 지나간 알람
        if (pastList.length > 0) {
            finalHtml += `
                <div class="alarm-section">
                    <h3 class="section-title text-gray">⚠️ 놓친 일정 (${pastList.length})</h3>
                    ${pastList.map(createCardHTML).join('')}
                </div>
            `;
        }

        listEl.innerHTML = finalHtml;
        lucide.createIcons(); // 아이콘 렌더링

    } catch (e) {
        console.error('알람 로드 실패:', e);
        listEl.innerHTML = `<div class="empty">일정을 불러오지 못했어요.</div>`;
    }
}

// 실행
document.addEventListener('DOMContentLoaded', loadAlarms);