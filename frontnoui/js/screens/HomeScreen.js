function HomeScreen({
  plants,
  onPlantClick,
  onAddPlant,
  onProfileClick,
  onNotificationsClick,
  onDeletePlant,
}) {
  const app = document.getElementById("app");

  let deletingPlant = null;

  renderScreen();

  function renderScreen() {
    app.innerHTML = `
      <div class="hs-header">
        <div class="hs-header-top">
          <h1 style="margin:0;font-size:22px;color:#2C3E2F">내 식물</h1>
          <div style="display:flex;gap:8px">
            <button id="hs-noti" class="hs-icon"><i data-lucide="bell"></i></button>
            <button id="hs-profile" class="hs-icon"><i data-lucide="user"></i></button>
          </div>
        </div>
        <p class="subtitle">${plants.length}개의 식물과 함께 성장하고 있어요</p>
      </div>

      <div class="hs-container">
        <button id="hs-add" class="hs-add-btn">
          <i data-lucide="plus" style="margin-right:6px"></i>식물 등록하기
        </button>
        <div id="hs-list"></div>
      </div>
    `;
    lucide.createIcons();

    document.getElementById("hs-add").onclick = onAddPlant;
    document.getElementById("hs-noti").onclick = onNotificationsClick;
    document.getElementById("hs-profile").onclick = onProfileClick;

    renderPlants();
  }

  function renderPlants() {
    const list = document.getElementById("hs-list");

    if (plants.length === 0) {
      list.innerHTML = `<div style="text-align:center;color:#6b7280;padding:60px 0">아직 등록된 식물이 없어요<br/><span style="font-size:14px;color:#9CA3AF">첫 번째 반려식물을 등록해보세요!</span></div>`;
      return;
    }

    list.innerHTML = plants
      .map(
        (p) => `
        <div class="hs-card" data-id="${p.id}">
          <img src="${p.imageUrl}" class="hs-img" />
          <button class="hs-delete-btn" data-del="${p.id}">
            <i data-lucide="trash-2" style="width:16px"></i>
          </button>
          <div class="hs-card-body">
            <div class="hs-topline">
              <span class="nickname">${p.nickname}</span>
              <span class="type">${p.name}</span>
            </div>
            <div class="info">
              <span>함께한 지 ${daysSince(p.adoptionDate)}일</span>
              ${p.lastWatered ? `<span>${daysSince(p.lastWatered)}일 전</span>` : ""}
            </div>
          </div>
        </div>
      `
      )
      .join("");

    lucide.createIcons();

    document.querySelectorAll(".hs-card").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        const plant = plants.find((x) => x.id === id);
        onPlantClick(plant);
      });
    });

    document.querySelectorAll("[data-del]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        deletingPlant = plants.find((p) => p.id === el.dataset.del);
        showDeleteDialog();
      });
    });
  }

  function showDeleteDialog() {
    const dialog = document.createElement("div");
    dialog.className = "hs-dialog-backdrop";
    dialog.innerHTML = `
      <div class="hs-dialog">
        <h2 style="font-size:18px;color:#2C3E2F;margin:0 0 8px">식물을 삭제하시겠습니까?</h2>
        <p style="color:#6B7280;font-size:14px;margin:0">
          '${deletingPlant.nickname}'의 모든 성장 기록이 함께 삭제됩니다.
        </p>
        <div class="hs-dialog-buttons">
          <button class="hs-cancel">취소</button>
          <button class="hs-confirm">삭제</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closeDialog();
    });
    dialog.querySelector(".hs-cancel").onclick = closeDialog;

    dialog.querySelector(".hs-confirm").onclick = () => {
      onDeletePlant(deletingPlant.id);
      closeDialog();
    };
  }

  function closeDialog() {
    document.querySelector(".hs-dialog-backdrop")?.remove();
  }
}

function daysSince(date) {
  return Math.floor((new Date() - new Date(date)) / 86400000);
}
