/* STEP 상태 */
let step = 1;

/* 데이터 상태 */
let plantImage = "";
let analysisResult = {
  name: "몬스테라 델리시오사",
  scientific: "Monstera Deliciosa",
  confidence: 98,
};
let nickname = "";document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  const randomImages = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1483794344563-d27a8d18014e",
  ];

  let plantImage = "";
  let analysis = {
    name: "몬스테라 델리시오사",
    scientific: "Monstera Deliciosa",
    confidence: 98
  };

  // step change helper
  const go = (s) => {
    [step1, step2, step3].forEach(el => el.classList.remove("active"));
    s.classList.add("active");
    lucide.createIcons();
  };

  // step1
  document.getElementById("takePhoto").onclick = () => {
    plantImage = randomImages[Math.floor(Math.random() * randomImages.length)];
    document.getElementById("previewImage").src = plantImage;
    go(step2);
  };
  document.getElementById("selectFromAlbum").onclick = document.getElementById("takePhoto").onclick;
  document.getElementById("back1").onclick = () => history.back();

  // step2
  document.getElementById("analysisName").textContent = analysis.name;
  document.getElementById("analysisScientific").textContent = analysis.scientific;
  document.getElementById("confidenceLevel").style.width = `${analysis.confidence}%`;
  document.getElementById("confidencePercent").textContent = `${analysis.confidence}%`;

  document.getElementById("nextToStep3").onclick = () => {
    document.getElementById("finalImage").src = plantImage;
    document.getElementById("species").value = analysis.name;
    document.getElementById("adoptionDate").value = new Date().toISOString().split("T")[0];
    go(step3);
  };
  document.getElementById("retake").onclick = () => go(step1);
  document.getElementById("back2").onclick = () => go(step1);

  // step3
  document.getElementById("back3").onclick = () => go(step2);
  document.getElementById("completeBtn").onclick = () => {
    const newPlant = {
      id: Date.now().toString(),
      name: analysis.name,
      species: analysis.scientific,
      nickname: document.getElementById("nickname").value || analysis.name,
      adoptionDate: document.getElementById("adoptionDate").value,
      imageUrl: plantImage,
    };

    console.log("🌱 식물 등록 완료:", newPlant);
    location.href = "HomeScreen.html"; // 이동 원하면 수정해도 됨
  };
});

let adoptionDate = new Date().toISOString().split("T")[0];

/* 루트 요소 */
const app = document.getElementById("app");

/* step 렌더 */
function render() {
  if (step === 1) return renderStep1();
  if (step === 2) return renderStep2();
  if (step === 3) return renderStep3();
}

/* STEP 1 */
function renderStep1() {
  app.innerHTML = `
    <div class="screen">
      <div class="header">
        <button class="icon-btn" id="backBtn"><i data-lucide="arrow-left"></i></button>
        <div><h1>식물 등록</h1><p>1/3 단계</p></div>
      </div>

      <div class="content step1">
        <div class="photo-icon"><i data-lucide="camera"></i></div>
        <h2>식물 사진을 촬영해주세요</h2>
        <p>식물 전체가 잘 보이도록 밝은 곳에서 촬영해주세요</p>

        <input type="file" accept="image/*" id="photoInput" class="hidden" />

        <button class="primary-btn" id="takePhotoBtn">
          <i data-lucide="camera"></i> 카메라로 촬영하기
        </button>
        <button class="secondary-btn" id="pickPhotoBtn">앨범에서 선택하기</button>
      </div>
    </div>
  `;

  addStep1Events();
}

/* STEP 1 이벤트 */
function addStep1Events() {
  document.getElementById("backBtn").addEventListener("click", () => history.back());
  const input = document.getElementById("photoInput");

  document.getElementById("takePhotoBtn").addEventListener("click", () => input.click());
  document.getElementById("pickPhotoBtn").addEventListener("click", () => input.click());

  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    plantImage = URL.createObjectURL(file);
    step = 2;
    render();
  });

  lucide.createIcons();
}

/* STEP 2 */
function renderStep2() {
  app.innerHTML = `
    <div class="screen">
      <div class="header">
        <button class="icon-btn" id="backBtn"><i data-lucide="arrow-left"></i></button>
        <div><h1>식물 등록</h1><p>2/3 단계</p></div>
      </div>

      <div class="content step2">
        <img src="${plantImage}" class="preview-img" />

        <div class="analysis-box">
          <div class="icon-wrap"><i data-lucide="check"></i></div>
          <h3>분석 완료!</h3>
          <p>Plant.id 분석 결과</p>

          <div class="result">
            <p class="plant-name">${analysisResult.name}</p>
            <p class="scientific">${analysisResult.scientific}</p>
            <div class="confidence-bar"><div style="width:${analysisResult.confidence}%"></div></div>
            <span class="confidence-num">${analysisResult.confidence}%</span>
          </div>
        </div>

        <button class="primary-btn" id="nextBtn">맞아요, 다음으로</button>
        <button class="secondary-btn" id="retryBtn">다시 촬영하기</button>
      </div>
    </div>
  `;

  addStep2Events();
}

function addStep2Events() {
  document.getElementById("backBtn").addEventListener("click", () => { step = 1; render(); });
  document.getElementById("retryBtn").addEventListener("click", () => { step = 1; render(); });
  document.getElementById("nextBtn").addEventListener("click", () => { step = 3; render(); });
  lucide.createIcons();
}

/* STEP 3 */
function renderStep3() {
  app.innerHTML = `
    <div class="screen">
      <div class="header">
        <button class="icon-btn" id="backBtn"><i data-lucide="arrow-left"></i></button>
        <div><h1>식물 등록</h1><p>3/3 단계</p></div>
      </div>

      <div class="content step3">
        <img src="${plantImage}" class="preview-img wide" />

        <label>식물 종류</label>
        <input value="${analysisResult.name}" disabled />

        <label>애칭 (선택)</label>
        <input id="nicknameInput" placeholder="예: 초록이, 행복이" value="${nickname}" />

        <label>입양일</label>
        <input type="date" id="dateInput" value="${adoptionDate}" />

      </div>

      <div class="footer">
        <button class="primary-btn" id="completeBtn">등록 완료</button>
      </div>
    </div>
  `;

  addStep3Events();
}

function addStep3Events() {
  document.getElementById("backBtn").addEventListener("click", () => { step = 2; render(); });

  document.getElementById("nicknameInput").addEventListener("input", e => nickname = e.target.value);
  document.getElementById("dateInput").addEventListener("input", e => adoptionDate = e.target.value);

  document.getElementById("completeBtn").addEventListener("click", handleComplete);
  lucide.createIcons();
}

/* 등록 완료 */
function handleComplete() {
  const newPlant = {
    id: Date.now().toString(),
    name: analysisResult.name,
    species: analysisResult.scientific,
    nickname: nickname || analysisResult.name,
    adoptionDate,
    imageUrl: plantImage,
  };

  let plants = JSON.parse(localStorage.getItem("plants") || "[]");
  plants.push(newPlant);
  localStorage.setItem("plants", JSON.stringify(plants));

  location.href = "./HomeScreen.html";
}

/* 초기 실행 */
render();
