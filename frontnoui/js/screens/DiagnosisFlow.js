/* =========================================
   DiagnosisFlow.js — HTML/Vanilla JS 완전판
   ========================================= */

// 루시드 아이콘 표시 준비
lucide.createIcons();

/* DiagnosisFlow 초기화 */
function initDiagnosisFlow(plants, onBack, onSaveDiagnosis) {
  const app = document.getElementById("diagnosisApp");
  if (!app) return;

  // 내부 상태
  let step = 1;
  let diagnosisImage = "";
  let selectedPlantId = "";

  const diagnosisResult = "과습으로 인한 잎 반점병";

  // ------------------------------
  // STEP RENDER
  // ------------------------------
  function render() {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3();
  }

  // ------------------------------
  // STEP 1 (사진 촬영)
  // ------------------------------
  function renderStep1() {
    app.innerHTML = `
      <div class="top-bar">
        <button class="back-btn" id="backBtn1"><i data-lucide="arrow-left"></i></button>
        <div class="title">식물 건강 진단</div>
      </div>

      <div class="content">
        <div class="camera-circle">
          <i data-lucide="camera"></i>
        </div>

        <div class="main-title">아픈 식물의 잎을<br>촬영해보세요</div>
        <div class="sub-text">
          갈색 반점, 누렇게 변한 잎,<br>
          시든 부분 등을 촬영해주세요
        </div>

        <button class="full-btn primary-btn" id="takePhotoBtn">
          <i data-lucide="camera" class="mr"></i> 카메라로 촬영하기
        </button>

        <button class="full-btn white-btn" id="openGalleryBtn">
          앨범에서 선택하기
        </button>

        <div class="tip-box">
          💡 팁: 증상이 잘 보이도록<br>
          밝은 곳에서 촬영하면 더 정확한 진단이 가능해요
        </div>
      </div>
    `;

    lucide.createIcons();

    document.getElementById("backBtn1").onclick = () => onBack();
    document.getElementById("takePhotoBtn").onclick = mockTakePhoto;
    document.getElementById("openGalleryBtn").onclick = mockTakePhoto;
  }

  // ------------------------------
  // STEP 2 (사진 확인)
  // ------------------------------
  function renderStep2() {
    app.innerHTML = `
      <div class="top-bar">
        <button class="back-btn" id="retakeBtn">
          <i data-lucide="arrow-left"></i>
        </button>
        <div class="title">사진 확인</div>
      </div>

      <div class="content" style="padding-bottom:120px;">
        <img src="${diagnosisImage}" class="preview-img">

        <div class="green-box">
          사진이 선명하게 촬영되었나요?<br>
          식물의 증상이 잘 보이는지 확인해주세요
        </div>
      </div>

      <div class="bottom-fixed">
        <button class="full-btn primary-btn" id="diagnoseBtn">진단하기</button>
        <button class="full-btn white-btn" id="retakePhotoBtn">
          <i data-lucide="rotate-ccw" class="mr"></i> 다시 촬영하기
        </button>
      </div>
    `;

    lucide.createIcons();

    document.getElementById("retakeBtn").onclick = () => goStep1();
    document.getElementById("retakePhotoBtn").onclick = () => goStep1();
    document.getElementById("diagnoseBtn").onclick = () => {
      step = 3;
      render();
    };
  }

  // ------------------------------
  // STEP 3 (진단 결과)
  // ------------------------------
  function renderStep3() {
    app.innerHTML = `
      <div class="top-bar">
        <button class="back-btn" id="backBtn3">
          <i data-lucide="arrow-left"></i>
        </button>
        <div class="title">진단 결과</div>
      </div>

      <div class="content">

        <img src="${diagnosisImage}" class="preview-img">

        <!-- 진단 결과 카드 -->
        <div class="result-card">
          <div class="result-top">
            <div class="icon-wrap">
              <i data-lucide="alert-circle"></i>
            </div>
            <div>
              <div class="result-title">진단 결과</div>
              <div class="result-desc">${diagnosisResult}</div>
            </div>
          </div>

          <div class="possibility-box">
            <div class="label">가능성</div>
            <div class="bar"><div class="bar-fill"></div></div>
            <div class="percent">85%</div>
          </div>
        </div>

        <!-- 증상 설명 -->
        <div class="white-card">
          <h3>증상 설명</h3>
          <p>
            잎에 갈색 반점이 생기고 가장자리가 누렇게 변하는 증상은
            물을 너무 자주 주어서 발생하는 과습 현상입니다.
            뿌리가 충분히 숨을 쉬지 못해 생기는 문제예요.
          </p>
        </div>

        <!-- 해결 방법 -->
        <div class="solution-card">
          <h3 style="margin-bottom:14px;">해결 방법</h3>

          <div class="step-item">
            <div class="circle">1</div>
            <div>
              <div class="st">물주기 조절</div>
              <div class="sd">
                흙이 완전히 마를 때까지 기다린 후 물을 주세요.
                손가락을 흙에 3~4cm 넣어 확인하세요.
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="circle">2</div>
            <div>
              <div class="st">배수 확인</div>
              <div class="sd">
                화분 아래 배수구가 막히지 않았는지 확인하고,
                받침대 고인 물은 바로 버려주세요.
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="circle">3</div>
            <div>
              <div class="st">손상된 잎 제거</div>
              <div class="sd">
                손상된 잎은 깨끗한 가위로 잘라내어
                식물이 새로운 잎에 에너지를 쓸 수 있도록 해주세요.
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="circle">4</div>
            <div style="width:100%;">
              <div class="st">추천 제품</div>

              <button class="product-btn" data-product="식물 영양제 A">
                <div>
                  <div class="pn">식물 영양제 A</div>
                  <div class="pd">뿌리 회복에 도움</div>
                </div>
                <i data-lucide="external-link"></i>
              </button>

              <button class="product-btn" data-product="친환경 살균제">
                <div>
                  <div class="pn">친환경 살균제</div>
                  <div class="pd">곰팡이 예방</div>
                </div>
                <i data-lucide="external-link"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 세부 정보 3개 -->
        <div class="stats-row">
          <div class="stat-item">
            <i data-lucide="droplets"></i>
            <span>물주기<br>2주에 1번</span>
          </div>
          <div class="stat-item">
            <i data-lucide="sun"></i>
            <span>밝은<br>간접광</span>
          </div>
          <div class="stat-item">
            <i data-lucide="wind"></i>
            <span>통풍<br>필수</span>
          </div>
        </div>

        <div class="btn-row">
          <button class="full-btn white-btn" id="shareBtn">
            <i data-lucide="share-2" class="mr"></i> 공유하기
          </button>
          <button class="full-btn primary-btn" id="saveBtn">
            일지에 저장
          </button>
        </div>

        <button class="full-btn white-btn final-confirm" id="confirmBtn">
          확인
        </button>

      </div>
    `;

    lucide.createIcons();

    document.getElementById("backBtn3").onclick = () => onBack();
    document.getElementById("shareBtn").onclick = shareResult;
    document.getElementById("confirmBtn").onclick = () => onBack();
    document.querySelectorAll(".product-btn").forEach(btn => {
      btn.onclick = () => productLink(btn.dataset.product);
    });
    document.getElementById("saveBtn").onclick = saveDiagnosis;
  }

  // ------------------------------
  // MOCK 촬영 함수
  // ------------------------------
  function mockTakePhoto() {
    diagnosisImage =
      "https://images.unsplash.com/photo-1624421719748-179e1a8e956d?auto=format&fit=crop&w=800&q=80";

    step = 2;
    render();
  }

  // ------------------------------
  // Step 이동
  // ------------------------------
  function goStep1() {
    step = 1;
    diagnosisImage = "";
    render();
  }

  // ------------------------------
  // 공유하기
  // ------------------------------
  function shareResult() {
    alert("카카오톡으로 공유했습니다!");
  }

  // ------------------------------
  // 추천 제품 링크
  // ------------------------------
  function productLink(name) {
    alert(`${name} 상세 페이지로 이동합니다.`);
  }

  // ------------------------------
  // 일지 저장
  // ------------------------------
  function saveDiagnosis() {
    const plant = plants[0]; // 기본 선택

    const entry = {
      id: Date.now().toString(),
      plantId: plant.id,
      plantNickname: plant.nickname,
      date: new Date().toISOString().slice(0, 10),
      images: [diagnosisImage],
      memo: "건강 진단을 진행했습니다.",
      tags: ["진단", "건강"],
      type: "diagnosis",
      diagnosisResult
    };

    onSaveDiagnosis(entry);
    alert("성장일지에 저장되었습니다!");
  }

  // ------------------------------
  // 초기 렌더
  // ------------------------------
  render();
}
