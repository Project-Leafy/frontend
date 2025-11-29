/* PlantInfoScreen.js */

// Global care list data (static)
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


// Main render function for Plant Info Screen
async function renderPlantInfoScreen({ plant, onBack }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/PlantInfoScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Get DOM elements after HTML is loaded
    const plantCommonNameEl = document.getElementById("plantCommonName");
    const plantSpeciesEl = document.getElementById("plantSpecies");
    const plantDescriptionEl = document.getElementById("plantDescription");
    const careWrapper = document.getElementById("careList");
    const backBtn = document.getElementById("backBtn");
    const dialogOverlay = document.getElementById("dialogOverlay");
    const dialogText = document.getElementById("dialogText");
    const frequencySelect = document.getElementById("frequencySelect");
    const cancelDialogBtn = document.getElementById("cancelDialog");
    const confirmDialogBtn = document.getElementById("confirmDialog");

    if (plantCommonNameEl) {
      plantCommonNameEl.textContent = `${plant.name} 정보`;
    } else { console.error("plantCommonName element not found"); }

    if (plantSpeciesEl) {
      plantSpeciesEl.textContent = plant.species;
    } else { console.error("plantSpecies element not found"); }

    if (plantDescriptionEl) {
      plantDescriptionEl.textContent = `${plant.name}은(는) 열대 지역이 원산지인 실내 인기 식물입니다.`;
    } else { console.error("plantDescription element not found"); }


    // 관리 리스트 출력
    if (careWrapper) {
      careWrapper.innerHTML = ''; // Clear existing content
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
                `<button class="notify-btn" id="notify-btn-${info.title.replace(/\s/g, '')}">
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
      lucide.createIcons(); // Re-create icons after adding new content
    } else { console.error("careList element not found"); }


    // Attach event listeners for notification buttons
    careList.filter(info => info.notification).forEach(info => {
        const notifyBtn = document.getElementById(`notify-btn-${info.title.replace(/\s/g, '')}`);
        if (notifyBtn) {
            notifyBtn.onclick = () => {
                if (dialogText && dialogOverlay) {
                    dialogText.textContent = `${plant.nickname}의 ${info.title} 알림 주기를 설정하세요`;
                    dialogOverlay.classList.remove("hidden");
                } else {
                    console.error("Dialog elements not found for notification");
                }
            };
        }
    });


    // 뒤로가기
    if (backBtn) {
      backBtn.addEventListener("click", onBack);
    } else { console.error("backBtn element not found"); }


    // Dialog close buttons
    if (cancelDialogBtn) {
      cancelDialogBtn.onclick = () => {
        if (dialogOverlay) dialogOverlay.classList.add("hidden");
      };
    } else { console.error("cancelDialog button not found"); }

    if (confirmDialogBtn) {
      confirmDialogBtn.onclick = () => {
        const freq = frequencySelect ? frequencySelect.value : '0';
        alert(`알림이 ${freq}일마다 설정되었습니다`);
        if (dialogOverlay) dialogOverlay.classList.add("hidden");
      };
    } else { console.error("confirmDialog button not found"); }

  } catch (error) {
    console.error("Failed to load PlantInfoScreen.html:", error);
  }
}