function JournalDetailScreen({ journal, onBack, onDelete }) {
  const app = document.getElementById("app");

  render();

  function render() {
    app.innerHTML = `
      <div class="jd-header">
        <div class="jd-header-line">
          <button id="jd-back" class="jd-icon-btn"><i data-lucide="arrow-left"></i></button>
          <h1 style="flex:1;margin:0;font-size:20px;color:#2C3E2F">성장 기록</h1>
          <button id="jd-delete" class="jd-icon-btn jd-red-btn"><i data-lucide="trash-2" style="color:#e03134"></i></button>
        </div>
        <div class="jd-header-info">
          <p class="nickname">${journal.plantNickname}</p>
          <p class="date">${formatDate(journal.date)}</p>
        </div>
      </div>

      <div class="jd-container" id="jd-body"></div>
    `;

    const body = document.getElementById("jd-body");

    if (journal.images?.length) {
      body.innerHTML += journal.images
        .map((img) => `<img src="${img}" class="jd-img" />`)
        .join("");
    }

    if (journal.type === "diagnosis" && journal.diagnosisResult) {
      body.innerHTML += `
        <div class="jd-diagnosis">
          <h3>🔍 진단 결과</h3>
          <p style="color:#6B7280">${journal.diagnosisResult}</p>
        </div>
      `;
    }

    body.innerHTML += `
      <div class="jd-content">
        <div style="display:flex;gap:8px;margin-bottom:12px">
          ${journal.tags.map((tag) => `
            <span style="
              background:#E8F4EC;
              color:#4A7C59;
              border-radius:10px;
              font-size:13px;
              padding:2px 8px;
            ">#${tag}</span>
          `).join("")}
        </div>

        <p class="jd-memo">${journal.memo}</p>
      </div>
    `;

    lucide.createIcons();

    document.getElementById("jd-back").onclick = () => onBack();
    document.getElementById("jd-delete").onclick = () => openDeleteDialog();
  }

  function formatDate(dateString) {
    const d = new Date(dateString);
    const w = ["일","월","화","수","목","금","토"][d.getDay()];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`;
  }

  function openDeleteDialog() {
    const dlg = document.createElement("div");
    dlg.className = "jd-dialog-backdrop";
    dlg.innerHTML = `
      <div class="jd-dialog">
        <h2 style="margin:0 0 10px;font-size:18px;color:#2C3E2F">기록을 삭제하시겠습니까?</h2>
        <p style="color:#6B7280;font-size:14px">
          이 성장 기록이 영구적으로 삭제됩니다.<br/>이 작업은 취소할 수 없습니다.
        </p>
        <div class="jd-dialog-buttons">
          <button class="jd-cancel">취소</button>
          <button class="jd-confirm">삭제</button>
        </div>
      </div>
    `;
    document.body.appendChild(dlg);

    dlg.onclick = (e) => { if (e.target === dlg) closeDialog(); };
    dlg.querySelector(".jd-cancel").onclick = closeDialog;
    dlg.querySelector(".jd-confirm").onclick = () => {
      closeDialog();
      onDelete(journal.id);
      onBack();
    };
  }

  function closeDialog() {
    document.querySelector(".jd-dialog-backdrop")?.remove();
  }
}
