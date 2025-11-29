// AddJournalScreen.js

const availableTags = ['새순', '물주기', '분갈이', '가지치기', '성장', '개화', '건강'];

// Global state for the screen, reset on each render
let memo = "";
let selectedTags = [];
let images = [];
let hasChanges = false;

let plantData = null;
let onBackCallback = null;
let onSaveCallback = null;

// DOM elements will be fetched inside renderAddJournalScreen
// const memoInput;
// const memoError;
// ... (all other DOM elements)


// ======================================================
//   렌더링 함수들 (moved inside renderAddJournalScreen or made local helpers)
// ======================================================

function renderTags() {
  const tagContainer = document.getElementById("tagContainer");
  if (!tagContainer) return;

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
  const imageGrid = document.getElementById("imageGrid");
  if (!imageGrid) return;

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
//   내부 로직 (moved inside renderAddJournalScreen or made local helpers)
// ======================================================

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
//   메인 렌더 함수
// ======================================================
async function renderAddJournalScreen({ plant, onBack, onSave }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/AddJournalScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Reset screen state
    memo = "";
    selectedTags = [];
    images = [];
    hasChanges = false;
    plantData = plant;
    onBackCallback = onBack;
    onSaveCallback = onSave;


    // Get DOM elements after HTML is loaded
    const memoInput = document.getElementById("memoInput");
    const memoError = document.getElementById("memoError");
    const backButton = document.getElementById("backButton");
    const backModal = document.getElementById("backModal");
    const modalCancel = document.getElementById("modalCancel");
    const modalConfirm = document.getElementById("modalConfirm");
    const saveButton = document.getElementById("saveButton");
    const plantNicknameLabel = document.getElementById("plantNickname");


    if (plantNicknameLabel) {
      plantNicknameLabel.textContent = plantData.nickname;
    }

    if (memoInput) {
      memoInput.oninput = (e) => {
        memo = e.target.value;
        if (memo.trim().length > 0 && memoError) {
          memoError.textContent = "";
        }
        checkChanges();
      };
    } else {
        console.error("memoInput not found");
    }

    // ======================================================
    //   뒤로가기 처리
    // ======================================================
    if (backButton) {
      backButton.onclick = () => {
        console.log("[AddJournalScreen] Back button clicked."); // Debugging
        if (hasChanges) {
          if (backModal) backModal.classList.remove("hidden");
        } else {
          onBackCallback();
        }
      };
    } else {
        console.error("backButton not found");
    }


    if (modalCancel) {
      modalCancel.onclick = () => {
        console.log("[AddJournalScreen] Modal Cancel clicked."); // Debugging
        if (backModal) backModal.classList.add("hidden");
      };
    } else {
        console.error("modalCancel not found");
    }


    if (modalConfirm) {
      modalConfirm.onclick = () => {
        console.log("[AddJournalScreen] Modal Confirm clicked."); // Debugging
        if (backModal) backModal.classList.add("hidden");
        onBackCallback();
      };
    } else {
        console.error("modalConfirm not found");
    }


    // ======================================================
    //   저장하기
    // ======================================================
    if (saveButton) {
      saveButton.onclick = () => {
        console.log("[AddJournalScreen] Save button clicked."); // Debugging
        if (!memo.trim()) {
          if (memoError) memoError.textContent = "메모를 입력해주세요";
          return;
        }

        if (memoError) memoError.textContent = "";

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
    } else {
        console.error("saveButton not found");
    }


    // Initial render for tags and images
    renderTags();
    renderImages();
    checkChanges(); // Initialize hasChanges

  } catch (error) {
    console.error("Failed to load AddJournalScreen.html:", error);
  }
}
