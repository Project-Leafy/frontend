/* PlantInfoScreen.js */
const plant = JSON.parse(localStorage.getItem("currentPlant"));

const careList = [
  {
    icon: "droplets",
    bg: "#DBEAFE",
    color: "#3B82F6",
    title: "물주기",
    desc: "봄~가을: 주 1회, 겨울: 2주에 1회",
    detail: "흙이 말랐을 때 물을 충분히 주세요. 고인 물은 바로 버려야 합니다.",
    notification: true
  },
  {
    icon: "sun",
    bg: "#FEF3C7",
    color: "#F59E0B",
    title: "햇빛",
    desc: "밝은 간접광",
    detail: "직사광선은 피하세요. 빛이 약하면 성장이 느려짐.",
  },
  {
    icon: "thermometer",
    bg: "#FECACA",
    color: "#EF4444",
    title: "온도",
    desc: "18~27°C",
    detail: "겨울철에는 15°C 이하로 내려가지 않도록 주의.",
  },
  {
    icon: "wind",
    bg: "#E0E7FF",
    color: "#6366F1",
    title: "습도",
    desc: "40~60%",
    detail: "건조 시 분무 / 가습기 추천.",
  },
  {
    icon: "leaf",
    bg: "#E8F4EC",
    color: "#4A7C59",
    title: "비료",
    desc: "성장기 월 1회",
    detail: "액체 비료 희석 후 사용, 겨울에는 중단.",
  },
  {
    icon: "scissors",
    bg: "#FEF3C7",
    color: "#F59E0B",
    title: "분갈이",
    desc: "1~2년에 1회",
    detail: "뿌리 돌출 / 성장 지연 시 분갈이.",
  }
];

document.getElementById("plantCommonName").textContent = `${plant.name} 정보`;
document.getElementById("plantSpecies").textContent = plant.species;
document.getElementById("plantDescription").textContent =
  `${plant.name}은(는) 열대 지역이 원산지인 실내 인기 식물입니다.`;

// 관리 리스트 출력
const careWrapper = document.getElementById("careList");
careList.forEach(info => {
  const card = document.createElement("div");
  card.className = "care-card";

  card.innerHTML = `
    <div class="care-icon" style="background:${info.bg}">
      <i data-lucide="${info.icon}" style="color:${info.color}"></i>
    </div>
    <div class="care-info">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4>${info.title}</h4>
        ${info.notification ?
            
          `<button class="notify-btn" onclick="openNotificationDialog('${info.title}')">
            <i data-lucide="bell" class="notify-icon"></i>
                <span>알림 설정</span>
                </button>` : ""}
      </div>
      <p>${info.desc}</p>
      <p style="font-size:13px;color:#9CA3AF;margin-top:4px">${info.detail}</p>
    </div>
  `;
  careWrapper.appendChild(card);
});

// 뒤로가기
document.getElementById("backBtn").addEventListener("click", () => history.back());

// Dialog
const dialogOverlay = document.getElementById("dialogOverlay");
const dialogText = document.getElementById("dialogText");
const frequencySelect = document.getElementById("frequencySelect");

window.openNotificationDialog = (title) => {
  dialogText.textContent = `${plant.nickname}의 ${title} 알림 주기를 설정하세요`;
  dialogOverlay.classList.remove("hidden");
};

document.getElementById("cancelDialog").onclick = () =>
  dialogOverlay.classList.add("hidden");

document.getElementById("confirmDialog").onclick = () => {
  const freq = frequencySelect.value;
  alert(`알림이 ${freq}일마다 설정되었습니다`);
  dialogOverlay.classList.add("hidden");
};

// 아이콘 렌더링
lucide.createIcons();
