// =============================================================
// CalendarScreen.js
// React 없이 CalendarScreen.tsx의 기능 전체 구현
// 전역 함수 initCalendarScreen() 으로 페이지 초기화
// =============================================================

// 전역 상태
let plantsData = [];
let onProfileClickCallback = null;

let currentDate = new Date(2025, 9, 25); // TSX와 동일: 2025년 10월 25일
let selectedDay = null;

// 일정 데이터 (Mock + 추가 가능)
let scheduleData = {
  20: [{ type: "water", plant: "초록이" }],
  25: [
    { type: "water", plant: "초록이" },
    { type: "water", plant: "공기요정" }
  ],
  27: [{ type: "water", plant: "뾰족이" }],
  30: [{ type: "repot", plant: "공기요정" }]
};

// 요소 참조
const monthTitleEl = () => document.getElementById("monthTitle");
const calendarGridEl = () => document.getElementById("calendarGrid");
const upcomingListEl = () => document.getElementById("upcomingList");

// 모달 요소들
const dayDetailModal = () => document.getElementById("dayDetailModal");
const dayDetailTitleEl = () => document.getElementById("dayDetailTitle");
const dayDetailItemsEl = () => document.getElementById("dayDetailItems");

const addScheduleModal = () => document.getElementById("addScheduleModal");
const scheduleDateInput = () => document.getElementById("scheduleDate");
const schedulePlantSelect = () => document.getElementById("schedulePlant");
const scheduleTypeSelect = () => document.getElementById("scheduleType");

// =============================================================
// Helpers
// =============================================================

function getDaysInMonth(date) {
  const y = date.getFullYear();
  const m = date.getMonth();

  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startingDayOfWeek = firstDay.getDay();
  const days = [];

  // 앞의 빈칸
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);

  // 날짜 채우기
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return days;
}

function isToday(day) {
  const now = new Date();
  return (
    day === now.getDate() &&
    currentDate.getMonth() === now.getMonth() &&
    currentDate.getFullYear() === now.getFullYear()
  );
}

function getScheduleIconHTML(type, forToday) {
  if (type === "water") {
    return `<svg width="12" height="12" stroke="${forToday ? "white" : "#3B82F6"}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3.1a1.9 1.9 0 0 1-3.8 0c0-.7.4-1.4 1-1.8l.9-1 .9 1c.6.4 1 1.1 1 1.8z"></path>
            </svg>`;
  } else {
    return `<svg width="12" height="12" stroke="${forToday ? "white" : "#F59E0B"}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="6" r="4"></circle>
              <line x1="6" y1="0" x2="6" y2="4"></line>
            </svg>`;
  }
}

// =============================================================
// Rendering
// =============================================================

function renderMonthTitle() {
  const title = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long"
  });
  monthTitleEl().textContent = title;
}

function renderCalendar() {
  const grid = calendarGridEl();
  grid.innerHTML = "";

  const days = getDaysInMonth(currentDate);

  days.forEach((day) => {
    const btn = document.createElement("button");

    btn.className = "calendar-day";

    // 빈칸
    if (day === null) {
      btn.classList.add("disabled");
      grid.appendChild(btn);
      return;
    }

    // 오늘
    if (isToday(day)) {
      btn.classList.add("today");
    }

    // 일정 있는 날
    if (scheduleData[day]) {
      btn.classList.add("has-schedule");
    }

    btn.innerHTML = `
      <span class="calendar-day-number">${day}</span>
      <div class="calendar-icons">
        ${(scheduleData[day] || [])
          .slice(0, 2)
          .map((s) => getScheduleIconHTML(s.type, isToday(day)))
          .join("")}
      </div>
    `;

    btn.onclick = () => handleDayClick(day);
    grid.appendChild(btn);
  });
}

