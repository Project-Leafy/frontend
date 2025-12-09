document.addEventListener('DOMContentLoaded', async () => {
    // =========================================
    // 1. DOM 요소 선택
    // =========================================
    const listContainer = document.querySelector('.dictionary-list'); //
    const resultCount = document.querySelector('.result-count');      //
    const searchInput = document.querySelector('.search-box input');  //

    let allPlants = []; // 서버에서 가져온 전체 식물 데이터를 저장할 변수

    // =========================================
    // 2. 데이터 로드 함수 (백엔드 -> S3 -> JSON)
    // =========================================
    async function loadPlants() {
        try {
            // 로딩 표시
            listContainer.innerHTML = '<div style="text-align:center; padding:40px; color:#999;">데이터를 불러오는 중입니다...</div>';

            // 1. 백엔드에게 S3 파일 주소 요청
            // (DictionaryController의 /api/dictionary/url 엔드포인트 호출)
            const urlRes = await fetch('/api/dictionary/url');
            if (!urlRes.ok) throw new Error("서버 통신 실패");
            
            const jsonUrl = await urlRes.text(); // 예: https://s3.../final_plants.json

            // 2. 받은 주소로 실제 데이터(JSON) 다운로드
            const dataRes = await fetch(jsonUrl);
            if (!dataRes.ok) throw new Error("데이터 다운로드 실패");
            
            allPlants = await dataRes.json();
            
            // 3. 화면에 리스트 그리기
            renderList(allPlants);

        } catch (error) {
            console.error("로딩 에러:", error);
            listContainer.innerHTML = '<div style="text-align:center; padding:40px; color:#999;">식물 정보를 불러오는데 실패했습니다.<br>잠시 후 다시 시도해주세요.</div>';
        }
    }

    // =========================================
    // 3. 리스트 렌더링 함수
    // =========================================
    function renderList(plants) {
        // 기존 목록 초기화
        listContainer.innerHTML = '';
        
        // 검색 결과 개수 업데이트
        if (resultCount) {
            resultCount.textContent = `총 ${plants.length}개의 식물`;
        }

        if (plants.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding:40px; color:#999;">검색 결과가 없습니다.</div>';
            return;
        }

        plants.forEach(plant => {
            // 카드 요소 생성
            const item = document.createElement('div');
            item.className = 'plant-item';
            
            // 클릭 시 상세 페이지 이동 (ID 전달)
            item.onclick = () => {
                window.location.href = `../plant_detail/plant_detail.html?id=${plant.id}`;
            };

            // 이미지 URL 처리 (없으면 기본 이미지)
            const imgSrc = plant.imageUrl || 'https://via.placeholder.com/70?text=No+Image';

            // HTML 구조 생성 (dictionary.css 스타일 적용됨)
            item.innerHTML = `
                <img src="${imgSrc}" class="plant-thumb" alt="${plant.koreanName}" loading="lazy">
                <div class="plant-info">
                    <h3 class="plant-name">${plant.koreanName}</h3>
                    <p class="plant-sci-name">${plant.scientificName}</p>
                    <p class="plant-desc">${plant.description}</p>
                </div>
                <i data-lucide="chevron-right" class="arrow-icon"></i>
            `;

            listContainer.appendChild(item);
        });

        // 아이콘 새로고침 (동적으로 추가된 요소에 아이콘 적용)
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // =========================================
    // 4. 검색 핸들러
    // =========================================
    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
            renderList(allPlants); // 검색어 없으면 전체 목록 표시
            return;
        }

        // 한글 이름 또는 학명에 검색어가 포함된 식물만 필터링
        const filtered = allPlants.filter(plant => 
            (plant.koreanName && plant.koreanName.toLowerCase().includes(query)) || 
            (plant.scientificName && plant.scientificName.toLowerCase().includes(query))
        );

        renderList(filtered);
    }

    // =========================================
    // 5. 초기 실행 및 이벤트 등록
    // =========================================
    
    // 데이터 로드 시작
    loadPlants();

    // 검색 입력 이벤트
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // 알림 버튼 (기존 기능 유지)
    const notiBtn = document.getElementById('notifications-btn');
    if (notiBtn) {
        notiBtn.addEventListener('click', () => {
            window.location.href = '/app/alarm/alarm.html';
        });
    }

    // 프로필 버튼 (기존 기능 유지)
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '/app/profile/profile.html';
        });
    }
    
    // 초기 아이콘 로드
    if (window.lucide) {
        lucide.createIcons();
    }
});