console.log("[HomeScreen loaded]");

window.renderHomeScreen = async function ({
  plants,
  onPlantClick,
  onAddPlant,
  onProfileClick,
  onNotificationsClick,
  onDeletePlant,
}) {
  const app = document.getElementById("app");
  const res = await fetch("./pages/HomeScreen.html");
  app.innerHTML = await res.text();

  if (window.lucide) window.lucide.createIcons();

  document.getElementById("profile-btn").onclick = onProfileClick;
  document.getElementById("notifications-btn").onclick = onNotificationsClick;
  document.getElementById("add-plant-btn").onclick = onAddPlant;

  const plantCount = document.getElementById("plant-count");
  plantCount.textContent = `${plants.length}개의 식물과 함께 성장하고 있어요`;

  const list = document.getElementById("plant-list");
  list.innerHTML = "";

  plants.forEach((p) => {
  const card = document.createElement("div");
  card.className = "hs-card";

  // 날짜 계산
  const today = new Date();
  const adoption = p.adoptionDate ? new Date(p.adoptionDate) : null;
  const lastWater = p.lastWatered ? new Date(p.lastWatered) : null;

  let daysTogetherText = "";
  if (adoption) {
    const diff = Math.floor((today - adoption) / (1000 * 60 * 60 * 24));
    daysTogetherText = `함께한 지 ${diff}일`;
  }

  let lastWaterText = "";
  if (lastWater) {
    const diff = Math.floor((today - lastWater) / (1000 * 60 * 60 * 24));
    lastWaterText = diff === 0 ? "오늘 물주기" : `마지막 물주기: ${diff}일 전`;
  }

  card.innerHTML = `
    <img class="hs-img" src="${p.imageUrl}" />
    <button class="hs-delete-btn"><i data-lucide="trash-2"></i></button>
    <div class="hs-card-body">
      <div class="hs-topline">
        <div class="nickname">${p.nickname}</div>
        <div class="type">${p.name}</div>
      </div>
      <div class="info">
        <span>${daysTogetherText}</span>
        <span>${lastWaterText}</span>
      </div>
    </div>
  `;

  card.onclick = () => onPlantClick(p);

  const delBtn = card.querySelector(".hs-delete-btn");
  delBtn.onclick = (e) => {
    e.stopPropagation();
    onDeletePlant(p.id);
  };

  list.appendChild(card);
});

if (window.lucide) window.lucide.createIcons();
};
