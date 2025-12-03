import { fetchApi } from '../../core/core_api.js';
import { getMyPlants, deleteMyPlant } from '../plant/plant_api.js';

// 1. 페이지 로드 직후 정적 아이콘(헤더, 네비게이션 등) 렌더링
lucide.createIcons();

const userAvatar = document.getElementById('userAvatar');
const userNickname = document.getElementById('userNickname');
const togetherSince = document.getElementById('togetherSince');
const plantCount = document.getElementById('plantCount');
const plantListContainer = document.getElementById('plant-list');
const healthyCount = document.getElementById('healthyCount');
const warningCount = document.getElementById('warningCount');
const noneCount = document.getElementById('noneCount');

// 다이얼로그 관련 변수
const deleteDialog = document.getElementById('deleteDialog');
const dialogCancelBtn = document.getElementById('dialogCancel');
const dialogConfirmBtn = document.getElementById('dialogConfirm');
let plantIdToDelete = null; // 삭제할 식물 ID 저장용

// 사용자 프로필 정보 로드
async function loadUserProfile() {
    try {
        const res = await fetchApi('/api/v1/users/me');
        const user = await res.json();

        userNickname.value = user.kakaoNickname || user.nickname || 'Leafy 사용자';

        if (user.profileImage) {
            userAvatar.src = user.profileImage;
        } else {
            userAvatar.src = `https://api.dicebear.com/7.x/initials/svg?seed=${userNickname.value}`;
        }

        if (user.createdAt) {
            const joinDate = new Date(user.createdAt);
            const year = joinDate.getFullYear();
            const month = joinDate.getMonth() + 1;
            const day = joinDate.getDate();
            togetherSince.textContent = `${year}년 ${month}월 ${day}일`;
        } else {
            togetherSince.textContent = '-';
        }

    } catch (e) {
        console.error('사용자 정보 로드 실패', e);
        userNickname.value = '정보 없음';
    }
}

// 내 식물 데이터 및 통계 로드
async function loadMyPlantsData() {
    try {
        const plants = await getMyPlants();
        plantCount.textContent = `${plants.length}개`;
        plantListContainer.innerHTML = '';

        let healthy = 0, warning = 0, none = 0;

        if (plants.length === 0) {
            plantListContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:40px;">등록된 식물이 없습니다.</p>';
        } else {
            plants.forEach(plant => {
                const result = plant.lastDiagnosisResult;
                const hasDiagnosis = result && result !== 'NONE';

                let statusText = '진단 이력 없음';
                let statusType = '진단 X';

                if (!hasDiagnosis) {
                    none++;
                } else {
                    if (result.includes('주의') || result.includes('심각') || result.includes('disease')) {
                        warning++;
                        statusType = '주의';
                    } else {
                        healthy++;
                        statusType = '건강';
                    }
                }
                
                const plantCard = document.createElement('div');
                plantCard.className = 'hs-card';
                plantCard.setAttribute('data-my-plant-id', plant.my_plant_id);

                const imageUrl = plant.image_url || 'https://placehold.co/400x250';
                const nickname = plant.nickname || '이름 없음';
                const speciesName = plant.plant_species_name || '종 정보 없음';

                plantCard.innerHTML = `
                    <img src="${imageUrl}" alt="${nickname}" class="hs-img">
                    <button class="hs-delete-btn" data-my-plant-id="${plant.my_plant_id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                    <div class="hs-card-body">
                        <div class="hs-topline">
                            <span class="nickname">${nickname}</span>
                            <span class="type">${speciesName}</span>
                        </div>
                        <div class="info">
                            <span>최근 물주기: -</span> <span>상태: ${statusType}</span>
                        </div>
                    </div>
                `;
                plantListContainer.appendChild(plantCard);
            });
        }

        healthyCount.textContent = healthy;
        warningCount.textContent = warning;
        noneCount.textContent = none;

        lucide.createIcons();

    } catch (e) {
        console.error(e);
        plantListContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:40px;">식물을 불러오지 못했어요.</p>';
    }
}

// 닉네임 수정 버튼 기능
document.getElementById('editNicknameBtn').addEventListener('click', async () => {
    const input = userNickname;
    if (input.readOnly) {
        input.readOnly = false;
        input.focus();
        document.getElementById('editNicknameBtn').textContent = '저장';
    } else {
        input.readOnly = true;
        document.getElementById('editNicknameBtn').textContent = '변경';
        try {
            await fetchApi('/api/v1/users/me/nickname', {
                method: 'PATCH',
                body: JSON.stringify({ nickname: input.value })
            });
            alert('닉네임이 변경되었습니다!');
        } catch (e) {
            alert('변경 실패');
            loadUserProfile(); // 실패 시 원래 값 복구
        }
    }
});

// --- 삭제 관련 이벤트 핸들링 ---
function closeDialog() {
    deleteDialog.classList.add('hidden');
    plantIdToDelete = null;
}

dialogCancelBtn.addEventListener('click', closeDialog);

dialogConfirmBtn.addEventListener('click', async () => {
    if (!plantIdToDelete) return;

    try {
        await deleteMyPlant(plantIdToDelete);
        
        alert('식물이 삭제되었습니다.');
        closeDialog();
        
        // 목록 다시 로드
        loadMyPlantsData();

    } catch (error) {
        console.error('식물 삭제 중 에러 발생:', error);
        alert('식물 삭제에 실패했습니다.');
        closeDialog();
    }
});

plantListContainer.addEventListener('click', (event) => {
    const target = event.target;
    
    const deleteBtn = target.closest('.hs-delete-btn');
    const plantCard = target.closest('.hs-card');

    if (deleteBtn) {
        event.stopPropagation();
        plantIdToDelete = deleteBtn.dataset.myPlantId;
        deleteDialog.classList.remove('hidden');

    } else if (plantCard) {
        const myPlantId = plantCard.dataset.myPlantId;
        window.location.href = `/app/myplant/myplant_diary/myplant_diary.html?id=${myPlantId}`;
    }
});


// 실행
loadUserProfile();
loadMyPlantsData();
