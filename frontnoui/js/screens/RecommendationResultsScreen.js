// global data for recommended plants
const recommendedPlants = [
  {
    id: "1",
    name: "스투키",
    scientific: "Sansevieria Stuckyi",
    imageUrl: "https://images.unsplash.com/photo-1550207477-85f418dc3448?auto=format&q=80&w=1080",
    light: "적은 햇빛",
    water: "2주에 1번",
    difficulty: "초보자",
    description: "공기정화 능력이 뛰어나고 관리가 쉬운 식물입니다.",
    detailedInfo: {
      temperature: "15~30°C",
      humidity: "30~50% (건조한 환경 선호)",
      soil: "배수가 잘 되는 다육용 흙",
      growth: "느린 성장, 연중 성장",
      toxicity: "반려동물에게 약한 독성",
      airPurification: "밤에도 산소 배출",
    },
  },
  {
    id: "2",
    name: "금전수",
    scientific: "Zamioculcas Zamiifolia",
    imageUrl: "https://images.unsplash.com/photo-1596724878582-76f1a8fdc24f?auto=format&q=80&w=1080",
    light: "적은 햇빛",
    water: "2–3주에 1번",
    difficulty: "초보자",
    description: "물을 자주 주지 않아도 되어 바쁜 분들에게 적합합니다.",
    detailedInfo: {
      temperature: "18~26°C",
      humidity: "40~60%",
      soil: "배수가 잘 되는 흙",
      growth: "느린 성장, 봄~여름 활발",
      toxicity: "반려동물과 어린이에게 독성",
      airPurification: "유해물질 제거 능력 우수",
    },
  },
  {
    id: "3",
    name: "산세비에리아",
    scientific: "Sansevieria Trifasciata",
    imageUrl: "https://images.unsplash.com/photo-1613498630970-f2a333cb4974?auto=format&q=80&w=1080",
    light: "적은~보통 햇빛",
    water: "2주에 1번",
    difficulty: "초보자",
    description: "강한 생명력으로 어두운 실내에서도 잘 자랍니다.",
    detailedInfo: {
      temperature: "15~30°C",
      humidity: "30~50%",
      soil: "배수가 잘 되는 흙",
      growth: "느린 성장",
      toxicity: "반려동물에게 독성이 있을 수 있음",
      airPurification: "포름알데히드 제거 능력 탁월",
    },
  },
];

const fallbackImg = "../assets/placeholder.png"; // Defined here for broader scope if needed


// The main render function for the Recommendation Results Screen, called by main.js
async function renderRecommendationResultsScreen({ onBack, onFindStores, onRestartSurvey }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/RecommendationResultsScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Now select elements as they are available in the DOM
    const list = document.getElementById("recommendationList");
    const backBtn = document.getElementById("backBtn");
    const restartBtn = document.getElementById("restartBtn");
    const findStoreBtn = document.getElementById("findStoreBtn");

    // 상세 팝업 DOM (needs to be defined inside render function or globally accessible)
    const overlay = document.getElementById("detailOverlay");
    const detailName = document.getElementById("detailName");
    const detailScientific = document.getElementById("detailScientific");
    const detailImage = document.getElementById("detailImage");
    const detailDescription = document.getElementById("detailDescription");
    const detailInfoGrid = document.getElementById("detailInfoGrid");
    const detailLight = document.getElementById("detailLight");
    const detailWater = document.getElementById("detailWater");
    const detailDifficulty = document.getElementById("detailDifficulty");
    const closeDetailBtn = document.getElementById("closeDetailBtn");

    /* 팝업 열기 */
    function openDetail(p) {
        if (!overlay || !detailName || !detailScientific || !detailImage || !detailDescription || !detailInfoGrid || !detailLight || !detailWater || !detailDifficulty) {
            console.error("One or more detail popup DOM elements not found.");
            return;
        }
        detailName.textContent = p.name;
        detailScientific.textContent = p.scientific;
        detailImage.src = p.imageUrl;
        detailDescription.textContent = p.description;

        detailInfoGrid.innerHTML = `
            <div><b>온도</b><br>${p.detailedInfo.temperature}</div>
            <div><b>습도</b><br>${p.detailedInfo.humidity}</div>
            <div><b>토양</b><br>${p.detailedInfo.soil}</div>
            <div><b>성장 속도</b><br>${p.detailedInfo.growth}</div>
            <div><b>독성</b><br>${p.detailedInfo.toxicity}</div>
            <div><b>공기정화</b><br>${p.detailedInfo.airPurification}</div>
        `;

        detailLight.textContent = p.light;
        detailWater.textContent = p.water;
        detailDifficulty.textContent = p.difficulty;

        overlay.classList.remove("hidden");
        lucide.createIcons();
    }

    /* 팝업 닫기 */
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener("click", () => overlay.classList.add("hidden"));
    } else {
        console.error("closeDetailBtn not found");
    }
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.add("hidden");
        });
    }


    /* 리스트 렌더 */
    if (list) {
        list.innerHTML = ''; // Clear existing content before rendering
        recommendedPlants.forEach((p) => {
            const card = document.createElement("button");
            card.className = "recommend-card";
            card.innerHTML = `
                <img src="${p.imageUrl}" class="recommend-img" onerror="this.src='${fallbackImg}'" />
                <div class="recommend-body">
                    <h3 class="recommend-title">${p.name}</h3>
                    <p class="recommend-sub">${p.scientific}</p>
                    <p class="rec-desc">${p.description}</p>
                    <div class="feature-grid">
                        <div class="feature-box feature-light"><i data-lucide="sun"></i> ${p.light}</div>
                        <div class="feature-box feature-water"><i data-lucide="droplets"></i> ${p.water}</div>
                        <div class="feature-box feature-hard"><i data-lucide="leaf"></i> ${p.difficulty}</div>
                    </div>
                </div>
            `;
            card.addEventListener("click", () => openDetail(p));
            list.appendChild(card);
        });
        lucide.createIcons(); // Re-create icons after rendering new content
    } else {
        console.error("recommendationList not found");
    }


    /* 네비 */
    if (backBtn) {
      backBtn.addEventListener("click", onBack);
    } else {
      console.error("backBtn not found in RecommendationResultsScreen");
    }
    if (restartBtn) {
      restartBtn.addEventListener("click", onRestartSurvey);
    } else {
      console.error("restartBtn not found in RecommendationResultsScreen");
    }
    if (findStoreBtn) {
      findStoreBtn.addEventListener("click", onFindStores);
    } else {
      console.error("findStoreBtn not found in RecommendationResultsScreen");
    }

  } catch (error) {
    console.error("Failed to load RecommendationResultsScreen.html:", error);
  }
}