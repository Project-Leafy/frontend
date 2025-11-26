document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const backBtn = document.getElementById("backBtn");
  const profileImage = document.getElementById("profileImage");
  const profileName = document.getElementById("profileName");
  const daysTogether = document.getElementById("daysTogether");
  const plantCount = document.getElementById("plantCount");
  const journalCount = document.getElementById("journalCount");
  const daysCount = document.getElementById("daysCount");
  const plantList = document.getElementById("plantList");
  const logoutBtn = document.getElementById("logoutBtn");

  /* ---------- MOCK (필요시 데이터 연동 가능) ---------- */
  const user = {
    name: "김민준",
    startDate: "2024-07-01",
    profileImage:
      "https://images.unsplash.com/photo-1643836763638-6bab3c1d6a7c?auto=format&q=80&w=800",
  };

  const plants = JSON.parse(localStorage.getItem("plants") || "[]");
  const totalJournals = Number(localStorage.getItem("journalCount") || 24);

  /* ---------- 헤더 표시 ---------- */
  profileImage.src = user.profileImage.startsWith("blob:")
  ? "../assets/default-profile.png"
  : user.profileImage;

  profileName.textContent = user.name;

  const diffDays = Math.floor(
    (new Date() - new Date(user.startDate)) / (1000 * 60 * 60 * 24)
  );
  daysTogether.textContent = `함께한 지 ${diffDays}일`;

  /* ---------- 통계 ---------- */
  plantCount.textContent = plants.length;
  journalCount.textContent = totalJournals;
  daysCount.textContent = diffDays;

  /* ---------- 식물 목록 표시 ---------- */
  plantList.innerHTML = "";
  plants.forEach((p) => {
    const item = document.createElement("div");
    item.className = "plant-item";
    item.innerHTML = `
      <div class="plant-thumb"><img src="${p.imageUrl.startsWith('blob:') ? '../assets/default-plant.jpg' : p.imageUrl}" />
</div>
      <div class="flex-1">
        <p class="main">${p.nickname}</p>
        <p class="sub">${p.name}</p>
      </div>
      <div class="sub">
        ${Math.floor(
          (new Date() - new Date(p.adoptionDate)) / (1000 * 60 * 60 * 24)
        )}일
      </div>
    `;
    plantList.appendChild(item);
  });

  /* ---------- 이벤트 ---------- */
  backBtn.onclick = () => history.back();
  logoutBtn.onclick = () => {
    alert("로그아웃 되었습니다.");
    location.href = "LoginScreen.html";
  };
});
