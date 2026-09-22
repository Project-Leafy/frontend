// register.js

import { identifyPlant, registerMyPlant, getCareInfo } from "../plant/plant_api.js";
import { createInitialSchedules } from "../calendar/schedule_api.js";

document.addEventListener('DOMContentLoaded', () => {
    // 0. 아이콘 초기화
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ========================================================
    // 1단계: 카메라 및 파일 선택 로직 (register1.html)
    // ========================================================
    const identifyBtn = document.getElementById('identify-btn');
    
    if (identifyBtn) {
        const albumBtn = document.getElementById('album-btn');
        const plantImageInput = document.getElementById('plant-image');
        const cameraInput = document.getElementById('camera-input');
        
        const buttonGroup = document.querySelector('.button-group');
        const takePhotoBtn = document.getElementById('take-photo-btn');
        const iconImage = document.querySelector('.icon-circle img');

        if (takePhotoBtn) {
            takePhotoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // 아이콘 클릭 시 버블링 방지
                if (cameraInput) {
                    console.log('📸 카메라 실행 요청');
                    cameraInput.click();
                } else {
                    alert('카메라 입력 태그를 찾을 수 없습니다.');
                }
            });
        }

        if (albumBtn) {
            albumBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (plantImageInput) plantImageInput.click();
            });
        }

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (file) {
                // 충돌 방지
                if (event.target === cameraInput && plantImageInput) plantImageInput.value = '';
                if (event.target === plantImageInput && cameraInput) cameraInput.value = '';

                if (buttonGroup) buttonGroup.style.display = 'none';
                if (takePhotoBtn) takePhotoBtn.style.display = 'none';
                identifyBtn.style.display = 'block';

                const reader = new FileReader();
                reader.onload = function(e) {
                    if (iconImage) {
                        iconImage.src = e.target.result;
                        iconImage.style.width = '100%';
                        iconImage.style.height = '100%';
                        iconImage.style.objectFit = 'cover';
                        iconImage.style.borderRadius = '50%';
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        if (plantImageInput) plantImageInput.addEventListener('change', handleFileSelect);
        if (cameraInput) cameraInput.addEventListener('change', handleFileSelect);

        identifyBtn.addEventListener('click', async () => {
            let file = plantImageInput?.files[0] || cameraInput?.files[0];
            if (!file) { alert('이미지를 선택해주세요.'); return; }

            identifyBtn.disabled = true;
            identifyBtn.textContent = '위치 정보 확인 중...';

            if (!navigator.geolocation) {
                alert('위치 정보를 사용할 수 없습니다.');
                identifyBtn.disabled = false; identifyBtn.textContent = '식별하기'; return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    identifyBtn.textContent = '식별 중...';

                    try {
                        const formData = new FormData();
                        formData.append('image', file);
                        formData.append('lat', lat);
                        formData.append('lon', lon);

                        const result = await identifyPlant(formData);
                        sessionStorage.setItem('identificationResult', JSON.stringify(result));
                        window.location.href = '../register2/register2.html';
                    } catch (error) {
                        console.error('식별 실패:', error);
                        alert('식물 식별에 실패했습니다.');
                        identifyBtn.disabled = false; identifyBtn.textContent = '식별하기';
                    }
                },
                (error) => {
                    alert('위치 정보를 가져올 수 없습니다.');
                    identifyBtn.disabled = false; identifyBtn.textContent = '식별하기';
                }
            );
        });
    }

    // ========================================================
    // 2단계: 등록 및 AI 스케줄 추천 (register2.html)
    // ========================================================
    const registerBtn = document.getElementById('register-btn');

    if (registerBtn) {
        // --- 1. DOM 요소 및 상태 변수 선언 ---
        const plantImageEl = document.getElementById('plant-preview');
        const commonNameEl = document.getElementById('common-name');
        const scientificNameEl = document.getElementById('scientific-name');
        const nicknameInput = document.getElementById('nickname');
        const adoptionDateInput = document.getElementById('adoption-date');

        const advancedModal = document.getElementById('advancedScheduleModal');
        const skipBtn = document.getElementById('skipAdvancedScheduleBtn');
        const saveBtnAdvanced = document.getElementById('saveAdvancedScheduleBtn');

        let identificationResult = null;
        let registeredPlant = null;
        let careInfo = null;

        // --- 2. 초기 데이터 로드 및 UI 설정 ---
        function initializeStep2() {
            const resultString = sessionStorage.getItem('identificationResult');
            if (!resultString) {
                alert('식물 식별 정보가 없습니다. 1단계부터 다시 시작해주세요.');
                window.location.href = '../register1/register1.html';
                return;
            }
            identificationResult = JSON.parse(resultString);
            
            if (plantImageEl) plantImageEl.src = identificationResult.imageUrl || 'https://placehold.co/300x300';
            if (commonNameEl) commonNameEl.textContent = identificationResult.commonName || '이름 없음';
            if (scientificNameEl) scientificNameEl.textContent = identificationResult.scientificName || '학명 정보 없음';
            if (nicknameInput) nicknameInput.placeholder = identificationResult.commonName || '예: 초록이';
        }

        // --- 3. 이벤트 리스너 등록 ---
        registerBtn.addEventListener('click', handlePlantRegistration);
        if(skipBtn) skipBtn.addEventListener('click', () => { window.location.href = '/app/main/main.html'; });
        if(saveBtnAdvanced) saveBtnAdvanced.addEventListener('click', handleSaveSchedules);

        // --- 4. 핵심 기능 함수 ---
        async function handlePlantRegistration() {
            if (!adoptionDateInput.value) { alert('입양일을 선택해주세요.'); return; }
            if (!identificationResult?.speciesId) { alert('식물 종 정보가 없습니다.'); return; }

            registerBtn.textContent = '등록 중...';
            registerBtn.disabled = true;

            const plantData = {
                speciesId: identificationResult.speciesId,
                nickname: nicknameInput.value.trim() || identificationResult.commonName,
                adoptionDate: adoptionDateInput.value,
                imageUrl: identificationResult.imageUrl,
                identificationResult: JSON.stringify(identificationResult.identificationData || [])
            };

            try {
                const newPlant = await registerMyPlant(plantData);
                registeredPlant = newPlant;
                sessionStorage.removeItem('identificationResult');
                await showAdvancedScheduleModal();
            } catch (error) {
                console.error('등록 에러:', error);
                alert(`등록 중 오류가 발생했습니다: ${error.message}`);
                registerBtn.disabled = false;
                registerBtn.textContent = '이 식물 등록하기';
            }
        }

        async function showAdvancedScheduleModal() {
            const speciesId = registeredPlant.plantSpeciesId || (registeredPlant.plantSpecies && registeredPlant.plantSpecies.speciesId);
            if (!speciesId) {
                alert('추천 정보를 불러올 수 없습니다. 스케줄 설정은 캘린더에서 직접 해주세요.');
                window.location.href = '/app/main/main.html';
                return;
            }

            try {
                careInfo = await getCareInfo(speciesId);
                
                document.getElementById('auto-water-label').textContent = `AI 추천 (${careInfo.waterCycle}일마다)`;
                document.getElementById('auto-repot-label').textContent = `AI 추천 (${Math.round(careInfo.repotCycle / 365)}년마다)`;
                document.getElementById('auto-fert-label').textContent = `AI 추천 (${careInfo.fertilizerCycle}일마다)`;

                document.getElementById('manual-water-days').value = careInfo.waterCycle;
                document.getElementById('manual-repot-days').value = careInfo.repotCycle;
                document.getElementById('manual-fert-days').value = careInfo.fertilizerCycle;

            } catch (error) {
                console.error('케어 정보 로드 실패:', error);
                alert('AI 추천 정보를 불러오지 못했습니다. 직접 입력하여 설정해주세요.');
            } finally {
                if (advancedModal) advancedModal.classList.add('show');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
        
        async function handleSaveSchedules() {
            saveBtnAdvanced.textContent = '저장 중...';
            saveBtnAdvanced.disabled = true;

            const scheduleRequests = [];
            const scheduleTypes = ['watering', 'repotting', 'fertilizing'];

            scheduleTypes.forEach(type => {
                const mode = document.querySelector(`input[name="${type}"]:checked`).value;
                let frequency = null;

                if (mode === 'AUTO' && careInfo) {
                    if (type === 'watering') frequency = careInfo.waterCycle;
                    if (type === 'repotting') frequency = careInfo.repotCycle;
                    if (type === 'fertilizing') frequency = careInfo.fertilizerCycle;
                } else { // MANUAL
                    const inputVal = document.getElementById(`manual-${type.substring(0,4)}-days`).value;
                    if (inputVal && parseInt(inputVal) > 0) {
                        frequency = parseInt(inputVal);
                    }
                }
                
                if (frequency) {
                    scheduleRequests.push({
                        plantId: registeredPlant.my_plant_id,
                        scheduleType: type.toUpperCase(),
                        mode: mode,
                        frequencyDays: frequency
                    });
                }
            });

            try {
                if (scheduleRequests.length > 0) {
                    await createInitialSchedules(scheduleRequests);
                    alert('새로운 식물과 관리 일정이 모두 등록되었습니다! 🎉');
                } else {
                    alert('식물 등록이 완료되었습니다!');
                }
                window.location.href = '/app/main/main.html';
            } catch (error) {
                console.error('스케줄 저장 에러:', error);
                alert(`일정 저장에 실패했습니다: ${error.message}`);
                saveBtnAdvanced.textContent = '일정 저장하고 완료';
                saveBtnAdvanced.disabled = false;
            }
        }

        initializeStep2();
    }
});