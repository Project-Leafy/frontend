// register.js

// 1. 필요한 API 함수 임포트
import { identifyPlant, registerMyPlant } from "../plant/plant_api.js";
import { addSchedule } from "../calendar/schedule_api.js";

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // ==========================================
    // 1단계 로직 (register1.html)
    // ==========================================
    const identifyBtn = document.getElementById('identify-btn');
    if (identifyBtn) {
        const albumBtn = document.getElementById('album-btn');
        const plantImageInput = document.getElementById('plant-image');
        const buttonGroup = document.querySelector('.button-group');
        const takePhotoBtn = document.getElementById('take-photo-btn');

        if(albumBtn) {
            albumBtn.addEventListener('click', () => { plantImageInput.click(); });
        }

        if(plantImageInput) {
            plantImageInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    if(buttonGroup) buttonGroup.style.display = 'none';
                    if(takePhotoBtn) takePhotoBtn.style.display = 'none';
                    identifyBtn.style.display = 'block';
                }
            });
        }

        identifyBtn.addEventListener('click', async () => {
            const file = plantImageInput.files[0];
            if (!file) { alert('이미지를 선택해주세요.'); return; }
            identifyBtn.disabled = true;
            identifyBtn.textContent = '위치 정보 확인 중...';

            if (!navigator.geolocation) { 
                alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
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
                        
                        console.log('API 응답:', result); // 디버깅용

                        sessionStorage.setItem('identificationResult', JSON.stringify(result));
                        window.location.href = '../register2/register2.html';
                    } catch (error) {
                        console.error('식물 식별 실패:', error);
                        alert('식물 식별에 실패했습니다. 다시 시도해주세요.');
                        identifyBtn.disabled = false; identifyBtn.textContent = '식별하기';
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('위치 정보를 가져올 수 없습니다.');
                    identifyBtn.disabled = false; identifyBtn.textContent = '식별하기';
                }
            );
        });

        if(takePhotoBtn) {
            takePhotoBtn.addEventListener('click', () => {
                alert('카메라 기능은 현재 준비 중입니다. 앨범에서 선택해주세요.');
            });
        }
    }


    // ==========================================
    // 2단계 및 3단계 로직 (register2.html, register3.html)
    // ==========================================
    const registerBtn = document.getElementById('register-btn');
    
    // ★★★ 중요: 여기서 if 블록이 시작됩니다. ★★★
    if (registerBtn) {
        // DOM 요소 가져오기
        const plantImageEl = document.getElementById('plant-image-step3') || document.getElementById('plant-preview');
        const speciesInput = document.getElementById('species');
        const commonNameEl = document.getElementById('common-name');
        const scientificNameEl = document.getElementById('scientific-name');
        const nicknameInput = document.getElementById('nickname');
        const adoptionDateInput = document.getElementById('adoptionDate') || document.getElementById('adoption-date');
        
        // 드롭다운 & 모달 요소 (여기서 변수가 선언됩니다)
        const careGuideToggle = document.getElementById('careGuideToggle');
        const careGuideContent = document.getElementById('careGuideContent');
        const careGuideIcon = document.getElementById('careGuideIcon');
        const aiDescriptionEl = document.getElementById('aiDescription');
        
        const scheduleModal = document.getElementById('scheduleModal');
        const saveScheduleBtn = document.getElementById('saveScheduleBtn'); // <--- 여기서 선언됨
        const skipScheduleBtn = document.getElementById('skipScheduleBtn');
        const modalDate = document.getElementById('modalDate');
        const modalType = document.getElementById('modalType');
        const modalFreq = document.getElementById('modalFreq');

        let registeredPlantId = null; 

        // 1. 데이터 로드
        const resultString = sessionStorage.getItem('identificationResult');
        let identificationResult = null;

        if (resultString) {
            try {
                identificationResult = JSON.parse(resultString);
                
                if(plantImageEl) plantImageEl.src = identificationResult.imageUrl || 'https://via.placeholder.com/300';
                
                const name = identificationResult.commonName || identificationResult.scientificName || '알 수 없는 식물';
                if(speciesInput) speciesInput.value = name;
                if(commonNameEl) commonNameEl.textContent = name;
                if(scientificNameEl) scientificNameEl.textContent = identificationResult.scientificName || '';

                if (aiDescriptionEl) {
                    let description = "이 식물에 대한 상세 정보가 없습니다.";
                    if (identificationResult.identificationData && identificationResult.identificationData.length > 0) {
                        const firstData = identificationResult.identificationData[0];
                        if (firstData.description) description = firstData.description;
                        else if (firstData.wiki_description) description = firstData.wiki_description;
                    }
                    if(description === "이 식물에 대한 상세 정보가 없습니다.") {
                        description = `<b>${name}</b>을(를) 등록하셨군요!<br>물주기와 햇빛 관리에 신경 써주시면 예쁘게 자랄 거예요.`;
                    }
                    aiDescriptionEl.innerHTML = description;
                }

            } catch (e) {
                console.error("데이터 파싱 오류", e);
            }
        }

        // 2. [드롭다운] 토글 이벤트
        if(careGuideToggle && careGuideContent) {
            careGuideToggle.addEventListener('click', () => {
                const isOpen = careGuideContent.style.display === 'block';
                careGuideContent.style.display = isOpen ? 'none' : 'block';
                if(careGuideIcon) {
                    careGuideIcon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                    careGuideIcon.style.transition = 'transform 0.2s';
                }
            });
        }

        // 3. [등록 완료] 버튼 클릭
        registerBtn.addEventListener('click', async () => {
            const nickname = nicknameInput.value.trim();
            const adoptionDate = adoptionDateInput.value;

            if (!adoptionDate) {
                alert('입양일을 선택해주세요.');
                return;
            }

            const plantData = {
                species_id: identificationResult.speciesId || 1, 
                nickname: nickname || speciesInput.value,
                adoption_date: adoptionDate,
                image_url: identificationResult.imageUrl,
                identification_result: JSON.stringify(identificationResult.identificationData || [])
            };

            registerBtn.textContent = '등록 중...';
            registerBtn.disabled = true;

            try {
                // 식물 등록 API 호출
                const newPlant = await registerMyPlant(plantData);
                console.log('등록 성공:', newPlant);
                registeredPlantId = newPlant.my_plant_id || newPlant.id;
                
                sessionStorage.removeItem('identificationResult');

                // ★ 성공 시 모달 띄우기
                if(scheduleModal) {
                    if(modalDate) modalDate.value = new Date().toISOString().split('T')[0]; 
                    scheduleModal.classList.add('show');
                } else {
                    alert(`${newPlant.nickname} 등록 완료!`);
                    window.location.href = '/app/main/main.html';
                }

            } catch (error) {
                console.error('등록 실패:', error);
                alert('등록 실패: ' + error.message);
                registerBtn.textContent = '등록 완료';
                registerBtn.disabled = false;
            }
        });

        // 4. [모달] 일정 추가 버튼 (★ 이 부분이 if(registerBtn) 블록 안에 있어야 함 ★)
        if(saveScheduleBtn) {
            saveScheduleBtn.addEventListener('click', async () => {
                if (!registeredPlantId) return;

                const date = modalDate.value;
                if (!date) { alert('날짜를 선택하세요'); return; }

                let frequencyDays = null;
                const freq = modalFreq.value;
                if (freq === 'DAILY') frequencyDays = 1;
                else if (freq === 'WEEKLY') frequencyDays = 7;
                else if (freq === 'MONTHLY') frequencyDays = 30;

                const scheduleData = {
                    "next_due_date": date,
                    "plant_id": Number(registeredPlantId),
                    "schedule_type": modalType.value,
                    "frequency_days": frequencyDays
                };

                try {
                    saveScheduleBtn.textContent = '저장 중...';
                    await addSchedule(scheduleData);
                    alert('식물과 일정이 모두 등록되었습니다!');
                    window.location.href = '/app/main/main.html';
                } catch (error) {
                    console.error('일정 등록 실패', error);
                    alert('식물은 등록되었으나, 일정 추가에 실패했습니다.');
                    window.location.href = '/app/main/main.html';
                }
            });
        }

        // 5. [모달] 나중에 하기 버튼
        if(skipScheduleBtn) {
            skipScheduleBtn.addEventListener('click', () => {
                alert('식물 등록이 완료되었습니다.');
                window.location.href = '/app/main/main.html';
            });
        }

    } // ★★★ 여기서 if (registerBtn) 블록이 끝납니다. ★★★
});