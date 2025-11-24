// js/ui/calendar.js

const calendarBody = document.getElementById("calendar-body");
const monthLabel = document.querySelector(".month-label");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar(month, year) {
  calendarBody.innerHTML = "";
  monthLabel.textContent = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay) {
        cell.classList.add("empty");
      } else if (date > daysInMonth) {
        cell.classList.add("empty");
      } else {
        cell.textContent = date;
        cell.classList.add("day");
        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          cell.classList.add("today");
        }
        cell.addEventListener("click", () => {
          document.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected"));
          cell.classList.add("selected");
        });
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

renderCalendar(currentMonth, currentYear);
