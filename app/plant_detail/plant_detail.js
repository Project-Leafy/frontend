import { fetchApi } from '../../assets/js/core_api.js';
if (window.lucide) window.lucide.createIcons();

document.addEventListener('DOMContentLoaded', async () => {
    // 1. URL에서 식물 ID 가져오기 (예: plant_detail.html?id=52)
    const params = new URLSearchParams(window.location.search);
    const targetId = parseInt(params.get('id'));

    if (!targetId) {
        alert("잘못된 접근입니다. (ID가 없습니다)");
        return;
    }

    try {
        // 2. 백엔드에게 JSON 데이터 주소 물어보기
        const urlResponse = await fetchApi('/api/dictionary/url', { method: 'GET' });
        if (!urlResponse.ok) throw new Error("서버 통신 실패");
        
        const jsonUrl = await urlResponse.text(); // 예: https://s3.../final_plants.json

        // 3. 실제 식물 데이터 가져오기
        const dataResponse = await fetch(jsonUrl);
        const allPlants = await dataResponse.json();

        // 4. 전체 목록에서 내 ID(52)와 일치하는 식물 찾기
        const plant = allPlants.find(p => p.id === targetId);

        if (!plant) {
            alert("해당 식물 정보를 찾을 수 없습니다.");
            return;
        }

        // 5. 화면에 데이터 뿌리기 (렌더링)
        renderPlantDetail(plant);

    } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("식물 정보를 불러오는데 실패했습니다.");
    }
});


function renderPlantDetail(plant) {
    // 헤더 및 기본 정보
    document.getElementById('d_img').src = plant.imageUrl || 'https://via.placeholder.com/400';
    document.getElementById('d_korName').textContent = plant.koreanName;
    document.getElementById('d_sciName').textContent = plant.scientificName;
    
    // 설명
    document.getElementById('d_desc').textContent = plant.description;
    document.getElementById('d_feature').textContent = plant.flowerFruitInfo;

    // 핵심 태그
    const tagContainer = document.getElementById('d_tags');
    tagContainer.innerHTML = '';
    if (plant.keywordTags && Array.isArray(plant.keywordTags)) {
        plant.keywordTags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            tagContainer.appendChild(span);
        });
    }

    // Care Cards (환경)
    document.getElementById('c_difficulty').textContent = plant.displayDifficulty;
    document.getElementById('c_sun').textContent = plant.displaySunlight;
    document.getElementById('c_sun_tip').textContent = plant.sunlightTip;
    document.getElementById('c_temp').textContent = plant.temp;
    document.getElementById('c_temp_tip').textContent = plant.tempTip;
    document.getElementById('c_humid').textContent = plant.humidity;
    document.getElementById('c_humid_tip').textContent = plant.humidityTip;

    // Care Cards (관리)
    document.getElementById('c_fert').textContent = plant.fertilizer;
    document.getElementById('c_fert_tip').textContent = plant.fertilizerTip;
    document.getElementById('c_repot').textContent = `${plant.repottingCycleYears}년에 1번`;
    document.getElementById('c_repot_tip').textContent = plant.repottingTip;
    document.getElementById('c_soil').textContent = plant.soil;
    
    // 공기정화 정보
    document.getElementById('c_air').textContent = plant.airPurificationInfo;

    // 물주기 (계절별 숫자 -> 텍스트 변환 표시)
    document.getElementById('c_water_spring').textContent = `${plant.waterSpring}일에 1번`;
    document.getElementById('c_water_summer').textContent = `${plant.waterSummer}일에 1번`;
    document.getElementById('c_water_autumn').textContent = `${plant.waterAutumn}일에 1번`;
    document.getElementById('c_water_winter').textContent = `${plant.waterWinter}일에 1번`;
    document.getElementById('c_water_tip').textContent = plant.waterTip;

    // 독성 정보
    document.getElementById('c_toxic').textContent = plant.toxicityInfo;

    // 체크 포인트 리스트
    const tipContainer = document.getElementById('d_tips');
    tipContainer.innerHTML = '';
    if (plant.checkPointList && Array.isArray(plant.checkPointList)) {
        plant.checkPointList.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipContainer.appendChild(li);
        });
    }
}