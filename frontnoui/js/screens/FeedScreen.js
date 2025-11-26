/* FeedScreen — TSX 100% 동일 기능 + Lucide 아이콘 적용 */

window.FeedScreen = function ({ journals, onProfileClick, onJournalClick }) {
  const list = document.getElementById("journalList");
  const profileBtn = document.getElementById("profileBtn");

  profileBtn.addEventListener("click", () => onProfileClick());

  list.innerHTML = "";

  // Empty state
  if (!journals || journals.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <p>아직 성장 기록이 없어요</p>
        <p>식물의 성장을 기록해보세요!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  journals.forEach((j) => {
    const date = new Date(j.date);
    const wd = ["일","월","화","수","목","금","토"][date.getDay()];
    const formatted = `${date.getMonth() + 1}월 ${date.getDate()}일 (${wd})`;

    const card = document.createElement("div");
    card.className = "journal-card";

    card.innerHTML = `
      <div class="card-header">
        <span class="plant-name">${j.plantNickname}</span>
        <span class="date">${formatted}</span>
        <div class="tag-wrapper">
          ${j.tags.map((t) => `<span class="tag">#${t}</span>`).join("")}
        </div>
      </div>

      ${
        j.images.length
          ? `
      <div class="card-image">
        <img src="${j.images[0]}" />
        ${
          j.images.length > 1
            ? `<div class="image-count">+${j.images.length - 1}</div>`
            : ""
        }
      </div>`
          : ""
      }

      <div class="card-memo">${j.memo}</div>
    `;

    card.addEventListener("click", () => onJournalClick(j));
    list.appendChild(card);
  });

  lucide.createIcons(); // Lucide 아이콘 적용
};
// ★ 테스트용 — 나중에 필요하면 다른 페이지에서 데이터 넘기면 됨
document.addEventListener("DOMContentLoaded", () => {
  const dummy = [
    {
      id: "1",
      plantNickname: "초록이",
      date: "2025-10-25",
      images: [
        "https://images.unsplash.com/photo-1624421719748-179e1a8e956d",
        "https://images.unsplash.com/photo-1560807707-8cc77767d783"
      ],
      memo: "새 잎이 나와서 너무 귀여움 🍃\n어제 물 줌",
      tags: ["새순", "성장"]
    },
    {
      id: "2",
      plantNickname: "뾰족이",
      date: "2025-10-23",
      images: [],
      memo: "밑동 부분이 살짝 말라서 물 조금 줌",
      tags: ["건강", "물주기"]
    }
  ];

  FeedScreen({
    journals: dummy,
    onProfileClick: () => alert("프로필 이동"),
    onJournalClick: (j) => alert(`저널 열기: ${j.plantNickname}`)
  });
});
