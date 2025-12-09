// [수정됨] 1. registerMyPlant 함수 임포트 추가
import { identifyPlant, registerMyPlant } from "../plant/plant_api.js";
import { addSchedule } from "../calendar/schedule_api.js";
// ⭐️⭐️⭐️ 모든 코드를 DOMContentLoaded 리스너 안에 넣습니다 ⭐️⭐️⭐️
document.addEventListener('DOMContentLoaded', () => {

    // ⭐️⭐️⭐️ 2단계 로직의 lucide 호출도 이 안에 위치시켜야 합니다. ⭐️⭐️⭐️
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // --- 1단계 (register1.html) 로직 ---
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
                        console.log('imageUrl:', result.imageUrl);
                        console.log('commonName:', result.commonName);
                        console.log('scientificName:', result.scientificName);
                        console.log('speciesId:', result.speciesId);
                        console.log('====================');
                        
                        // sessionStorage에 저장
                        sessionStorage.setItem('identificationResult', JSON.stringify(result));
                        
                        // ⭐️ 디버깅: 저장된 데이터 확인
                        console.log('=== sessionStorage 저장 확인 ===');
                        console.log(sessionStorage.getItem('identificationResult'));
                        console.log('================================');
                        
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


    // --- 2단계 (register2.html) 로직 ---
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        // 2단계 DOM 요소 가져오기
        const plantPreview = document.getElementById('plant-preview');
        const commonNameEl = document.getElementById('common-name');
        const scientificNameEl = document.getElementById('scientific-name');
        const progressTextEl = document.querySelector('.progress-text');
        const progressBarFgEl = document.querySelector('.progress-bar-fg');
        const nicknameInput = document.getElementById('nickname');
        const adoptionDateInput = document.getElementById('adoption-date');
        
        console.log('=== 2단계 페이지 로드 ==='); 
        
        // 1. sessionStorage에서 1단계 응답 데이터 읽기
        const resultString = sessionStorage.getItem('identificationResult');
        console.log('sessionStorage 원본 문자열:', resultString);
        
        let identificationResult = null;
        
        if (resultString) {
            try {
                const parsedData = JSON.parse(resultString);
                console.log('파싱된 데이터(원본):', parsedData);

                // 1. 기본 정보 추출 (카멜/스네이크 모두 체크)
                let imageUrl = parsedData.imageUrl || parsedData.image_url;
                let commonName = parsedData.commonName || parsedData.common_name;
                let scientificName = parsedData.scientificName || parsedData.scientific_name;
                let speciesId = parsedData.speciesId || parsedData.species_id;
                let probability = parsedData.probability;

                // ⭐️⭐️⭐️ [수정된 보물 찾기] ⭐️⭐️⭐️
                let candidates = [];

                // 1) 배열 찾기 시도
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

                // ⭐️⭐️⭐️ [추가된 핵심 로직] 목록이 없으면 단일 정보로 만들기! ⭐️⭐️⭐️
                if (candidates.length === 0 && (commonName || scientificName)) {
                    console.log('⚠️ 후보 목록이 없어서, 현재 정보로 목록을 생성합니다.');
                    candidates = [{
                        name: commonName,
                        scientific_name: scientificName,
                        probability: probability || 0,
                        url: null // 필요시 추가
                    }];
                }

                console.log('=== 🔎 보물 찾기 결과 ===');
                console.log('찾아낸 후보 개수:', candidates.length); // 이제 1개 이상 나올 겁니다!
                console.log('후보 목록:', candidates);
                console.log('=======================');

                // 1) 이미지 URL 할당
                if (plantPreview) {
                    const finalImageUrl = imageUrl || 'https://placehold.co/300x300/eee/ccc?text=No+Image';
                    plantPreview.src = finalImageUrl;
                }

                // 2) 이름 할당 (로딩 중... 없애기)
                if (commonNameEl) {
                    commonNameEl.textContent = commonName || '이름 없음';
                    // 로딩 클래스 제거 (혹시 있다면)
                    commonNameEl.classList.remove('loading'); 
                }
                if (scientificNameEl) {
                    scientificNameEl.textContent = scientificName || '학명 정보 없음';
                }
                
                // 3) 신뢰도 할당
                if (probability) {
                    const percentage = Math.round(probability * 100); 
                    if (progressTextEl) progressTextEl.textContent = `${percentage}%`;
                    if (progressBarFgEl) progressBarFgEl.style.width = `${percentage}%`;
                } else {
                    if (progressTextEl) progressTextEl.textContent = '알수없음';
                    if (progressBarFgEl) progressBarFgEl.style.width = '0%';
                }
                
                // ✅ [수정] 최종 사용할 객체 생성
                identificationResult = {
                    imageUrl,
                    commonName,
                    scientificName,
                    speciesId,
                    probability: probability || null,
                    identificationData: candidates // 여기에 배열 저장!
                };

            } catch (parseError) {
                console.error('JSON 파싱 실패:', parseError);
                alert('데이터 형식 오류가 발생했습니다.');
            }
        } else {
            console.error('sessionStorage에 데이터 없음!');
            alert('식물 식별 정보가 없습니다. 1단계부터 다시 시도해주세요.');
            window.location.href = '../register1/register1.html';
            return;
        }

        // --- 3단계 (최종 등록) 로직 ---
        registerBtn.addEventListener('click', async () => {
            const nickname = nicknameInput.value.trim();
            const adoptionDate = adoptionDateInput.value;

            if (!nickname || !adoptionDate) {
                alert('식물 애칭과 입양일을 모두 입력해주세요.');
                return;
            }

            if (!identificationResult || !identificationResult.speciesId) {
                alert('식물 종 정보가 없습니다. 다시 시도해주세요.');
                return;
            }

            // ✅ [수정] 백엔드 전송용 데이터 (중복 선언 제거됨)
            const plantData = {
                species_id: identificationResult.speciesId,
                nickname: nickname,
                adoption_date: adoptionDate,
                image_url: identificationResult.imageUrl,
                //중요! 식별 후보 목록을 문자열로 변환하여 전요
                identification_result: JSON.stringify(identificationResult.identificationData)        
            };
            
            console.log('=== 최종 등록 데이터 ===');
            console.log(plantData);

            registerBtn.disabled = true;
            registerBtn.textContent = '등록 중...';

            try {
                const newPlant = await registerMyPlant(plantData);
                console.log('최종 등록 성공:', newPlant);
                sessionStorage.removeItem('identificationResult');
                alert(`${newPlant.nickname}이(가) 성공적으로 등록되었습니다!`);
                window.location.href = '/app/main/main.html';

            } catch (error) {
                console.error('최종 식물 등록 실패:', error);
                alert('식물 등록에 실패했습니다. 다시 시도해주세요.');
                registerBtn.disabled = false;
                registerBtn.textContent = '이 식물 등록하기';
            }
        });

        
        // 4. 모달 [일정 추가] 버튼 클릭
        saveScheduleBtn.addEventListener('click', async () => {
            if (!registeredPlantId) {
                alert('식물 정보 오류입니다.');
                window.location.href = '/app/main/main.html';
                return;
            }
            
            const type = modalType.value;
            const date = modalDate.value;
            const freqStr = modalFreq.value;

            if (!date) { alert('날짜를 선택하세요'); return; }

            let frequencyDays = null;
            if (freqStr === 'DAILY') frequencyDays = 1;
            else if (freqStr === 'WEEKLY') frequencyDays = 7;
            else if (freqStr === 'MONTHLY') frequencyDays = 30;

            const scheduleData = {
                "next_due_date": date,
                "plant_id": Number(registeredPlantId),
                "schedule_type": type,
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

        // 5. 모달 [나중에 하기] 버튼 클릭
        skipScheduleBtn.addEventListener('click', () => {
            alert('식물 등록이 완료되었습니다.');
            window.location.href = '/app/main/main.html';
        });
    }
});
