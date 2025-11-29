console.log("[HomeScreen.js loaded]");

// main.js에서 window.renderHomeScreen({...}) 호출한다고 가정
window.renderHomeScreen = async function ({
  plants,
  onPlantClick,
  onAddPlant,
  onProfileClick,
  onNotificationsClick,
  onDeletePlant,
  navigateToTab, // 탭 이동 함수 (있으면)
}) {
  const app = document.getElementById("app");
  if (!app) {
    console.error("[HomeScreen] #app 요소를 찾지 못했습니다.");
    return;
  }

  // 1) HomeScreen.html 불러와서 app 안에 넣기
  try {
    const res = await fetch("./pages/HomeScreen.html");
    const html = await res.text();
    app.innerHTML = html;
  } catch (e) {
    console.error("[HomeScreen] HomeScreen.html 로드 실패", e);
    return;
  }

  // 2) Lucide 아이콘 렌더링
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }

  // 3) 상단 요소들 찾기
  const profileBtn =
    document.getElementById("profile-btn") ||
    document.getElementById("profile-icon");
  const notificationsBtn =
    document.getElementById("notifications-btn") ||
    document.getElementById("notifications-icon");
  const addPlantBtn = document.getElementById("add-plant-btn");
  const plantCountEl = document.getElementById("plant-count");
  const listEl = document.getElementById("plant-list");

  if (profileBtn && onProfileClick) profileBtn.onclick = onProfileClick;
  if (notificationsBtn && onNotificationsClick)
    notificationsBtn.onclick = onNotificationsClick;
  if (addPlantBtn && onAddPlant) addPlantBtn.onclick = onAddPlant;

  if (plantCountEl) {
    plantCountEl.textContent = `${plants.length}개의 식물과 함께 성장하고 있어요`;
  }

  if (!listEl) {
    console.warn("[HomeScreen] #plant-list 요소를 찾지 못했습니다.");
    return;
  }

  // 4) 삭제 다이얼로그 보장 생성
  ensureDeleteDialog();

  const deleteDialog = document.getElementById("deleteDialog");
  const dialogCancel = document.getElementById("dialogCancel");
  const dialogConfirm = document.getElementById("dialogConfirm");
  let deleteTargetId = null;

  if (dialogCancel && deleteDialog) {
    dialogCancel.onclick = () => {
      deleteDialog.classList.add("hidden");
    };
  }

  if (dialogConfirm && deleteDialog && onDeletePlant) {
    dialogConfirm.onclick = () => {
      if (deleteTargetId) {
        onDeletePlant(deleteTargetId);
      }
      deleteTargetId = null;
      deleteDialog.classList.add("hidden");
    };
  }

  // 5) 식물 카드 렌더링
  listEl.innerHTML = "";

  plants.forEach((p) => {
    const card = document.createElement("div");
    card.className = "hs-card";

    const togetherDays = p.adoptionDate ? daysSince(p.adoptionDate) : null;
    const lastWaterDays = p.lastWatered ? daysSince(p.lastWatered) : null;

    const togetherText =
      togetherDays != null ? `함께한 지 ${togetherDays}일` : "";
    let lastWaterText = "";
    if (lastWaterDays != null) {
      lastWaterText =
        lastWaterDays === 0
          ? "오늘 물주기"
          : `마지막 물주기: ${lastWaterDays}일 전`;
    }

    card.innerHTML = `
      <img class="hs-img" src="${p.imageUrl}" alt="${p.nickname}" />
      <button class="hs-delete-btn">
        <i data-lucide="trash-2"></i>
      </button>
      <div class="hs-card-body">
        <div class="hs-topline">
          <div class="nickname">${p.nickname}</div>
          <div class="type">${p.name}</div>
        </div>
        <div class="info">
          <span>${togetherText}</span>
          <span>${lastWaterText}</span>
        </div>
      </div>
    `;

    // 카드 전체 클릭 → 상세 화면
    card.addEventListener("click", () => {
      console.log("Plant card clicked:", p.nickname); // Added for debugging
      onPlantClick && onPlantClick(p);
    });

    // 삭제 버튼 클릭 → 다이얼로그 표시
    const delBtn = card.querySelector(".hs-delete-btn");
    if (delBtn && deleteDialog) {
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTargetId = p.id;
        deleteDialog.classList.remove("hidden");
      });
    }

    listEl.appendChild(card);
  });

  // 카드 안 trash 아이콘 다시 렌더
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }

  // 6) 하단 네비게이션 (있을 때만)
  if (navigateToTab) {
    const navHome = document.getElementById("nav-home");
    const navFeed = document.getElementById("nav-feed");
    const navDiag = document.getElementById("nav-diagnosis");
    const navReco = document.getElementById("nav-recommend");
    const navCal = document.getElementById("nav-calendar");

    if (navHome) navHome.onclick = () => navigateToTab("home");
    if (navFeed) navFeed.onclick = () => navigateToTab("feed");
    if (navDiag) navDiag.onclick = () => navigateToTab("diagnosis");
    if (navReco) navReco.onclick = () => navigateToTab("recommendations");
    if (navCal) navCal.onclick = () => navigateToTab("calendar");
  }
};

// 삭제 다이얼로그가 없으면 body에 생성
function ensureDeleteDialog() {
  if (document.getElementById("deleteDialog")) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div id="deleteDialog" class="hs-dialog-backdrop hidden">
      <div class="hs-dialog">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 8px 0;">식물을 삭제할까요?</h2>
        <p style="margin:0;color:#6b7280;font-size:14px;">
          삭제하면 해당 식물과 모든 기록이 사라집니다.
        </p>
        <div class="hs-dialog-buttons">
          <button id="dialogCancel" class="hs-cancel">취소</button>
          <button id="dialogConfirm" class="hs-confirm">삭제</button>
        </div>
      </div>
    </div>
  `;
  const dlg = wrapper.firstElementChild;
  document.body.appendChild(dlg);
}

// 날짜 차이 (일수)
function daysSince(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / 86400000);
}
