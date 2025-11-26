const fallbackImg = "../assets/placeholder.png";

/* 추천 식물 데이터 */
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

const list = document.getElementById("recommendationList");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");
const findStoreBtn = document.getElementById("findStoreBtn");

/* 상세 팝업 DOM */
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

/* 리스트 렌더 */
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

/* 팝업 열기 */
function openDetail(p) {
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
closeDetailBtn.addEventListener("click", () => overlay.classList.add("hidden"));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.add("hidden");
});

/* 네비 */
backBtn.addEventListener("click", () => history.back());
restartBtn.addEventListener("click", () => location.reload());
findStoreBtn.addEventListener("click", () => alert("준비 중입니다!"));

lucide.createIcons();
