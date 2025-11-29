// PlantDetailScreen.js

function formatDate(dateString) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) { // Check for invalid date
    return "날짜 오류";
  }
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}


// The main render function for the Plant Detail Screen, called by main.js
async function renderPlantDetailScreen({ plant, journals, onBack, onAddJournal, onJournalClick, onInfoClick }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/PlantDetailScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;
    console.log("[PlantDetailScreen] Injected HTML:", appDiv.innerHTML); // Debugging: log injected HTML

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Now select elements as they are available in the DOM
    const plantImg = document.getElementById("plant-img");
    const plantNickname = document.getElementById("plant-nickname");
    const plantName = document.getElementById("plant-name");
    const adoptionDateEl = document.getElementById("adoption-date");
    const daysSinceEl = document.getElementById("days-since");
    const backBtn = document.getElementById("back-btn");
    const infoBtn = document.getElementById("info-btn");
    const addJournalBtn = document.getElementById("add-journal-btn");
    const journalList = document.getElementById("journal-list");

    // ---------------------------
    // 🌿 화면 렌더링
    // ---------------------------
    if (plantImg && plant) {
      plantImg.src = plant.imageUrl;
    } else { console.error("plant-img not found or plant data missing"); }

    if (plantNickname && plant) {
      plantNickname.textContent = plant.nickname;
    } else { console.error("plant-nickname not found or plant data missing"); }

    if (plantName && plant) {
      plantName.textContent = plant.name;
    } else { console.error("plant-name not found or plant data missing"); }

    if (adoptionDateEl && plant) {
      adoptionDateEl.textContent = formatDate(plant.adoptionDate);
    } else { console.error("adoption-date not found or plant data missing"); }

    if (daysSinceEl && plant) {
      const adoptionDate = new Date(plant.adoptionDate);
      if (!isNaN(adoptionDate.getTime())) {
        const diffTime = Math.abs(Date.now() - adoptionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysSinceEl.textContent = `${diffDays}일`;
      } else {
        daysSinceEl.textContent = "날짜 오류";
        console.error("Invalid adoption date:", plant.adoptionDate);
      }
    } else { console.error("days-since not found or plant data missing"); }


    if (backBtn) {
      backBtn.addEventListener("click", onBack);
    } else { console.error("back-btn not found"); }

    if (infoBtn) {
      infoBtn.addEventListener("click", () => onInfoClick(plant));
    } else { console.error("info-btn not found"); }

    if (addJournalBtn) {
      addJournalBtn.addEventListener("click", () => onAddJournal(plant));
    } else { console.error("add-journal-btn not found"); }

    // 📌 일지 렌더링
    if (journalList) {
        journalList.innerHTML = "";
        journals.forEach(j => {
            const card = document.createElement("button");
            card.className = "journal-card";
            card.innerHTML = `
                <div class="journal-content">
                    ${j.images.length ? `<div class="journal-thumb"><img src="${j.images[0]}" onerror="this.onerror=null;this.src='../assets/placeholder.png';"></div>` : ""}
                    <div class="journal-meta">
                        <div style="display:flex;justify-content:space-between;">
                            <span class="journal-date">${formatDate(j.date)}</span>
                            ${j.images.length > 1 ? `<span class="journal-img-count">+${j.images.length - 1}</span>` : ""}
                        </div>
                        <p class="journal-text">${j.memo}</p>
                        <div class="journal-tags">
                            ${j.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
                        </div>
                    </div>
                </div>
            `;
            card.addEventListener("click", () => onJournalClick(j));
            journalList.appendChild(card);
        });
        lucide.createIcons(); // Re-create icons for dynamically added content
    } else { console.error("journal-list not found"); }


  } catch (error) {
    console.error("Failed to load PlantDetailScreen.html:", error);
  }
}