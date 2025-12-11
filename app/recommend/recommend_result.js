document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const backBtn = document.getElementById('back-btn');
    const headerTitleEl = document.getElementById('recommendation-header'); 
    const analysisCardEl = document.getElementById('analysis-summary-card');
    const resultContainer = document.getElementById('result-container');

    // 로컬 스토리지에서 추천 결과 가져오기
    const resultsData = localStorage.getItem('recommendationResults');

    if (resultsData) {
        try {
            const recommendations = JSON.parse(resultsData);

            // matchScore 기준 내림차순 정렬
            recommendations.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

            if (recommendations && recommendations.length > 0) {

                // 1. 요약 정보 렌더링
                renderSummary(recommendations);

                // 2. 개별 카드 렌더링
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
        // localStorage.removeItem('recommendationResults');

    } else {
        displayNoResults();
    }

    //추천 이유 요약 함수 
    function generateSummaryText(recommendations) {
        // 상위 5개 식물의 태그 분석
        const topPlants = recommendations.slice(0, 5);
        const tagCounts = {};
        
        // 핵심 매칭 태그를 카테고리별로 정의
        const preferenceCategories = [
            { startsWith: '#선호_햇빛조건', key: 'sunlight', text: "선호하는 햇빛 조건에 딱 맞는" },
            { startsWith: '#선호_물주기조건', key: 'watering', text: "물주기 습관과 잘 맞는" },
            { startsWith: '#당신의_물주기습관에_딱', key: 'watering', text: "물주기 습관과 잘 맞는" },
            { startsWith: '#선호_난이도', key: 'difficulty', text: "당신의 경험에 적합한" },
            { startsWith: '#초보자용', key: 'difficulty', text: "키우기 쉬운" },
            { startsWith: '#선호_성장속도', key: 'growth', text: "선호하는 성장 속도를 가진" },
            { startsWith: '#반려동물에게_안전', key: 'pet', text: "반려동물에게 안전한" },
        ];
        
        // 1. 카테고리별 빈도수 계산
        topPlants.forEach(plant => {
            if (plant.tags && Array.isArray(plant.tags)) {
                plant.tags.forEach(tag => {
                    const category = preferenceCategories.find(c => tag.startsWith(c.startsWith));
                    if (category) {
                        tagCounts[category.key] = (tagCounts[category.key] || 0) + 1;
                    }
                });
            }
        });
        
        // 2. 가장 높은 빈도수의 카테고리 2개 선택
        const sortedCategories = Object.entries(tagCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 2);
            
        // 3. 요약 문구 생성을 위한 핵심 이유 추출
        const summaryParts = [];
        const addedKeys = new Set(); // 중복 추가 방지

        sortedCategories.forEach(([key, count]) => {
            const categoryInfo = preferenceCategories.find(c => c.key === key);
            
            // 상위 5개 중 3개 이상(60%) 일치하면 핵심 이유로 간주하고, 아직 추가되지 않은 키만 처리
            if (categoryInfo && count >= topPlants.length * 0.6 && !addedKeys.has(key)) { 
                summaryParts.push(categoryInfo.text);
                addedKeys.add(key);
            }
        });

        // #초보자용 태그를 별도로 확인하여, "키우기 쉬운" 문구를 추가 (중복 방지)
        const isBeginnerFriendly = topPlants.some(p => p.tags.includes('#초보자용'));
        const difficultyKeyExists = addedKeys.has('difficulty');
        if (isBeginnerFriendly && !difficultyKeyExists) {
            const beginnerCategory = preferenceCategories.find(c => c.startsWith === '#초보자용');
            if (beginnerCategory) {
                summaryParts.push(beginnerCategory.text);
                addedKeys.add('difficulty'); // difficulty 키로 간주하여 중복 방지
            }
        }
        
        // 4. 최종 문장 조립
        if (summaryParts.length === 0) {
            return "당신의 환경과 취향을 고려하여 엄선된 식물을 추천해드려요.";
        } else if (summaryParts.length === 1) {
            return `${summaryParts[0]} 식물을 추천해드려요.`;
        } else {
            // 두 가지 이유를 자연스럽게 조합
            return `${summaryParts[0]} 그리고 ${summaryParts.slice(1).join(', ')} 식물을 추천해드려요.`;
        }
    }

    // 요약 UI 렌더링 함수 
    function renderSummary(recommendations) {
        // 1. 상단 타이틀 렌더링 (요청 1)
        headerTitleEl.textContent = "당신을 위한 맞춤 식물을 찾았어요!";
        headerTitleEl.classList.remove('no-results-text');
        
        // 2. 분석 이유 생성 및 렌더링 (요청 2)
        const summaryText = generateSummaryText(recommendations);
        
        analysisCardEl.innerHTML = `
            <h3>분석 완료!</h3>
            <p>${summaryText}</p>
        `;
        analysisCardEl.style.display = 'block'; // 보이도록 설정
    }

    // API 응답 스키마와 dictionary.html의 카드 구조를 기반으로 한 카드 생성 함수
    function createPlantCard(plant) {
        const koreanName = plant.korean_name || '이름 정보 없음';
        const scientificName = plant.scientific_name || '학명 정보 없음';
        const description = plant.description || '설명 정보 없음';
        const imageUrl = plant.official_image_url || '/assets/images/placeholder.png'; // 공식 이미지 URL 사용
        const speciesId = plant.species_id;
        const rawTags = plant.tags || [];

        if (!speciesId) return null;

        const card = document.createElement('div');
        card.className = 'plant-item'; // 사전 목록과 동일한 클래스 사용
        card.addEventListener('click', () => {
        // 사전 상세 페이지로 이동 (speciesId 활용)
            window.location.href = `/app/plant_detail/plant_detail.html?id=${speciesId}`;
        });

        const limitedTags = rawTags.slice(0, 3);
        const tagsHtml = limitedTags.map(tag => `<span class="match-tag">${tag.replace(/_/g, ' ')}</span>`).join('');

        card.innerHTML = `
            <img src="${imageUrl}" class="plant-thumb" alt="${koreanName}" loading="lazy">
            <div class="plant-info">
                <h3 class="plant-name">${koreanName}</h3>
                <p class="plant-sci-name">${scientificName}</p>
                <p class="plant-desc">${description}</p>
                <div class="card-tags-container">
                    ${tagsHtml}
                </div>
            </div>
            <i data-lucide="chevron-right" class="arrow-icon"></i>
        `;
        return card;
    }

    function displayNoResults(message = '추천 결과를 찾을 수 없습니다.') {
        resultContainer.innerHTML = `<p style="text-align: center; color: #6B7280;">${message}</p>`;
    }

    // 다시 설문조사 버튼 이벤트 리스너
    const retakeSurveyBtn = document.getElementById('retake-survey-btn');

    if (retakeSurveyBtn) {
        retakeSurveyBtn.addEventListener('click', () => {
            // 설문 페이지로 이동
            window.location.href = '/app/recommend/recommend.html';
        });
    }
    
    // 네비게이션 버튼 이벤트 리스너 (필요 시 추가)
    document.getElementById('notifications-btn').addEventListener('click', () => {
        window.location.href = '/app/alarm/alarm.html';
    });
    document.getElementById('profileBtn').addEventListener('click', () => {
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
