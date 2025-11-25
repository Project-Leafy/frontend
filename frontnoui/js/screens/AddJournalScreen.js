// AddJournalScreen.js
// ★ export 제거완료
// ★ window.initAddJournalScreen 으로 전역 공개
// ★ 완전 동작 버전

const availableTags = ['새순', '물주기', '분갈이', '가지치기', '성장', '개화', '건강'];

let memo = "";
let selectedTags = [];
let images = [];
let hasChanges = false;

let plantData = null;
let onBackCallback = null;
let onSaveCallback = null;

// DOM
const memoInput = document.getElementById("memoInput");
const memoError = document.getElementById("memoError");
const tagContainer = document.getElementById("tagContainer");
const imageGrid = document.getElementById("imageGrid");
const backButton = document.getElementById("backButton");
const backModal = document.getElementById("backModal");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");
const saveButton = document.getElementById("saveButton");
const plantNicknameLabel = document.getElementById("plantNickname");


// ======================================================
//   전역 함수로 init 제공
//   HTML에서 initAddJournalScreen(...) 호출하면 페이지 세팅됨
// ======================================================
window.initAddJournalScreen = function (plant, onBack, onSave) {
  plantData = plant;
  onBackCallback = onBack;
  onSaveCallback = onSave;

  plantNicknameLabel.textContent = plant.nickname;

  renderTags();
  renderImages();
};


// ======================================================
//   렌더링 함수들
// ======================================================

function renderTags() {
  tagContainer.innerHTML = "";

  availableTags.forEach(tag => {
    const el = document.createElement("div");
    el.className = "tag " + (selectedTags.includes(tag) ? "selected" : "unselected");
    el.textContent = "#" + tag;

    el.onclick = () => toggleTag(tag);

    tagContainer.appendChild(el);
  });
}

function renderImages() {
  imageGrid.innerHTML = "";

  images.forEach((img, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "image-item";

    const image = document.createElement("img");
    image.src = img;

    const removeBtn = document.createElement("div");
    removeBtn.className = "remove-image-btn";
    removeBtn.textContent = "✕";
    removeBtn.onclick = () => removeImage(i);

    wrapper.appendChild(image);
    wrapper.appendChild(removeBtn);
    imageGrid.appendChild(wrapper);
  });

  if (images.length < 6) {
    const addBtn = document.createElement("div");
    addBtn.className = "add-image-btn";
    addBtn.innerHTML = `
      <svg width="24" height="24" stroke="#9CA3AF" fill="none" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:4px;">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M5 20h14a2 2 0 0 0 2-2V8l-5-5H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"></path>
      </svg>
      <span style="font-size:12px;color:#9CA3AF;">추가</span>
    `;
    addBtn.onclick = handleAddImage;

    imageGrid.appendChild(addBtn);
  }
}


// ======================================================
//   내부 로직
// ======================================================

memoInput.oninput = (e) => {
  memo = e.target.value;

  if (memo.trim().length > 0) {
    memoError.textContent = "";
  }

  checkChanges();
};

function toggleTag(tag) {
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    selectedTags.push(tag);
  }

  checkChanges();
  renderTags();
}

function handleAddImage() {
  images.push(
    "https://images.unsplash.com/photo-1624421719748-179e1a8e956d?auto=format&fit=crop&w=800"
  );
  checkChanges();
  renderImages();
}

function removeImage(index) {
  images = images.filter((_, i) => i !== index);
  checkChanges();
  renderImages();
}

function checkChanges() {
  hasChanges =
    memo.trim().length > 0 ||
    images.length > 0 ||
    selectedTags.length > 0;
}


// ======================================================
//   뒤로가기 처리
// ======================================================

backButton.onclick = () => {
  if (hasChanges) {
    backModal.classList.remove("hidden");
  } else {
    onBackCallback();
  }
};

modalCancel.onclick = () => {
  backModal.classList.add("hidden");
};

modalConfirm.onclick = () => {
  backModal.classList.add("hidden");
  onBackCallback();
};


// ======================================================
//   저장하기
// ======================================================

saveButton.onclick = () => {
  if (!memo.trim()) {
    memoError.textContent = "메모를 입력해주세요";
    return;
  }

  memoError.textContent = "";

  const journal = {
    id: Date.now().toString(),
    plantId: plantData.id,
    plantNickname: plantData.nickname,
    date: new Date().toISOString().split("T")[0],
    images: [...images],
    memo: memo,
    tags: [...selectedTags],
  };

  onSaveCallback(journal);
};
