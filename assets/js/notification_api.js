// assets/js/notification_api.js
// 앱 안 알림함 API
import { fetchApi } from './core_api.js';

export async function getNotifications() {
    const response = await fetchApi('/api/v1/notifications', { method: 'GET' });
    if (!response.ok) throw new Error(`알림 목록 조회 실패 (${response.status})`);
    return response.json();
}

export async function getUnreadCount() {
    const response = await fetchApi('/api/v1/notifications/unread-count', { method: 'GET' });
    if (!response.ok) throw new Error(`안 읽은 알림 개수 조회 실패 (${response.status})`);
    return (await response.json()).count;
}

export async function markAsRead(notificationId) {
    const response = await fetchApi(`/api/v1/notifications/${notificationId}/read`, { method: 'PATCH' });
    if (!response.ok) throw new Error(`읽음 처리 실패 (${response.status})`);
}

export async function markAllAsRead() {
    const response = await fetchApi('/api/v1/notifications/read-all', { method: 'PATCH' });
    if (!response.ok) throw new Error(`모두 읽음 처리 실패 (${response.status})`);
}
