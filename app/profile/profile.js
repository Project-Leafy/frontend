import { fetchApi } from '../../assets/js/core_api.js';
import { getMyPlants } from '../plant/plant_api.js';
// [추가] 진단 기록 API 가져오기
import { getDiagnosisHistory } from '../diagnosis/diagnosis_api.js';

// 1. 페이지 로드 직후 실행
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    // 데이터 로드 실행
    loadUserProfile();
    loadMyPlantsData();
});

const userAvatar = document.getElementById('userAvatar');
const userNickname = document.getElementById('userNickname');
const togetherSince = document.getElementById('togetherSince');
const plantCount = document.getElementById('plantCount');
const myPlantsList = document.getElementById('myPlantsList');

// 통계 카운트 요소
const healthyCount = document.getElementById('healthyCount');
const warningCount = document.getElementById('warningCount');
const noneCount = document.getElementById('noneCount');

// 로그아웃 버튼 이벤트 리스너
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// -----------------------------------------------------------
// 사용자 프로필 정보 로드
// -----------------------------------------------------------
async function loadUserProfile() {
    try {
        const res = await fetchApi('/api/v1/users/me');
        const user = await res.json();
        const userData = user.data || user;

        // 1. 닉네임
        const nickname = userData.kakaoNickname || userData.kakao_nickname || userData.nickname || 'Leafy 사용자';
        userNickname.value = nickname;

        // 2. 프로필 사진
        if (userData.profileImage || userData.profile_image_url) {
            userAvatar.src = userData.profileImage || userData.profile_image_url;
        } else {
            userAvatar.src = '/assets/images/favicon.svg';
        }

        // 3. 함께한 날짜 계산
        const dateString = userData.createdAt || userData.created_at || userData.joinDate;
        if (dateString) {
            const joinDate = new Date(dateString);
            const today = new Date();
            const diffTime = Math.abs(today - joinDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            togetherSince.textContent = `함께한 지 ${diffDays}일째`;
            togetherSince.style.color = '#4A7C59';
            togetherSince.style.fontWeight = 'bold';
        } else {
            togetherSince.textContent = '오늘부터 1일 🍃';
        }

    } catch (e) {
        console.error('사용자 정보 로드 실패:', e);
        userNickname.value = '정보 없음';
        togetherSince.textContent = '-';
    }
}

// -----------------------------------------------------------
// [핵심] 내 식물 데이터 및 건강 통계 로드
// -----------------------------------------------------------
async function loadMyPlantsData() {
    try {
        // 1. 식물 목록 가져오기
        const plants = await getMyPlants();
        const plantList = Array.isArray(plants) ? plants : (plants.data || []);

        plantCount.textContent = `${plantList.length}개`;
        myPlantsList.innerHTML = '';

        if (plantList.length === 0) {
            myPlantsList.innerHTML = '<div class="empty-state">등록된 식물이 없어요 🌿</div>';
            updateHealthCounts(0, 0, 0); // 0으로 초기화
            return;
        }

        // 2. 각 식물별 진단 상태 병렬 조회
        let hCount = 0; // 건강
        let wCount = 0; // 주의
        let nCount = 0; // 없음

        // Promise.all로 병렬 처리하여 속도 최적화
        const plantsWithStatus = await Promise.all(plantList.map(async (plant) => {
            let statusClass = 'none';
            let statusText = '진단 이력 없음';

            try {
                // 진단 기록 조회 API 호출
                const history = await getDiagnosisHistory(plant.my_plant_id);
                
                if (history && history.length > 0) {
                    // 최신 기록 확인 (0번 인덱스 가정)
                    const latest = history[0];
                    
                    // [판별 로직] 정확도 60% (0.6) 이상이면 '주의 필요'
                    if (latest.disease_probability >= 0.6) {
                        statusClass = 'warning';
                        statusText = '주의 필요';
                        wCount++;
                    } else {
                        statusClass = 'healthy';
                        statusText = '건강한 식물';
                        hCount++;
                    }
                } else {
                    // 기록 없음
                    nCount++;
                }
            } catch (e) {
                console.warn(`ID ${plant.my_plant_id} 진단 기록 조회 실패`, e);
                nCount++; // 에러 시 '없음'으로 처리
            }

            return { ...plant, statusClass, statusText };
        }));

        // 3. 통계 UI 업데이트
        updateHealthCounts(hCount, wCount, nCount);

        // 4. 식물 카드 렌더링
        plantsWithStatus.forEach(plant => {
            const card = document.createElement('div');
            card.className = 'plant-card';
            
            const imgUrl = plant.image_url || plant.imageUrl || 'https://placehold.co/200?text=Leafy';
            // 닉네임이 없으면 식물 종 이름 사용
            const displayName = plant.nickname || plant.plant_species_name || '이름 없음'; 
            const pId = plant.my_plant_id || plant.myPlantId || plant.id;

            card.innerHTML = `
                <img src="${imgUrl}" alt="${displayName}" onerror="this.src='https://placehold.co/200?text=No+Image'">
                <div class="plant-info">
                    <div class="plant-nickname">${displayName}</div>
                    <div class="plant-status ${plant.statusClass}">
                        ${plant.statusText}
                    </div>
                </div>
            `;
            
            // 클릭 시 상세 페이지 이동
            card.onclick = () => location.href = `/app/myplant/myplant_diary/myplant_diary.html?id=${pId}`;
            myPlantsList.appendChild(card);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (e) {
        console.error('식물 목록 로드 실패:', e);
        myPlantsList.innerHTML = '<div class="empty-state">목록을 불러오지 못했어요 😢</div>';
    }
}

// 통계 숫자 업데이트 함수
function updateHealthCounts(healthy, warning, none) {
    if(healthyCount) healthyCount.textContent = healthy;
    if(warningCount) warningCount.textContent = warning;
    if(noneCount) noneCount.textContent = none;
}

// -----------------------------------------------------------
// 로그아웃 함수
// -----------------------------------------------------------
function handleLogout() {
    if (!confirm('정말 로그아웃 하시겠습니까?')) {
        return;
    }
    try {
        // 토큰 삭제 (프로젝트 설정에 따라 키 이름 확인: accessToken vs access_token)
        localStorage.removeItem('access_token'); 
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_nickname');
        
        alert('로그아웃 되었습니다.');
        window.location.href = '/index.html'; 
    } catch (error) {
        console.error('로그아웃 오류:', error);
        alert('로그아웃 중 문제가 발생했습니다.');
    }
}