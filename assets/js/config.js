// assets/js/config.js

// 백엔드는 같은 주소의 nginx 가 /api 로 넘겨준다. 그래서 주소 없이 경로만 쓴다.
// 접속 주소(localhost, Tailscale IP 등)가 바뀌어도 이 값을 고칠 필요가 없다.
// 프론트를 nginx 없이 따로 띄워 백엔드에 직접 붙을 때만 아래처럼 주소를 넣는다.
// export const BACKEND_URL = 'http://localhost:8080';
export const BACKEND_URL = '';
