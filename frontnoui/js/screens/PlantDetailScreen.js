console.log("[PlantDetailScreen loaded]");

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ---------------------------
  // 🌿 예시 데이터 자동 주입
  // ---------------------------
  const samplePlant = {
    id: "p1",
    nickname: "초록이",
    name: "몬스테라",
    imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1080&q=80",
    adoptionDate: "2024-03-12"
  };

  const sampleJournals = [
    {
      id: "j1",
      plantNickname: "초록이",
      date: "2024-11-21",
      memo: "잎이 새로 하나 더 나왔다! 줄기가 생각보다 빨리 길어지는 중.",
      images: [
        "https://images.unsplash.com/photo-1624421719748-179e1a8e956d?w=1080&q=80",
        "https://images.unsplash.com/photo-1587502536263-3f8dc3b1d2b6?w=1080&q=80"
      ],
      tags: ["새순", "성장"]
    },
    {
      id: "j2",
      plantNickname: "초록이",
      date: "2024-11-03",
      memo: "이번엔 물을 조금 늦게 줬더니 잎이 살짝 힘이 없었음. 다음부터는 주기 유지하기!",
      images: [],
      tags: ["물주기"]
    }
  ];

  // localStorage에 없으면 자동 등록
  if (!localStorage.getItem("currentPlant")) {
    localStorage.setItem("currentPlant", JSON.stringify(samplePlant));
  }
  if (!localStorage.getItem("currentJournals")) {
    localStorage.setItem("currentJournals", JSON.stringify(sampleJournals));
  }

  const plant = JSON.parse(localStorage.getItem("currentPlant"));
  const journals = JSON.parse(localStorage.getItem("currentJournals") || "[]");

  // ---------------------------
  // 🌿 화면 렌더링
  // ---------------------------

  document.getElementById("plant-img").src = plant.imageUrl;
  document.getElementById("plant-nickname").textContent = plant.nickname;
  document.getElementById("plant-name").textContent = plant.name;

  document.getElementById("adoption-date").textContent = formatDate(plant.adoptionDate);
  document.getElementById("days-since").textContent =
    Math.floor((Date.now() - new Date(plant.adoptionDate)) / 86400000) + "일";

  document.getElementById("back-btn").addEventListener("click", () => history.back());
  document.getElementById("info-btn").addEventListener("click", () => {
    alert("식물 정보 페이지 예정 기능");
  });

  document.getElementById("add-journal-btn").addEventListener("click", () => {
    alert("일지 추가 페이지 예정 기능");
  });

  // 📌 일지 렌더링
  const list = document.getElementById("journal-list");
  list.innerHTML = "";

  journals.forEach(j => {
    const card = document.createElement("button");
    card.className = "journal-card";
    card.innerHTML = `
      <div class="journal-content">
        ${j.images.length ? `<div class="journal-thumb"><img src="${j.images[0]}"></div>` : ""}
        <div class="journal-meta">
          <div style="display:flex;justify-content:space-between;">
            <span class="journal-date">${formatDate(j.date)}</span>
            ${j.images.length > 1 ? `<span class="journal-img-count">+${j.images.length - 1}</span>` : ""}
          </div>
          <p class="journal-text">${j.memo}</p>
          <div class="journal-tags">
            ${j.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      alert("일지 상세 페이지 예정 기능");
    });

    list.appendChild(card);
  });

  lucide.createIcons();
});

function formatDate(date) {
  const d = new Date(date);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
