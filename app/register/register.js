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

        // '식별하기' 버튼 클릭 이벤트 리스너 (API 호출)
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
                        
                        // ⭐️ 디버깅: API 응답 전체 구조 확인
                        console.log('=== API 응답 원본 ===');
                        console.log('전체 응답:', result);
                        
                        // sessionStorage에 저장
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


    // ========================================================
    // 2단계(register2) 및 3단계(register3) 통합 로직
    // ========================================================
    const registerBtn = document.getElementById('register-btn');
    
    // ★★★ 중요: 3단계 페이지(register-btn이 있는 경우)에서만 실행 ★★★
    if (registerBtn) {
        // DOM 요소 가져오기
        const plantImageEl = document.getElementById('plant-image-step3') || document.getElementById('plant-preview');
        const speciesInput = document.getElementById('species'); // register3용
        const commonNameEl = document.getElementById('common-name'); // register2용
        const scientificNameEl = document.getElementById('scientific-name'); // register2용
        const nicknameInput = document.getElementById('nickname');
        const adoptionDateInput = document.getElementById('adoptionDate') || document.getElementById('adoption-date');
        
        // --- 3단계 전용 요소 (드롭다운 & 모달) ---
        const careGuideToggle = document.getElementById('careGuideToggle');
        const careGuideContent = document.getElementById('careGuideContent');
        const careGuideIcon = document.getElementById('careGuideIcon');
        const aiDescriptionEl = document.getElementById('aiDescription');
        
        const scheduleModal = document.getElementById('scheduleModal');
        const saveScheduleBtn = document.getElementById('saveScheduleBtn');
        const skipScheduleBtn = document.getElementById('skipScheduleBtn');
        const modalDate = document.getElementById('modalDate');
        const modalType = document.getElementById('modalType');
        const modalFreq = document.getElementById('modalFreq');

        let registeredPlantId = null; 
        
        console.log('=== 페이지 로드 ==='); 
        
        // 1. 데이터 로드
        const resultString = sessionStorage.getItem('identificationResult');
        let identificationResult = null;
        
        if (resultString) {
            try {
                const parsedData = JSON.parse(resultString);
                console.log('파싱된 데이터(원본):', parsedData);

                // 정보 추출 (카멜/스네이크 케이스 모두 대응)
                let imageUrl = parsedData.imageUrl || parsedData.image_url;
                let commonName = parsedData.commonName || parsedData.common_name;
                let scientificName = parsedData.scientificName || parsedData.scientific_name;
                let speciesId = parsedData.speciesId || parsedData.species_id;
                let probability = parsedData.probability;

                // 후보 목록 생성 로직
                let candidates = [];
                if (Array.isArray(parsedData.identification_candidates)) {
                    candidates = parsedData.identification_candidates;
                } else if (Array.isArray(parsedData.suggestions)) {
                    candidates = parsedData.suggestions;
                } else if (parsedData.result && parsedData.result.classification && Array.isArray(parsedData.result.classification.suggestions)) {
                    candidates = parsedData.result.classification.suggestions;
                } else if (parsedData.data) {
                    const d = parsedData.data;
                    if (Array.isArray(d.suggestions)) candidates = d.suggestions;
                    else if (Array.isArray(d.identification_candidates)) candidates = d.identification_candidates;
                }

                // 후보 목록이 없으면 현재 정보로 생성
                if (candidates.length === 0 && (commonName || scientificName)) {
                    candidates = [{
                        name: commonName,
                        scientific_name: scientificName,
                        probability: probability || 0,
                        url: null
                    }];
                }

                // 이미지 URL 할당
                if (plantImageEl) {
                    plantImageEl.src = imageUrl || 'https://placehold.co/300x300/eee/ccc?text=No+Image';
                }

                // 텍스트 할당
                const displayName = commonName || '이름 없음';
                if (commonNameEl) commonNameEl.textContent = displayName;
                if (scientificNameEl) scientificNameEl.textContent = scientificName || '학명 정보 없음';
                if (speciesInput) speciesInput.value = displayName;

                // [드롭다운] AI 설명 채우기 (3단계용)
                if (aiDescriptionEl) {
                    let description = "이 식물에 대한 상세 정보가 없습니다.";
                    if (candidates.length > 0) {
                        const firstData = candidates[0];
                        if (firstData.description) description = firstData.description;
                        else if (firstData.wiki_description) description = firstData.wiki_description;
                    }
                    // 설명이 여전히 기본값이면 안내 메시지로 대체
                    if(description.includes("정보가 없습니다")) {
                        description = `<b>${displayName}</b>을(를) 등록하셨군요!<br>물주기와 햇빛 관리에 신경 써주시면 예쁘게 자랄 거예요.`;
                    }
                    aiDescriptionEl.innerHTML = description;
                }
                
                // 최종 사용할 객체 생성
                identificationResult = {
                    imageUrl,
                    commonName,
                    scientificName,
                    speciesId,
                    probability: probability || null,
                    identificationData: candidates 
                };

            } catch (parseError) {
                console.error('JSON 파싱 실패:', parseError);
                alert('데이터 형식 오류가 발생했습니다.');
            }
        } else {
            // 데이터가 없으면 1단계로 리다이렉트 (단, register2/3 페이지일 때만)
            if (window.location.pathname.includes('register2') || window.location.pathname.includes('register3')) {
                console.error('sessionStorage에 데이터 없음!');
                alert('식물 식별 정보가 없습니다. 1단계부터 다시 시도해주세요.');
                window.location.href = '../register1/register1.html';
                return;
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

        // 3. [등록 완료] 버튼 클릭 이벤트
        registerBtn.addEventListener('click', async () => {
            const nickname = nicknameInput.value.trim();
            const adoptionDate = adoptionDateInput.value;

            if (!adoptionDate) {
                alert('입양일을 선택해주세요.');
                return;
            }

            if (!identificationResult || !identificationResult.speciesId) {
                alert('식물 종 정보가 없습니다. 다시 시도해주세요.');
                return;
            }

            const plantData = {
                species_id: identificationResult.speciesId,
                nickname: nickname || identificationResult.commonName, 
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
                
                // ★ 여기서 식물 ID를 저장합니다 (일정 등록에 필요)
                registeredPlantId = newPlant.my_plant_id || newPlant.id;
                
                sessionStorage.removeItem('identificationResult');

                // 🔴 [수정 포인트] 성공 시 바로 이동하지 않고 모달을 띄웁니다!
                if(scheduleModal) {
                    if(modalDate) modalDate.value = new Date().toISOString().split('T')[0]; // 오늘 날짜 기본값
                    scheduleModal.classList.add('show'); // 팝업 띄우기
                } else {
                    // 모달이 없는 페이지(예: register2)라면 그냥 이동
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

        // 4. [모달] 일정 추가 버튼 (IF 블록 내부로 이동됨)
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

    } // ★★★ if (registerBtn) 블록 끝 ★★★
});
