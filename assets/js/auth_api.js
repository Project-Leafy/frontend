// assets/js/auth_api.js
// 아이디·비밀번호 로그인, 회원가입, 계정 찾기, 비밀번호 변경, 탈퇴 API
import { BACKEND_URL } from './config.js';
import { fetchApi } from './core_api.js';

/**
 * 서버 응답을 { ok, status, data } 로 정리한다.
 * 실패 응답은 { status, reason, message } 형태이고, message 를 화면에 보여준다.
 */
async function toResult(response) {
    let data = null;
    const text = await response.text();
    if (text) {
        try { data = JSON.parse(text); } catch { data = { message: text }; }
    }
    return { ok: response.ok, status: response.status, data };
}

// 로그인 전에 호출하는 API. 토큰을 싣지 않고, 401 이어도 로그아웃하지 않는다.
async function publicPost(path, body) {
    try {
        const response = await fetch(BACKEND_URL + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return toResult(response);
    } catch (e) {
        return { ok: false, status: 0, data: { message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' } };
    }
}

async function authedCall(path, method, body) {
    try {
        const response = await fetchApi(path, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            skipAuthRedirect: true,
        });
        return toResult(response);
    } catch (e) {
        return { ok: false, status: 0, data: { message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' } };
    }
}

/** 서버의 검증 메시지("password: ...")에서 필드 이름을 떼고 사람이 읽을 문장만 남긴다. */
export function errorMessage(result, fallback = '요청을 처리하지 못했습니다.') {
    const message = result?.data?.message;
    if (!message) return fallback;
    return message.split(', ').map(m => m.replace(/^[A-Za-z_]+: /, '')).join('\n');
}

export async function checkLoginId(loginId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/check-login-id?loginId=${encodeURIComponent(loginId)}`);
        return toResult(response);
    } catch (e) {
        return { ok: false, status: 0, data: { message: '서버에 연결할 수 없습니다.' } };
    }
}

export const signup = (loginId, password, email, nickname) =>
    publicPost('/api/v1/auth/signup', { login_id: loginId, password, email, nickname });

export const login = (loginId, password) =>
    publicPost('/api/v1/auth/login', { login_id: loginId, password });

export const findLoginId = (email, nickname) =>
    publicPost('/api/v1/auth/find-id', { email, nickname });

export const resetPassword = (loginId, email, newPassword) =>
    publicPost('/api/v1/auth/reset-password', { login_id: loginId, email, new_password: newPassword });

export const changePassword = (currentPassword, newPassword) =>
    authedCall('/api/v1/auth/password', 'PATCH', { current_password: currentPassword, new_password: newPassword });

export const withdraw = (password) =>
    authedCall('/api/v1/auth/me', 'DELETE', { password });

// 서버와 같은 규칙. 서버에서도 한 번 더 검사한다.
export const LOGIN_ID_RULE = /^[a-z][a-z0-9_]{3,19}$/;
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;
