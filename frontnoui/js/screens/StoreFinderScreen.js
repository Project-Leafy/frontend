// StoreFinderScreen.js

/* mock stores */
const mockStores = [
  { id: 1, name: "초록식물원", address: "서울시 강남구 테헤란로 123", distance: "0.5km", phone: "02-1234-5678", hours: "09:00 - 20:00", rating: 4.8, pinTop: 35, pinLeft: 44 },
  { id: 2, name: "식물나라", address: "서울시 강남구 역삼동 456", distance: "1.2km", phone: "02-2345-6789", hours: "10:00 - 19:00", rating: 4.6, pinTop: 55, pinLeft: 58 },
  { id: 3, name: "그린가든", address: "서울시 서초구 서초대로 789", distance: "2.3km", phone: "02-3456-7890", hours: "09:00 - 21:00", rating: 4.9, pinTop: 68, pinLeft: 38 },
];

// The main render function for the Store Finder Screen, called by main.js
async function renderStoreFinderScreen({ onBack }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/StoreFinderScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Now select elements as they are available in the DOM
    const backBtn = document.getElementById("backBtn");
    const storeList = document.getElementById("storeList");
    const storeCount = document.getElementById("storeCount");
    const pins = document.getElementById("pins");


    /* 헤더 뒤로가기 */
    if (backBtn) {
      backBtn.addEventListener("click", onBack);
    } else {
      console.error("backBtn not found in StoreFinderScreen");
    }

    /* Store List 표시 */
    if (storeCount) {
      storeCount.textContent = `${mockStores.length}곳 발견`;
    } else {
      console.error("storeCount not found in StoreFinderScreen");
    }


    if (storeList) {
      storeList.innerHTML = ""; // Clear existing content
      mockStores.forEach(store => {
        const card = document.createElement("div");
        card.className = "store-card";
        card.innerHTML = `
          <div>
            <div class="store-title">${store.name}</div>
            <div class="store-meta">
              <span class="rating">★ ${store.rating}</span>
              <span>•</span>
              <span class="distance">${store.distance}</span>
            </div>
          </div>

          <div class="info-line">
            <i data-lucide="map-pin"></i>
            <span>${store.address}</span>
          </div>
          <div class="info-line">
            <i data-lucide="phone"></i>
            <span>${store.phone}</span>
          </div>
          <div class="info-line">
            <i data-lucide="clock"></i>
            <span>${store.hours}</span>
          </div>

          <button class="nav-btn">
            <i data-lucide="navigation"></i>
            카카오맵 길찾기
          </button>
        `;
        const navBtn = card.querySelector(".nav-btn");
        if (navBtn) {
            navBtn.onclick = () => alert(`카카오맵으로 ${store.name}까지 길찾기를 시작합니다.`);
        }
        storeList.appendChild(card);
      });
      lucide.createIcons(); // Re-create icons after rendering new content
    } else {
      console.error("storeList not found in StoreFinderScreen");
    }


    /* Map 핀 표시 */
    if (pins) {
      pins.innerHTML = ""; // Clear existing content
      mockStores.forEach(store => {
        const dot = document.createElement("div");
        dot.className = "pin";
        dot.style.top = `${store.pinTop}%`;
        dot.style.left = `${store.pinLeft}%`;
        dot.innerHTML = `<i data-lucide="map-pin"></i>`;
        pins.appendChild(dot);
      });
      lucide.createIcons(); // Re-create icons after rendering new content
    } else {
      console.error("pins element not found in StoreFinderScreen");
    }

  } catch (error) {
    console.error("Failed to load StoreFinderScreen.html:", error);
  }
}