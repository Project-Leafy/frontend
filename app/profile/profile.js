import { fetchApi } from '../../assets/js/core_api.js';
import { getMyPlants } from '../plant/plant_api.js';

// 1. 페이지 로드 직후 정적 아이콘 렌더링
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

const userAvatar = document.getElementById('userAvatar');
const userNickname = document.getElementById('userNickname');
const togetherSince = document.getElementById('togetherSince');
const plantCount = document.getElementById('plantCount');
const myPlantsList = document.getElementById('myPlantsList');
const healthyCount = document.getElementById('healthyCount');
const warningCount = document.getElementById('warningCount');
const noneCount = document.getElementById('noneCount');

// 사용자 프로필 정보 로드
async function loadUserProfile() {
    try {
        console.log("🔵 프로필 정보 요청 시작...");
        const res = await fetchApi('/api/v1/users/me');
        const user = await res.json();

        // 데이터 구조 방어 코드 (data 안에 있을수도, 바로 있을수도 있음)
        const userData = user.data || user;
        console.log('🟢 User Data:', userData);

        // 1. 닉네임 설정
        const nickname = userData.kakaoNickname || userData.kakao_nickname || userData.nickname || 'Leafy 사용자';
        userNickname.value = nickname;

        // 2. 프로필 사진
        if (userData.profileImage || userData.profile_image_url) {
            userAvatar.src = userData.profileImage || userData.profile_image_url;
        } else {
            userAvatar.src = '/assets/images/favicon.svg';
        }

        // ⭐️ [변경됨] 3. 가입일 대신 "함께한 지 N일째" 표시
        // 백엔드 필드명이 createdAt, created_at, joinDate 중 무엇인지 몰라도 다 체크
        const dateString = userData.createdAt || userData.created_at || userData.joinDate;
        
        if (dateString) {
            const joinDate = new Date(dateString);
            const today = new Date();
            
            // 시간 차이 계산 (밀리초 단위)
            const diffTime = Math.abs(today - joinDate);
            // 일(Day) 단위로 변환
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            // 화면에 표시 (예: 함께한 지 100일째)
            togetherSince.textContent = `함께한 지 ${diffDays}일째`;
            togetherSince.style.color = '#4A7C59'; // 초록색 강조
            togetherSince.style.fontWeight = 'bold';
        } else {
            // 날짜 데이터가 아예 없으면 "오늘부터 1일"로 표시
            togetherSince.textContent = '오늘부터 1일 🍃';
        }

    } catch (e) {
        console.error('🔴 사용자 정보 로드 실패:', e);
        userNickname.value = '정보 없음';
        // 에러 나면 기본값
        togetherSince.textContent = '오늘부터 1일';
    }
}
// 내 식물 데이터 및 통계 로드
async function loadMyPlantsData() {
    try {
        console.log("🔵 내 식물 목록 요청 시작...");
        const response = await getMyPlants();
        const plants = Array.isArray(response) ? response : (response.data || []);

        plantCount.textContent = `${plants.length}개`;
        myPlantsList.innerHTML = '';

        let healthy = 0, warning = 0, none = 0;

        if (!plants || plants.length === 0) {
            myPlantsList.innerHTML = '<div class="empty-state">등록된 식물이 없어요 🌿</div>';
        } else {
            plants.forEach(plant => {
                const result = plant.lastDiagnosisResult || plant.last_diagnosis_result;
                const hasDiagnosis = result && result !== 'NONE' && result !== 'null';

                let statusText = '진단 이력 없음';
                let statusClass = 'none';

                if (!hasDiagnosis) {
                    none++;
                    statusText = '진단 이력 없음';
                    statusClass = 'none';
                } else {
                    if (result.includes('주의') || result.includes('심각') || result.includes('disease') || result.includes('pest')) {
                        warning++;
                        statusText = '주의 필요';
                        statusClass = 'warning';
                    } else {
                        healthy++;
                        statusText = '건강';
                        statusClass = 'healthy';
                    }
                }

                const card = document.createElement('div');
                card.className = 'plant-card';
                // 이미지 필드명 체크
                const imgUrl = plant.imageUrl || plant.image_url || 'https://placehold.co/200?text=Leafy';
                // 식물 ID 필드명 체크
                const pId = plant.myPlantId || plant.my_plant_id || plant.id;

                card.innerHTML = `
                    <img src="${imgUrl}" alt="${plant.nickname}" onerror="this.src='https://placehold.co/200?text=No+Image'">
                    <div class="plant-info">
                        <div class="plant-nickname">${plant.nickname || '이름 없음'}</div>
                        <div class="plant-status ${statusClass}">
                            ${statusText}
                        </div>
                    </div>
                `;
                
                card.onclick = () => location.href = `/app/myplant/myplant_diary/myplant_diary.html?id=${pId}`;
                myPlantsList.appendChild(card);
            });
        }

        healthyCount.textContent = healthy;
        warningCount.textContent = warning;
        noneCount.textContent = none;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (e) {
        console.error('🔴 식물 목록 로드 실패:', e);
        myPlantsList.innerHTML = '<div class="empty-state">목록을 불러오지 못했어요 😢</div>';
    }
}

// 실행
loadUserProfile();
loadMyPlantsData();