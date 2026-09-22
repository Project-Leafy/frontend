// 앱 안 알림함 (alarm.html 상단)
import { getNotifications, markAsRead, markAllAsRead } from '../../assets/js/notification_api.js';

const listEl = document.getElementById('inboxList');
const unreadEl = document.getElementById('inboxUnread');
const readAllBtn = document.getElementById('readAllBtn');

function formatDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// 메시지에는 사용자가 입력한 식물 이름이 들어가므로 HTML 이 아니라 텍스트로 넣는다.
function createCard(notification) {
    const card = document.createElement('div');
    card.className = `inbox-card ${notification.is_read ? 'read' : 'unread'}`;
    card.dataset.id = notification.notification_id;

    const message = document.createElement('p');
    message.className = 'inbox-message';
    message.textContent = notification.message;

    const meta = document.createElement('div');
    meta.className = 'inbox-meta';
    meta.textContent = [notification.plant_nickname, formatDateTime(notification.created_at)]
        .filter(Boolean).join(' · ');

    card.append(message, meta);
    card.addEventListener('click', async () => {
        if (card.classList.contains('read')) return;
        try {
            await markAsRead(notification.notification_id);
            card.classList.replace('unread', 'read');
            updateUnread(-1);
        } catch (e) {
            console.error(e);
        }
    });
    return card;
}

let unread = 0;
function updateUnread(delta) {
    unread = Math.max(0, unread + delta);
    unreadEl.textContent = unread > 0 ? `${unread}` : '';
    readAllBtn.hidden = unread === 0;
}

async function loadInbox() {
    try {
        const notifications = await getNotifications();
        listEl.replaceChildren();

        if (!notifications.length) {
            const empty = document.createElement('div');
            empty.className = 'inbox-empty';
            empty.textContent = '받은 알림이 없어요';
            listEl.append(empty);
        } else {
            notifications.forEach(n => listEl.append(createCard(n)));
        }
        unread = notifications.filter(n => !n.is_read).length;
        updateUnread(0);
    } catch (e) {
        console.error('알림함 로드 실패:', e);
        listEl.innerHTML = '<div class="inbox-empty">알림을 불러오지 못했어요.</div>';
    }
}

readAllBtn.addEventListener('click', async () => {
    try {
        await markAllAsRead();
        listEl.querySelectorAll('.inbox-card.unread').forEach(c => c.classList.replace('unread', 'read'));
        unread = 0;
        updateUnread(0);
    } catch (e) {
        console.error(e);
    }
});

loadInbox();
