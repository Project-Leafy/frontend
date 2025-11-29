// JournalDetailScreen.js

async function renderJournalDetailScreen({ journal, onBack, onDelete }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  // Helper function for date formatting
  function formatDate(dateString) {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) { // Check for invalid date
        return "날짜 오류";
    }
    const w = ["일","월","화","수","목","금","토"][d.getDay()];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`;
  }

  // Helper to open delete dialog
  function openDeleteDialog(currentJournalId) {
    let dlg = document.getElementById("journal-delete-dialog");
    if (!dlg) { // Create dialog if it doesn't exist
        dlg = document.createElement("div");
        dlg.id = "journal-delete-dialog";
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
        const cancelButton = dlg.querySelector(".jd-cancel");
        if (cancelButton) {
          cancelButton.onclick = closeDialog;
        }
        const confirmButton = dlg.querySelector(".jd-confirm");
        if (confirmButton) {
          confirmButton.onclick = () => {
            console.log("[JournalDetailScreen] Delete confirmed for journal ID:", currentJournalId); // Debugging
            closeDialog();
            onDelete(currentJournalId);
            onBack(); // Go back after delete
          };
        }
    }
    // These assignments must happen every time openDeleteDialog is called,
    // to ensure they reference the currentJournalId correctly.
    const currentCancelButton = dlg.querySelector(".jd-cancel");
    if (currentCancelButton) {
        currentCancelButton.onclick = closeDialog;
    }
    const currentConfirmButton = dlg.querySelector(".jd-confirm");
    if (currentConfirmButton) {
        currentConfirmButton.onclick = () => {
            console.log("[JournalDetailScreen] Delete confirmed for journal ID:", currentJournalId); // Debugging
            closeDialog();
            onDelete(currentJournalId);
            onBack(); // Go back after delete
        };
    }
    
    dlg.classList.remove("hidden"); // Ensure it's visible
  }

  // Helper to close delete dialog
  function closeDialog() {
    const dlg = document.getElementById("journal-delete-dialog");
    if (dlg) dlg.classList.add("hidden");
  }


  // Constructing HTML for the screen directly
  let imagesHtml = '';
  if (journal.images?.length) {
    imagesHtml = journal.images
      .map((img) => `<img src="${img}" class="jd-img" onerror="this.onerror=null;this.src='../assets/placeholder.png';" />`)
      .join("");
  }

  let diagnosisHtml = '';
  if (journal.type === "diagnosis" && journal.diagnosisResult) {
    diagnosisHtml = `
      <div class="jd-diagnosis">
        <h3>🔍 진단 결과</h3>
        <p style="color:#6B7280">${journal.diagnosisResult}</p>
      </div>
    `;
  }

  const tagsHtml = journal.tags.map((tag) => `
    <span style="
      background:#E8F4EC;
      color:#4A7C59;
      border-radius:10px;
      font-size:13px;
      padding:2px 8px;
    ">#${tag}</span>
  `).join("");

  appDiv.innerHTML = `
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

    <div class="jd-container" id="jd-body">
      ${imagesHtml}
      ${diagnosisHtml}
      <div class="jd-content">
        <div style="display:flex;gap:8px;margin-bottom:12px">
          ${tagsHtml}
        </div>
        <p class="jd-memo">${journal.memo}</p>
      </div>
    </div>
  `;

  // After injecting HTML, initialize lucide icons
  lucide.createIcons();

  // Attach event listeners
  const backBtn = document.getElementById("jd-back");
  const deleteBtn = document.getElementById("jd-delete");

  if (backBtn) {
    backBtn.onclick = () => onBack();
  } else {
    console.error("jd-back button not found.");
  }

  if (deleteBtn) {
    deleteBtn.onclick = () => openDeleteDialog(journal.id);
  } else {
    console.error("jd-delete button not found.");
  }
}