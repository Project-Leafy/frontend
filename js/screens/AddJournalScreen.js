const availableTags = ['새순','물주기','분갈이','가지치기','성장','개화','건강'];

let memo = "";
let selectedTags = [];
let images = [];
let hasChanges = false;

const memoInput = document.getElementById("memoInput");
const memoError = document.getElementById("memoError");
const tagContainer = document.getElementById("tagContainer");
const imageGrid = document.getElementById("imageGrid");
const saveBtn = document.getElementById("saveBtn");
const backBtn = document.getElementById("backButton");

const alertTrigger = document.getElementById("alert-trigger");
const alertConfirm = document.getElementById("alert-confirm");

/* ==============================
   TAGS (variant 기반 최종 완성)
============================== */
function renderTags() {
  tagContainer.innerHTML = "";

  availableTags.forEach(tag => {
    const el = document.createElement("span");
    el.className = "badge";
    el.textContent = "#" + tag;

    // React TSX와 100% 동일한 variant 방식
    if (selectedTags.includes(tag)) {
      el.dataset.variant = "default";  // 초록색
    } else {
      el.dataset.variant = "outline";  // 회색 외곽선
    }

    el.addEventListener("click", () => {
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
      } else {
        selectedTags.push(tag);
      }

      checkChanges();
      renderTags();
    });

    tagContainer.appendChild(el);
  });
}

/* ==============================
   IMAGES
============================== */
function renderImages() {
  imageGrid.innerHTML = "";

  images.forEach((src, idx) => {
    const item = document.createElement("div");
    item.className = "ajs-image-item";

    const img = document.createElement("img");
    img.src = src;

    const remove = document.createElement("button");
    remove.className = "ajs-image-remove";
    remove.innerHTML = `
      <svg width="14" height="14" stroke="white" fill="none" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>`;

    remove.addEventListener("click", () => {
      images = images.filter((_, i) => i !== idx);
      checkChanges();
      renderImages();
    });

    item.appendChild(img);
    item.appendChild(remove);
    imageGrid.appendChild(item);
  });

  if (images.length < 6) {
    const addBtn = document.createElement("div");
    addBtn.className = "ajs-add-image";
    addBtn.innerHTML = `
      <svg width="24" height="24" stroke="#9CA3AF" fill="none" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span>추가</span>`;

    addBtn.addEventListener("click", () => {
      images.push("https://images.unsplash.com/photo-1624421719748-179e1a8e956d?auto=format&w=1080");
      checkChanges();
      renderImages();
    });

    imageGrid.appendChild(addBtn);
  }
}

/* ==============================
   MEMO
============================== */
memoInput.addEventListener("input", e => {
  memo = e.target.value;
  if (memo.trim()) memoError.classList.add("hidden");
  checkChanges();
});

/* ==============================
   CHANGE CHECK
============================== */
function checkChanges() {
  hasChanges = memo.trim() || selectedTags.length || images.length;
}

/* ==============================
   BACK
============================== */
backBtn.addEventListener("click", () => {
  if (hasChanges) {
    alertTrigger.click(); // alert-dialog.js가 open
  } else {
    window.location.href = "PlantDetailScreen.html";
  }
});

/* ==============================
   SAVE
============================== */
saveBtn.addEventListener("click", () => {
  if (!memo.trim()) {
    memoError.classList.remove("hidden");
    return;
  }

  const data = {
    memo,
    images: [...images],
    tags: [...selectedTags],
    date: new Date().toISOString().split("T")[0]
  };

  console.log("저장됨:", data);
  alert("저장 완료!");

  window.location.href = "PlantDetailScreen.html";
});

/* ==============================
   ALERT CONFIRM → 나가기
============================== */
alertConfirm.addEventListener("click", () => {
  window.location.href = "PlantDetailScreen.html";
});

/* INIT */
renderTags();
renderImages();
