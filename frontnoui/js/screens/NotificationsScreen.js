// NotificationsScreen.js

const mockNotifications = [
  {
    id: "1",
    type: "water",
    title: "초록이 물주기",
    message: "오늘은 초록이 물 주는 날이에요! 흙 상태를 확인해보세요.",
    time: "오늘",
    read: false,
    plantNickname: "초록이",
    action: "plant",
  },
  {
    id: "2",
    type: "water",
    title: "공기요정 물주기",
    message: "공기요정에게 물을 줄 시간입니다.",
    time: "1시간 전",
    read: false,
    plantNickname: "공기요정",
    action: "plant",
  },
  {
    id: "3",
    type: "repot",
    title: "공기요정 분갈이 시기",
    message: "공기요정의 분갈이 시기가 다가왔어요. 뿌리 상태를 확인해보세요.",
    time: "어제",
    read: true,
    plantNickname: "공기요정",
    action: "plant",
  },
  {
    id: "4",
    type: "info",
    title: "식물 관리 팁",
    message: "겨울철에는 물주기 횟수를 줄이는 것이 좋아요.",
    time: "3일 전",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "성장 기록 추가",
    message: "초록이의 새로운 성장 기록이 추가되었어요!",
    time: "5일 전",
    read: true,
    plantNickname: "초록이",
    action: "plant",
  },
];

function bg(type) {
  return {
    water: "#DBEAFE",
    repot: "#FEF3C7",
    success: "#E8F4EC",
    info: "#F5F5F3",
  }[type];
}

function icon(type) {
  return {
    water: "droplets",
    repot: "scissors",
    success: "check-circle",
    info: "info",
  }[type];
}


// The main render function for the Notifications Screen, called by main.js
async function renderNotificationsScreen({ plants, onBack, onNavigateToPlant, onNavigateToCalendar }) {
  const appDiv = document.getElementById("app");
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  try {
    const response = await fetch("./pages/NotificationsScreen.html");
    const html = await response.text();
    appDiv.innerHTML = html;

    // After injecting HTML, initialize lucide icons
    lucide.createIcons();

    // Now select elements as they are available in the DOM
    const backBtn = document.getElementById("back-btn");
    const unreadCountEl = document.getElementById("unread-count");
    const notificationList = document.getElementById("notification-list");

    function handleNotificationClick(notification) {
      console.log("clicked:", notification.title);

      if (notification.action === "plant" && notification.plantNickname) {
        // Find the plant object by nickname
        const targetPlant = plants.find(p => p.nickname === notification.plantNickname);
        if (targetPlant) {
            onNavigateToPlant(targetPlant);
        } else {
            console.warn("Plant not found for notification:", notification.plantNickname);
            // Fallback: navigate to home or show error
            onBack();
        }
      } else if (notification.action === "calendar") {
        onNavigateToCalendar();
      }
    }


    if (unreadCountEl) {
        unreadCountEl.textContent = `${mockNotifications.filter(n => !n.read).length}개의 새 알림`;
    } else {
        console.error("unread-count element not found.");
    }

    if (notificationList) {
        notificationList.innerHTML = ""; // Clear existing content
        mockNotifications.forEach(n => {
            const card = document.createElement("button");
            card.className = `card ${n.read ? "" : "card-unread"}`;
            card.innerHTML = `
                <div class="row">
                    <div class="icon-circle" style="background:${bg(n.type)}">
                    <i data-lucide="${icon(n.type)}"></i>
                    </div>
                    <div class="content">
                    <div class="title-row">
                        <h3 class="title ${n.read ? "read" : ""}">${n.title}</h3>
                        <span class="time">${n.time}</span>
                    </div>
                    <p class="msg ${n.read ? "read" : ""}">${n.message}</p>
                    ${!n.read ? '<span class="unread-dot"></span>' : ""}
                    </div>
                </div>
            `;
            card.addEventListener("click", () => handleNotificationClick(n));
            notificationList.appendChild(card);
        });
        lucide.createIcons(); // Re-create icons after rendering new content
    } else {
        console.error("notification-list element not found.");
    }

    if (backBtn) {
      backBtn.addEventListener("click", onBack);
    } else {
      console.error("back-btn not found in NotificationsScreen");
    }

  } catch (error) {
    console.error("Failed to load NotificationsScreen.html:", error);
  }
}