import { getMySchedules } from '../calendar/schedule_api.js';

lucide.createIcons();

const listEl = document.getElementById('alarmList');

async function loadAlarms() {
    try {
        const schedules = await getMySchedules();

        // 추가된 순서대로 정렬 (scheduleId 오름차순 = 내가 먼저 추가한 순)
        const sorted = schedules.sort((a, b) => a.scheduleId - b.scheduleId);

        if (sorted.length === 0) {
            listEl.innerHTML = `
                <div class="empty">
                    아직 추가된 일정이 없어요<br>
                    캘린더에서 일정을 추가해보세요!
                </div>
            `;
            return;
        }

        sorted.forEach(s => {
            const type = s.scheduleType.toLowerCase();
            let icon = '';
            let color = '';

            if (type === 'water') {
                icon = 'droplets';
                color = 'bg-blue';
            } else if (type === 'repot') {
                icon = 'scissors';
                color = 'bg-yellow';
            } else {
                icon = 'sprout';
                color = 'bg-green';
            }

            const card = document.createElement('div');
            card.className = 'schedule-card';
            card.innerHTML = `
                <div class="icon-circle ${color}">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="info">
                    <p>${s.plantNickname || '알 수 없음'} - ${getTypeName(type)}</p>
                    <span>${s.nextDueDate} 예정</span>
                </div>
            `;
            listEl.appendChild(card);
        });

        lucide.createIcons(); // 새로 추가된 아이콘 렌더링
    } catch (e) {
        console.error('알람 로드 실패:', e);
        listEl.innerHTML = `<div class="empty">일정을 불러오지 못했어요</div>`;
    }
}

function getTypeName(type) {
    const names = { water: '물주기', repot: '분갈이', fertilize: '비료주기' };
    return names[type] || type;
}

// 페이지 로드 시 실행
loadAlarms();