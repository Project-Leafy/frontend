console.log("[ProfileScreen loaded]");

window.renderProfileScreen = async function ({
  onBack,
  onLogout,
  plants,
  journals
}) {
  const app = document.getElementById("app");
  if (!app) return;

  /* 1) HTML 로드 */
  try {
    const html = await fetch("./pages/ProfileScreen.html").then(r => r.text());
    app.innerHTML = html;
  } catch (e) {
    console.error("[ProfileScreen] HTML 로드 실패:", e);
    return;
  }

  /* 2) 아이콘 렌더링 */
  if (window.lucide) lucide.createIcons();

  /* 3) DOM 요소 */
  const backBtn = document.getElementById("backBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileImage = document.getElementById("profileImage");
  const profileName = document.getElementById("profileName");
  const daysTogether = document.getElementById("daysTogether");
  const plantCount = document.getElementById("plantCount");
  const journalCount = document.getElementById("journalCount");
  const daysCount = document.getElementById("daysCount");
  const plantList = document.getElementById("plantList");

  /* 4) 사용자 MOCK DATA */
  const user = {
    name: "김민준",
    startDate: "2024-07-01",
    profileImage:
      "https://images.unsplash.com/photo-1643836763638-6bab3c1d6a7c?auto=format&q=80&w=800"
  };

  /* 5) 사용자 정보 표시 */
  profileImage.src = user.profileImage;
  profileName.textContent = user.name;

  const diffDays = Math.floor(
    (new Date() - new Date(user.startDate)) / (1000 * 60 * 60 * 24)
  );
  daysTogether.textContent = `함께한 지 ${diffDays}일`;

  /* 6) 통계 */
  plantCount.textContent = plants.length;
  journalCount.textContent = journals.length;
  daysCount.textContent = diffDays;

  /* 7) 식물 목록 */
  plantList.innerHTML = "";
  plants.forEach((p) => {
    const item = document.createElement("div");
    item.className = "plant-item";
    item.innerHTML = `
      <div class="plant-thumb">
        <img src="${p.imageUrl}">
      </div>
      <div class="flex-1">
        <p class="main">${p.nickname}</p>
        <p class="sub">${p.name}</p>
      </div>
      <div class="sub">
        ${Math.floor((new Date() - new Date(p.adoptionDate)) / (1000 * 60 * 60 * 24))}일
      </div>
    `;
    plantList.appendChild(item);
  });

  /* 8) 이벤트 */
  if (backBtn) backBtn.onclick = () => onBack && onBack();
  if (logoutBtn) logoutBtn.onclick = () => onLogout && onLogout();
};
