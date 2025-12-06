document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const backBtn = document.getElementById('back-btn');
    const resultContainer = document.getElementById('result-container');

    // 뒤로가기 버튼
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    // 로컬 스토리지에서 추천 결과 가져오기
    const resultsData = localStorage.getItem('recommendationResults');

    if (resultsData) {
        try {
            const recommendations = JSON.parse(resultsData);

            if (recommendations && recommendations.length > 0) {
                recommendations.forEach(plant => {
                    const card = createPlantCard(plant);
                    if (card) {
                       resultContainer.appendChild(card);
                    }
                });
            } else {
                displayNoResults();
            }
        } catch (error) {
            console.error('Error parsing recommendation results:', error);
            displayNoResults('결과를 처리하는 중 오류가 발생했습니다.');
        }
        
        // 사용한 데이터는 삭제하여 다음번 추천에 영향이 없도록 함
        localStorage.removeItem('recommendationResults');

    } else {
        displayNoResults();
    }

    function createPlantCard(plant) {
        // 백엔드에서 오는 데이터 필드명을 기반으로 카드 생성
        // 예시: plant.plantName, plant.description, plant.imageUrl
        const plantName = plant.plantName || '이름 정보 없음';
        const description = plant.message || '설명 정보 없음'; // DTO에 따라 필드명 확인 필요
        const imageUrl = plant.imageUrl || '/assets/images/placeholder.png'; // 기본 이미지
        const plantId = plant.plantId;

        if (!plantId) return null;

        const card = document.createElement('div');
        card.className = 'result-card';
        card.addEventListener('click', () => {
            // 식물 사전 상세 페이지로 이동 (plantId 활용)
            window.location.href = `/app/dictionary/dictionary_detail.html?plantId=${plantId}`;
        });

        card.innerHTML = `
            <img src="${imageUrl}" alt="${plantName}" class="plant-image">
            <div class="plant-info">
                <h3 class="plant-name">${plantName}</h3>
                <p class="plant-description">${description}</p>
            </div>
        `;
        return card;
    }

    function displayNoResults(message = '추천 결과를 찾을 수 없습니다.') {
        resultContainer.innerHTML = `<p style="text-align: center; color: #6B7280;">${message}</p>`;
    }
    
    // 네비게이션 버튼 이벤트 리스너 (필요 시 추가)
    document.getElementById('notifications-btn').addEventListener('click', () => {
        window.location.href = '/app/alarm/alarm.html';
    });
    document.getElementById('profileBtn').addEventListener('click', () => {
        window.location.href = '/app/profile/profile.html';
    });
});
