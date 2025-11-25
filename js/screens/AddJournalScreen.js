// frontend/js/screen/AddJournalScreen.js

const availableTags = ['새순','물주기','분갈이','가지치기','성장','개화','건강'];

let memo = "";
let selectedTags = [];
let images = [];

let memoError = false;
let hasChanges = false;

const nicknameEl = document.getElementById("ajs-nickname");
const memoEl = document.getElementById("ajs-memo");
const memoErrorEl = document.getElementById("ajs-memo-error");
const tagListEl = document.getElementById("ajs-tag-list");
const imageGridEl = document.getElementById("ajs-image-grid");

const backBtn = document.getElementById("ajs-back-btn");
const saveBtn = document.getElementById("ajs-save");

const dialogRoot = document.getElementById("ajs-dialog");
const dialogCancel = document.getElementById("ajs-dialog-cancel");
const dialogConfirm = document.getElementById("ajs-dialog-confirm");

/********************************************************
 * 초기 데이터 바인딩 함수
 ********************************************************/
function renderPage(plant) {
  nicknameEl.textContent = plant.nickname;

  renderTags();
  renderImages();
}

/********************************************************
 * 태그 렌더링
 ********************************************************/
function renderTags() {
  tagListEl.innerHTML = "";

  availableTags.forEach((tag) => {
    const el = document.createElement("div");
    el.className = "badge cursor-pointer";
    el.textContent = `#${tag}`;
    el.onclick = () => toggleTag(tag);

    // 스타일 동적 적용
    if (selectedTags.includes(tag)) {
      el.style.background = "#4A7C59";
      el.style.color = "#fff";
    } else {
      el.style.border = "1px solid #E5E5E0";
      el.style.color = "#6B7280";
    }

    tagListEl.appendChild(el);
  });
}

/********************************************************
 * 이미지 렌더링
 ********************************************************/
function renderImages() {
  imageGridEl.innerHTML = "";

  images.forEach((src, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "ajs-img-wrap";

    const img = document.createElement("img");
    img.src = src;

    const removeBtn = document.createElement("button");
    removeBtn.className = "ajs-img-remove";
    removeBtn.innerHTML = `
      <svg width="14" height="14" stroke="white" fill="none" stroke-width="2"
        stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    `;
    removeBtn.onclick = () => removeImage(idx);

    wrap.appendChild(img);
    wrap.appendChild(removeBtn);
    imageGridEl.appendChild(wrap);
  });

  if (images.length < 6) {
    const addBtn = document.createElement("button");
    addBtn.className = "ajs-add-img";
    addBtn.innerHTML = `
      <svg width="24" height="24" stroke="#9CA3AF" fill="none" stroke-width="2" stroke-linecap="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <div style="margin-top:4px;font-size:12px;color:#9CA3AF;">추가</div>
    `;
    addBtn.onclick = addImage;
    imageGridEl.appendChild(addBtn);
  }
}

/********************************************************
 * 태그 토글
 ********************************************************/
function toggleTag(tag) {
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    selectedTags.push(tag);
  }
  updateHasChanges();
  renderTags();
}

/********************************************************
 * 이미지 추가 & 제거
 ********************************************************/
function addImage() {
  images.push("https://images.unsplash.com/photo-1624421719748-179e1a8e956d?auto=format&w=1080");
  updateHasChanges();
  renderImages();
}

function removeImage(index) {
  images = images.filter((_, i) => i !== index);
  updateHasChanges();
  renderImages();
}

/********************************************************
 * 메모 입력
 ********************************************************/
memoEl.addEventListener("input", (e) => {
  memo = e.target.value;

  if (memoError && memo.trim()) {
    memoError = false;
    memoErrorEl.classList.add("hidden");
  }

  updateHasChanges();
});

/********************************************************
 * 변경 감지
 ********************************************************/
function updateHasChanges() {
  hasChanges =
    memo.trim().length > 0 ||
    images.length > 0 ||
    selectedTags.length > 0;
}

/********************************************************
 * AlertDialog / 뒤로가기
 ********************************************************/
backBtn.onclick = () => {
  if (hasChanges) {
    dialogRoot.classList.remove("hidden");
  } else {
    history.back();
  }
};

dialogCancel.onclick = () => {
  dialogRoot.classList.add("hidden");
};

dialogConfirm.onclick = () => {
  history.back();
};

/********************************************************
 * 저장
 ********************************************************/
saveBtn.onclick = () => {
  if (!memo.trim()) {
    memoError = true;
    memoErrorEl.classList.remove("hidden");
    return;
  }

  const journal = {
    id: Date.now().toString(),
    plantId: window.PLANT_DATA.id,
    plantNickname: window.PLANT_DATA.nickname,
    date: new Date().toISOString().split("T")[0],
    images,
    memo,
    tags: selectedTags
  };

  console.log("저장됨:", journal);
  alert("저장 완료!");
};

/********************************************************
 * 실제 실행
 ********************************************************/
window.addEventListener("DOMContentLoaded", () => {
  renderPage(window.PLANT_DATA);
});
