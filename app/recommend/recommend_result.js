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

// API 응답 스키마와 dictionary.html의 카드 구조를 기반으로 한 카드 생성 함수
    function createPlantCard(plant) {
        const koreanName = plant.koreanName || '이름 정보 없음';
        const scientificName = plant.scientificName || '학명 정보 없음';
        const description = plant.description || '설명 정보 없음';
        const imageUrl = plant.officialImageUrl || '/assets/images/placeholder.png'; // 공식 이미지 URL 사용
        const speciesId = plant.speciesId;

        if (!speciesId) return null;

        const card = document.createElement('div');
        card.className = 'plant-item'; // 사전 목록과 동일한 클래스 사용
        card.addEventListener('click', () => {
        // 사전 상세 페이지로 이동 (speciesId 활용)
            window.location.href = `/app/plant_detail/plant_detail.html?id=${speciesId}`;
        });

        card.innerHTML = `
            <img src="${imageUrl}" class="plant-thumb" alt="${koreanName}" loading="lazy">
            <div class="plant-info">
                <h3 class="plant-name">${koreanName}</h3>
                <p class="plant-sci-name">${scientificName}</p>
                <p class="plant-desc">${description}</p>
            </div>
            <i data-lucide="chevron-right" class="arrow-icon"></i>
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
    document.getElementById('profile-btn').addEventListener('click', () => {
        window.location.href = '/app/profile/profile.html';
    });

    // 하단 네비게이션 활성화 상태 설정 함수
    function setActiveNavItem() {
        const navItems = document.querySelectorAll('#bottom-nav .nav-item');
        const currentPath = window.location.pathname;

        navItems.forEach(item => {
            item.classList.remove('active'); // Remove active from all first
            
            if (currentPath.includes('/app/recommend/')) {
                if (item.getAttribute('href') === '/app/recommend/recommend.html') {
                    item.classList.add('active');
                }
            } else if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }

    // Call setActiveNavItem on page load
    setActiveNavItem();
});