function renderUpcoming() {
  const list = upcomingListEl();
  list.innerHTML = "";

  // 단순 mock (TSX에서도 실제 로직과 별도)
  const mockUpcoming = [
    { plant: "초록이", type: "water", when: "오늘 (10월 25일)" },
    { plant: "뾰족이", type: "water", when: "2일 후 (10월 27일)" },
    { plant: "공기요정", type: "repot", when: "5일 후 (10월 30일)" }
  ];

  mockUpcoming.forEach((item) => {
    const div = document.createElement("div");
    div.className = "schedule-card";

    const bg =
      item.type === "water"
        ? "#DBEAFE"
        : "#FEF3C7";

    const iconColor =
      item.type === "water" ? "#3B82F6" : "#F59E0B";

    div.innerHTML = `
      <div class="schedule-icon" style="background:${bg}">
        <svg width="20" height="20" stroke="${iconColor}" fill="none" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          ${
            item.type === "water"
              ? `<path d="M12 3.1a1.9 1.9 0 0 1-3.8 0c0-.7.4-1.4 1-1.8l.9-1 .9 1c.6.4 1 1.1 1 1.8z"></path>`
              : `<circle cx="10" cy="10" r="6"></circle>`
          }
        </svg>
      </div>

      <div class="schedule-main">
        <p>${item.plant} ${item.type === "water" ? "물주기" : "분갈이"}</p>
        <span>${item.when}</span>
      </div>
    `;

    list.appendChild(div);
  });
}

// =============================================================
// Day Detail Modal
// =============================================================

function handleDayClick(day) {
  selectedDay = day;

  if (!scheduleData[day]) return;

  dayDetailTitleEl().textContent = `${currentDate.getMonth() + 1}월 ${day}일 일정`;

  dayDetailItemsEl().innerHTML = scheduleData[day]
    .map(
      (item) => `
      <div class="schedule-card" style="border:none; background:#F5F5F3;">
        <div class="schedule-icon" style="background:${
          item.type === "water" ? "#DBEAFE" : "#FEF3C7"
        };">
          ${getScheduleIconHTML(item.type, false)}
        </div>
        <div class="schedule-main">
          <p>${item.plant}</p>
          <span>${item.type === "water" ? "물주기" : item.type === "repot" ? "분갈이" : "비료주기"}</span>
        </div>
      </div>
    `
    )
    .join("");

  dayDetailModal().classList.remove("hidden");
}

// 모달 닫기
document.getElementById("dayDetailClose").onclick = () => {
  dayDetailModal().classList.add("hidden");
};

// =============================================================
// Add Schedule Modal
// =============================================================

document.getElementById("openAddSchedule").onclick = () => {
  addScheduleModal().classList.remove("hidden");
};

document.getElementById("addScheduleCancel").onclick = () => {
  addScheduleModal().classList.add("hidden");
};

document.getElementById("addScheduleConfirm").onclick = () => {
  const dateVal = scheduleDateInput().value;
  const plantId = schedulePlantSelect().value;
  const typeVal = scheduleTypeSelect().value;

  if (!dateVal || !plantId) {
    toastError("날짜와 식물을 선택해주세요");
    return;
  }

  const d = new Date(dateVal);
  const day = d.getDate();

  const plant = plantsData.find((p) => p.id === plantId);
  if (!plant) return;

  const newItem = {
    type: typeVal,
    plant: plant.nickname
  };

  scheduleData[day] = [...(scheduleData[day] || []), newItem];

  toastSuccess("일정이 추가되었습니다");

  addScheduleModal().classList.add("hidden");

  // UI 다시 렌더링
  renderCalendar();
};

// =============================================================
// Month Navigation
// =============================================================

document.getElementById("prevMonth").onclick = () => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  );
  renderMonthTitle();
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );
  renderMonthTitle();
  renderCalendar();
};

// =============================================================
// Profile Click
// =============================================================

document.getElementById("profileButton").onclick = () => {
  if (onProfileClickCallback) onProfileClickCallback();
};

// =============================================================
// Init Function
// =============================================================

window.initCalendarScreen = function (plants, onProfileClick) {
  plantsData = plants;
  onProfileClickCallback = onProfileClick;

  // 식물 select 채우기
  schedulePlantSelect().innerHTML = plants
    .map((p) => `<option value="${p.id}">${p.nickname} (${p.name})</option>`)
    .join("");

  renderMonthTitle();
  renderCalendar();
  renderUpcoming();
};
