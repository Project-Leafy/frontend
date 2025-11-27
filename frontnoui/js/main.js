console.log("[main.js loaded]");

/* -------------------- 전역 상태 -------------------- */
let isLoggedIn = false;
let currentScreen = null;
let previousScreen = null;
let currentTab = "home";

let selectedPlant = null;
let selectedJournal = null;

/* -------------------- 기본 데이터 -------------------- */
let plants = [
  {
    id: "1",
    name: "몬스테라",
    species: "Monstera Deliciosa",
    nickname: "초록이",
    adoptionDate: "2024-06-28",
    imageUrl:
      "https://images.unsplash.com/photo-1648528203163-8604bf696e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    lastWatered: "2025-10-20",
  },
  {
    id: "2",
    name: "산세비에리아",
    species: "Sansevieria Trifasciata",
    nickname: "공기요정",
    adoptionDate: "2024-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1613498630970-f2a333cb4974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    lastWatered: "2025-10-18",
  },
  {
    id: "3",
    name: "스투키",
    species: "Sansevieria Stuckyi",
    nickname: "뾰족이",
    adoptionDate: "2024-09-01",
    imageUrl:
      "https://images.unsplash.com/photo-1550207477-85f418dc3448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    lastWatered: "2025-10-22",
  },
];

let journals = [
  {
    id: "1",
    plantId: "1",
    plantNickname: "초록이",
    date: "2025-10-24",
    images: [
      "https://images.unsplash.com/photo-1624421719748-179e1a8e956d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    memo: "새순이 나왔어요! 정말 기쁘네요 ☺️",
    tags: ["새순", "성장"],
  },
  {
    id: "2",
    plantId: "1",
    plantNickname: "초록이",
    date: "2025-10-20",
    images: [
      "https://images.unsplash.com/photo-1648528203163-8604bf696e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    memo: "오늘 물을 주었습니다. 흙이 많이 말라있었어요.",
    tags: ["물주기"],
  },
  {
    id: "3",
    plantId: "2",
    plantNickname: "공기요정",
    date: "2025-10-18",
    images: [
      "https://images.unsplash.com/photo-1613498630970-f2a333cb4974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    memo: "잎이 더욱 건강해 보여요.",
    tags: ["성장"],
  },
];

/* --------------------  상태 변경 핸들러 -------------------- */
function handleLogin() {
  isLoggedIn = true;
  navigateTo("home");
}

function handleAddPlant(plant) {
  plants.push(plant);
  currentTab = "home";
  navigateTo("home");
}

function handleAddJournal(journal) {
  journals.unshift(journal);
  navigateTo("plantDetail", selectedPlant);
}

function handleDeletePlant(id) {
  plants = plants.filter((p) => p.id !== id);
  journals = journals.filter((j) => j.plantId !== id); // 🔥 수정됨
  navigateTo("home");
}

function handleDeleteJournal(id) {
  journals = journals.filter((j) => j.id !== id);
  navigateTo("plantDetail", selectedPlant);
}

/* --------------------  네비게이션 -------------------- */
function navigateTo(screen, payload = null) {
  // 🔥 previousScreen 저장 규칙
  // 로그인 이동, 탭 이동, 자기 자신 이동은 저장 ❌
  const tabScreens = ["home", "feed", "recommendations", "calendar"];

  if (
    currentScreen &&                     // 시작 이전 undefined 방지
    currentScreen !== screen &&          // 자기 자신 재렌더 방지
    screen !== "login" &&                // 로그인 이동시 기록 ❌
    !(tabScreens.includes(currentScreen) && tabScreens.includes(screen)) // 탭 ↔ 탭 이동 기록 ❌
  ) {
    previousScreen = currentScreen;      // ⭕ 정상적으로 직전 화면 기억
  }

  currentScreen = screen;


  switch (screen) {
    case "login":
      return renderLoginScreen({ onLogin: handleLogin });

    case "home":
      return renderHomeScreen({
        plants,
        onPlantClick: (p) => navigateTo("plantDetail", p),
        onAddPlant: () => navigateTo("plantRegistration"),
        onProfileClick: () => navigateTo("profile"),
        onNotificationsClick: () => navigateTo("notifications"),
        onDeletePlant: handleDeletePlant,
      });

    case "feed":
      return renderFeedScreen({
        journals,
        onJournalClick: (j) => navigateTo("journalDetail", j),
        onProfileClick: () => navigateTo("profile"),
      });

    case "recommendations":
      return renderRecommendationScreen({
        onProfileClick: () => navigateTo("profile"),
        onViewResults: () => navigateTo("recommendationResults"),
      });

    case "recommendationResults":
      return renderRecommendationResultsScreen({
        onBack: () => navigateTo("recommendations"),
        onFindStores: () => navigateTo("storeFinder"),
        onRestartSurvey: () => navigateTo("recommendations"),
      });

    case "calendar":
      return renderCalendarScreen({
        plants,
        onProfileClick: () => navigateTo("profile"),
      });

    case "profile":
      return renderProfileScreen({
        plants,
        journals,
        onBack: () => navigateTo(previousScreen || "home"),
        onLogout: () => navigateTo("login"),
      });

    case "plantDetail":
      selectedPlant = payload;
      return renderPlantDetailScreen({
        plant: selectedPlant,
        journals: journals.filter((j) => j.plantId === selectedPlant.id),
        onBack: () => navigateTo("home"),
        onAddJournal: () => navigateTo("addJournal"),
        onJournalClick: (j) => navigateTo("journalDetail", j),
        onInfoClick: () => navigateTo("plantInfo", selectedPlant),
      });

    case "addJournal":
      return renderAddJournalScreen({
        plant: selectedPlant,
        onBack: () => navigateTo("plantDetail", selectedPlant),
        onSave: handleAddJournal,
      });

    case "journalDetail":
      selectedJournal = payload;
      return renderJournalDetailScreen({
        journal: selectedJournal,
        onBack: () =>
          selectedJournal.plantId === selectedPlant?.id
            ? navigateTo("plantDetail", selectedPlant)
            : navigateTo("feed"),
        onDelete: handleDeleteJournal,
      });

    case "plantRegistration":
      return renderPlantRegistrationFlow({
        onBack: () => navigateTo("home"),
        onComplete: handleAddPlant,
      });

    case "diagnosis":
      return renderDiagnosisFlow({
        plants,
        onBack: () => navigateTo(currentTab),
        onSaveDiagnosis: handleAddJournal,
      });

    case "plantInfo":
      return renderPlantInfoScreen({
        plant: selectedPlant,
        onBack: () => navigateTo("plantDetail", selectedPlant),
      });

    case "notifications":
      return renderNotificationsScreen({
        plants,
        onBack: () => navigateTo("home"),
        onNavigateToPlant: (p) => navigateTo("plantDetail", p),
        onNavigateToCalendar: () => navigateTo("calendar"),
      });

    case "storeFinder":
      return renderStoreFinderScreen({
        onBack: () => navigateTo("recommendationResults"),
      });
  }
}

/* -------------------- 최초 실행 -------------------- */
navigateTo("login");
