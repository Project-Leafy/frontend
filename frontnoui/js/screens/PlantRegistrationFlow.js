// PlantRegistrationFlow.js

const randomImages = [
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1483794344563-d27a8d18014e",
];

// The main render function for the Plant Registration Flow, called by main.js
async function renderPlantRegistrationFlow({ onBack, onComplete }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  // --- Internal state for the flow ---
  let step = 1; // Current step in the registration flow
  let plantImage = ""; // URL of the plant image
  let analysisResult = {
    name: "몬스테라 델리시오사",
    scientific: "Monstera Deliciosa",
    confidence: 98,
  }; // Mock analysis result
  let nickname = ""; // User-entered nickname
  let adoptionDate = new Date().toISOString().split("T")[0]; // User-entered adoption date

  try {
    const response = await fetch("./pages/PlantRegistrationFlow.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // --- DOM Elements ---
    const step1El = document.getElementById("step1");
    const step2El = document.getElementById("step2");
    const step3El = document.getElementById("step3");

    // Step 1 elements
    const takePhotoBtn = document.getElementById("takePhoto");
    const selectFromAlbumBtn = document.getElementById("selectFromAlbum");
    const backBtn1 = document.getElementById("back1");

    // Step 2 elements
    const previewImageEl = document.getElementById("previewImage");
    const analysisNameEl = document.getElementById("analysisName");
    const analysisScientificEl = document.getElementById("analysisScientific");
    const confidenceLevelEl = document.getElementById("confidenceLevel");
    const confidencePercentEl = document.getElementById("confidencePercent");
    const nextToStep3Btn = document.getElementById("nextToStep3");
    const retakeBtn = document.getElementById("retake");
    const backBtn2 = document.getElementById("back2");

    // Step 3 elements
    const finalImageEl = document.getElementById("finalImage");
    const speciesInput = document.getElementById("species");
    const nicknameInput = document.getElementById("nickname");
    const adoptionDateInput = document.getElementById("adoptionDate");
    const backBtn3 = document.getElementById("back3");
    const completeBtn = document.getElementById("completeBtn");


    // --- Helper to navigate steps ---
    const goToStep = (targetStep) => {
      step = targetStep;
      [step1El, step2El, step3El].forEach(el => el && el.classList.remove("active")); // Null check for elements
      if (step === 1 && step1El) step1El.classList.add("active");
      if (step === 2 && step2El) step2El.classList.add("active");
      if (step === 3 && step3El) step3El.classList.add("active");
      lucide.createIcons(); // Re-render icons on step change if new elements appear
      updateStepContent();
    };

    // --- Update content based on current step ---
    const updateStepContent = () => {
        // Only update elements relevant to the current step
        if (step === 2) {
            if (previewImageEl) previewImageEl.src = plantImage;
            if (analysisNameEl) analysisNameEl.textContent = analysisResult.name;
            if (analysisScientificEl) analysisScientificEl.textContent = analysisResult.scientific;
            if (confidenceLevelEl) confidenceLevelEl.style.width = `${analysisResult.confidence}%`;
            if (confidencePercentEl) confidencePercentEl.textContent = `${analysisResult.confidence}%`;
        } else if (step === 3) {
            if (finalImageEl) finalImageEl.src = plantImage;
            if (speciesInput) speciesInput.value = analysisResult.name;
            if (nicknameInput) nicknameInput.value = nickname;
            if (adoptionDateInput) adoptionDateInput.value = adoptionDate;
        }
    };


    // --- Event Listeners ---

    // Step 1 events
    if (takePhotoBtn) {
        takePhotoBtn.onclick = () => {
            plantImage = randomImages[Math.floor(Math.random() * randomImages.length)];
            goToStep(2);
        };
    } else { console.error("takePhotoBtn not found"); }

    if (selectFromAlbumBtn) {
        selectFromAlbumBtn.onclick = takePhotoBtn.onclick; // Use same mock logic
    } else { console.error("selectFromAlbumBtn not found"); }

    if (backBtn1) {
        backBtn1.onclick = onBack; // Use the onBack callback from main.js
    } else { console.error("backBtn1 not found"); }

    // Step 2 events
    if (nextToStep3Btn) {
        nextToStep3Btn.onclick = () => goToStep(3);
    } else { console.error("nextToStep3Btn not found"); }

    if (retakeBtn) {
        retakeBtn.onclick = () => goToStep(1);
    } else { console.error("retakeBtn not found"); }

    if (backBtn2) {
        backBtn2.onclick = () => goToStep(1);
    } else { console.error("backBtn2 not found"); }

    // Step 3 events
    if (backBtn3) {
        backBtn3.onclick = () => goToStep(2);
    } else { console.error("backBtn3 not found"); }

    if (nicknameInput) {
        nicknameInput.oninput = (e) => nickname = e.target.value;
    } else { console.error("nicknameInput not found"); }

    if (adoptionDateInput) {
        adoptionDateInput.oninput = (e) => adoptionDate = e.target.value;
    } else { console.error("adoptionDateInput not found"); }

    if (completeBtn) {
        completeBtn.onclick = () => {
            const newPlant = {
                id: Date.now().toString(),
                name: analysisResult.name,
                species: analysisResult.scientific,
                nickname: nickname || analysisResult.name,
                adoptionDate: adoptionDate,
                imageUrl: plantImage,
            };
            onComplete(newPlant); // Use the onComplete callback from main.js
        };
    } else { console.error("completeBtn not found"); }


    // Initial render of the current step
    goToStep(step);

  } catch (error) {
    console.error("Failed to load PlantRegistrationFlow.html:", error);
  }
}