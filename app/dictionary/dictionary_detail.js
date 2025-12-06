import { getPlantById } from '../plant/plant_api.js';

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const plantId = urlParams.get('plantId');

    if (!plantId) {
        document.querySelector('.content').innerHTML = '<p class="error-message">식물 ID를 찾을 수 없습니다.</p>';
        return;
    }

    try {
        const plant = await getPlantById(plantId);
        displayPlantDetails(plant);
    } catch (error) {
        console.error('Failed to get plant details:', error);
        document.querySelector('.content').innerHTML = `<p class="error-message">${error.message}</p>`;
    }
});

function displayPlantDetails(plant) {
    if (!plant) {
        document.querySelector('.content').innerHTML = '<p class="error-message">식물 정보를 불러오지 못했습니다.</p>';
        return;
    }

    document.getElementById('plant-name-header').textContent = plant.korName || '정보 없음';
    document.getElementById('plant-image').src = plant.imageUrl || '/assets/images/placeholder.png';
    document.getElementById('plant-image').alt = plant.korName;

    // 백엔드 응답 DTO의 필드명에 맞게 수정
    document.getElementById('sunlight-info').textContent = plant.lightDemand || '정보 없음'; 
    document.getElementById('watering-info').textContent = plant.waterCycle || '정보 없음';
    document.getElementById('temperature-info').textContent = plant.temperature || '정보 없음';
    document.getElementById('humidity-info').textContent = plant.humidity || '정보 없음';
    document.getElementById('poisoning-info').textContent = plant.isPoisonous ? '있음' : '없음';
    document.getElementById('plant-description-text').textContent = plant.description || '설명이 없습니다.';
}
