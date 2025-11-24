// ===============================
// useIsMobile (React 훅 → 순수 JS)
// ===============================

const MOBILE_BREAKPOINT = 768;

let _isMobile = window.innerWidth < MOBILE_BREAKPOINT;
let _listeners = [];

// 호출 시 즉시 현재 모바일 여부 반환
export function isMobile() {
  return _isMobile;
}

// 모바일 상태 변경될 때마다 콜백 실행
export function onMobileChange(callback) {
  if (typeof callback === "function") {
    _listeners.push(callback);
  }
}

// 내부용: 상태 업데이트
function updateIsMobile() {
  const newState = window.innerWidth < MOBILE_BREAKPOINT;
  if (newState !== _isMobile) {
    _isMobile = newState;
    _listeners.forEach((fn) => fn(_isMobile));
  }
}

// 초기 체크
updateIsMobile();

// 리사이즈 or matchMedia 변화 감지
const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

// matchMedia 지원
mql.addEventListener("change", updateIsMobile);

// window resize fallback
window.addEventListener("resize", updateIsMobile);
