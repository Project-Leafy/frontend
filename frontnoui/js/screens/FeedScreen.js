// js/screens/FeedScreen.js
console.log("[FeedScreen loaded]");

window.renderFeedScreen = async function ({
  journals,
  onJournalClick,
  onProfileClick,
}) {
  const app = document.getElementById("app");

  // HTML 불러오기
  const html = await fetch("./pages/FeedScreen.html").then(r => r.text());
  app.innerHTML = html;

  lucide.createIcons(); // 아이콘 렌더링

  /* 🔹 프로필 이동 버튼 */
  document.getElementById("profileBtn").onclick = onProfileClick;

  /* 🔹 일지 리스트 렌더링 */
  const list = document.getElementById("journalList");
  list.innerHTML = "";

  journals.forEach(j => {
    const item = document.createElement("div");
    item.className = "journal-card";
    item.innerHTML = `
      <img class="journal-img" src="${j.images[0] ?? ""}">
      <div class="journal-info">
        <div class="journal-nickname">${j.plantNickname}</div>
        <div class="journal-date">${j.date}</div>
        <div class="journal-memo">${j.memo}</div>
        <div class="journal-tags">${j.tags.map(t => `#${t}`).join(" ")}</div>
      </div>
    `;

    list.appendChild(item);

    /* 일지 클릭 → 상세 화면 이동 */
    item.onclick = () => onJournalClick(j);
  });

  lucide.createIcons(); // 렌더 후 태그 내부의 아이콘 갱신
};
