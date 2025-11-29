
// global answers object for the survey
const answers = {
  sunlight: "",
  watering: "",
  experience: "",
};

// Helper function to create a survey block
function createSurveyBlock(title, icon, options, key) {
  const surveyContainer = document.getElementById("surveyContainer");
  if (!surveyContainer) {
    console.error("surveyContainer not found for createSurveyBlock:", title);
    return;
  }

  const div = document.createElement("div");
  div.className = "block";
  div.innerHTML = `
    <div class="block-header">
      <div class="block-icon">${icon}</div>
      <h3>${title}</h3>
    </div>
  `;

  options.forEach((opt) => {
    const row = document.createElement("label");
    row.className = "option";
    row.innerHTML = `
      <input type="radio" name="${key}" value="${opt.value}">
      <span>${opt.label}</span>
    `;
    row.onclick = () => {
      answers[key] = opt.value;
      validateSubmit();
    };
    div.appendChild(row);
  });

  surveyContainer.appendChild(div);
}

// Helper function to validate submit button state
function validateSubmit() {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return; // Ensure submitBtn exists

  const isReady = answers.sunlight && answers.watering && answers.experience;
  submitBtn.disabled = !isReady;
  submitBtn.classList.toggle("disabled", !isReady);
}


// The main render function for the Recommendation Screen, called by main.js
async function renderRecommendationScreen({ onProfileClick, onViewResults }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/RecommendationScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Now select elements as they are available in the DOM
    const profileBtn = document.getElementById("profileBtn");
    const submitBtn = document.getElementById("submitBtn");

    if (profileBtn) {
      profileBtn.addEventListener("click", onProfileClick);
    } else {
      console.error("profileBtn not found in RecommendationScreen");
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", onViewResults);
    } else {
      console.error("submitBtn not found in RecommendationScreen");
    }

    // Reset answers for a fresh survey each time the screen is rendered
    answers.sunlight = "";
    answers.watering = "";
    answers.experience = "";


    // Call createSurveyBlock functions to build the survey UI
    createSurveyBlock("햇빛 환경", "☀️", [
      { value: "bright", label: "햇빛이 잘 드는 곳 (남향, 동향 창가)" },
      { value: "partial", label: "적당한 햇빛 (반양지)" },
      { value: "shade", label: "햇빛이 잘 안 드는 곳 (북향, 실내)" },
    ], "sunlight");

    createSurveyBlock("물주기 선호도", "💧", [
      { value: "frequent", label: "자주 물을 주고 싶어요 (2–3일에 한 번)" },
      { value: "moderate", label: "적당히 주고 싶어요 (일주일에 한 번)" },
      { value: "rare", label: "가끔 주고 싶어요 (2주에 한 번 이상)" },
    ], "watering");

    createSurveyBlock("경험", "⏱️", [
      { value: "beginner", label: "처음이에요" },
      { value: "intermediate", label: "몇 번 키워봤어요" },
      { value: "expert", label: "능숙해요" },
    ], "experience");

    // Initial validation to disable submit button
    validateSubmit();

  } catch (error) {
    console.error("Failed to load RecommendationScreen.html:", error);
  }
}
