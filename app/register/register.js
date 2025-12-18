// register.js

// 1. 필요한 API 함수 임포트
import { identifyPlant, registerMyPlant } from "../plant/plant_api.js";
import { addSchedule } from "../calendar/schedule_api.js";

document.addEventListener('DOMContentLoaded', () => {
    // Lucide 아이콘 초기화
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // ==========================================
    // 1단계 로직 (register1.html) - 카메라/앨범 통합
    // ==========================================
    const identifyBtn = document.getElementById('identify-btn');
    
    if (identifyBtn) {
        const albumBtn = document.getElementById('album-btn');
        const plantImageInput = document.getElementById('plant-image'); // 앨범용
        const cameraInput = document.getElementById('camera-input');    // 카메라용

        const buttonGroup = document.querySelector('.button-group');
        const takePhotoBtn = document.getElementById('take-photo-btn');
        const iconImage = document.querySelector('.icon-circle img');

        // 1. 앨범 버튼 클릭
        if(albumBtn) {
            albumBtn.addEventListener('click', () => { 
                if(plantImageInput) plantImageInput.click(); 
            });
        }

        // 2. 카메라 버튼 클릭 (여기서 cameraInput을 트리거)
        if(takePhotoBtn) {
            takePhotoBtn.addEventListener('click', () => {
                if(cameraInput) {
                    cameraInput.click();
                } else {
                    alert('카메라 기능을 찾을 수 없습니다.');
                }
            });
        }

        // 3. 파일 선택 핸들러 (카메라/앨범 공통 사용)
        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (file) {
                // ★ [핵심 수정] 한쪽이 선택되면 다른 쪽 비우기 (충돌 방지)
                if (event.target === cameraInput && plantImageInput) plantImageInput.value = '';
                if (event.target === plantImageInput && cameraInput) cameraInput.value = '';

                // UI 변경
                if(buttonGroup) buttonGroup.style.display = 'none';
                if(takePhotoBtn) takePhotoBtn.style.display = 'none';
                identifyBtn.style.display = 'block';

                // 미리보기
                const reader = new FileReader();
                reader.onload = function(e) {
                    if(iconImage) {
                        iconImage.src = e.target.result;
                        Object.assign(iconImage.style, {
                            width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        // 4. 이벤트 연결
        if(plantImageInput) plantImageInput.addEventListener('change', handleFileSelect);
        if(cameraInput) cameraInput.addEventListener('change', handleFileSelect);
        
        // 5. 식별하기 버튼 클릭
        identifyBtn.addEventListener('click', async () => {
            // 값이 있는 파일 찾기
            let file = plantImageInput?.files[0] || cameraInput?.files[0];

            if (!file) { alert('이미지를 선택해주세요.'); return; }
            
            identifyBtn.disabled = true;
            identifyBtn.textContent = '위치 정보 확인 중...';

            if (!navigator.geolocation) { 
                alert('위치 정보를 지원하지 않는 브라우저입니다.');
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
                        console.log('=== 식별 결과 ===', result);
                        
                        sessionStorage.setItem('identificationResult', JSON.stringify(result));
                        window.location.href = '../register2/register2.html';
                    } catch (error) {
                        console.error('식물 식별 실패:', error);
                        alert('식물 식별에 실패했습니다.');
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
    }


    // ========================================================
    // 2단계 & 3단계 로직 (등록 및 일정 추천 모달)
    // ========================================================
    const registerBtn = document.getElementById('register-btn');
    
    if (registerBtn) {
        // 요소 가져오기
        const plantImageEl = document.getElementById('plant-preview'); // register2.html ID 기준
        const commonNameEl = document.getElementById('common-name');
        const scientificNameEl = document.getElementById('scientific-name');
        const nicknameInput = document.getElementById('nickname');
        const adoptionDateInput = document.getElementById('adoption-date');
        
        // 모달 요소
        const scheduleModal = document.getElementById('scheduleModal');
        const saveScheduleBtn = document.getElementById('saveScheduleBtn');
        const skipScheduleBtn = document.getElementById('skipScheduleBtn');
        const modalDate = document.getElementById('modalDate');
        const modalType = document.getElementById('modalType');
        const modalFreq = document.getElementById('modalFreq');

        let registeredPlantId = null; 
        
        // 1. 데이터 로드 및 화면 표시
        const resultString = sessionStorage.getItem('identificationResult');
        let identificationResult = null;
        
        if (resultString) {
            try {
                const parsedData = JSON.parse(resultString);
                
                // 데이터 파싱 (유연하게 처리)
                let imageUrl = parsedData.imageUrl || parsedData.image_url;
                let commonName = parsedData.commonName || parsedData.common_name;
                let scientificName = parsedData.scientificName || parsedData.scientific_name;
                let speciesId = parsedData.speciesId || parsedData.species_id;
                
                // 후보군 데이터 확보
                let candidates = parsedData.identificationData || 
                                 parsedData.identification_candidates || 
                                 parsedData.suggestions || [];

                // 화면 렌더링
                if (plantImageEl) plantImageEl.src = imageUrl || 'https://placehold.co/300x300/eee/ccc?text=No+Image';
                if (commonNameEl) commonNameEl.textContent = commonName || '이름 없음';
                if (scientificNameEl) scientificNameEl.textContent = scientificName || '학명 정보 없음';
                
                // 데이터 객체 재구성
                identificationResult = {
                    imageUrl, commonName, scientificName, speciesId,
                    identificationData: candidates 
                };

            } catch (error) {
                console.error('데이터 파싱 오류:', error);
                alert('식물 정보를 불러오는 데 실패했습니다.');
            }
        } else {
            // 데이터 없으면 1단계로 강제 이동 (register2 페이지인 경우에만)
            if (window.location.pathname.includes('register2')) {
                alert('식물 정보가 없습니다.');
                window.location.href = '../register1/register1.html';
                return;
            }
        }

        // 2. [등록하기] 버튼 클릭 -> 등록 후 모달 띄우기
        registerBtn.addEventListener('click', async () => {
            const nickname = nicknameInput.value.trim();
            const adoptionDate = adoptionDateInput.value;

            if (!adoptionDate) { alert('입양일을 선택해주세요.'); return; }
            if (!identificationResult?.speciesId) { alert('식물 종 정보가 유효하지 않습니다.'); return; }

            // 버튼 비활성화
            registerBtn.textContent = '등록 중...';
            registerBtn.disabled = true;

            const plantData = {
                species_id: identificationResult.speciesId,
                nickname: nickname || identificationResult.commonName, 
                adoption_date: adoptionDate,
                image_url: identificationResult.imageUrl,
                identification_result: JSON.stringify(identificationResult.identificationData || [])
            };

            try {
                // 1) 식물 등록 API 호출
                const newPlant = await registerMyPlant(plantData);
                console.log('✅ 식물 등록 성공:', newPlant);
                
                registeredPlantId = newPlant.my_plant_id || newPlant.id;
                
                // 데이터 정리
                const savedPlantInfo = { ...identificationResult };
                sessionStorage.removeItem('identificationResult');

                // 2) 모달 띄우기 및 추천 로직 실행
                if(scheduleModal) {
                    // 기본 날짜 설정
                    if(modalDate) modalDate.value = new Date().toISOString().split('T')[0];
                    
                    // --- [추천 로직 시작] ---
                    const getRec = (info) => {
                        const candidates = info.identificationData || [];
                        let desc = "";
                        if (candidates.length > 0) {
                             desc = candidates[0].description || candidates[0].wiki_description || "";
                        }
                        const text = (String(info.commonName) + " " + String(info.scientificName) + " " + String(desc)).toLowerCase();

                        // 키워드 매칭
                        const dryKeys = ['cactus', 'succulent', 'sansevieria', 'aloe', '선인장', '다육', '스투키', '산세베리아'];
                        if (dryKeys.some(k => text.includes(k))) return { freq: 'MONTHLY', label: '매달 (건조형 식물)' };

                        const wetKeys = ['fern', 'basil', 'mint', '고사리', '아디안텀', '바질', '민트', '율마'];
                        if (wetKeys.some(k => text.includes(k))) return { freq: 'DAILY', label: '매일 (습윤형 식물)' };

                        return { freq: 'WEEKLY', label: '매주 (일반 관엽식물)' };
                    };

                    const recommendation = getRec(savedPlantInfo); // { freq: 'WEEKLY', label: '매주...' }
                    // --- [추천 로직 끝] ---

                    // 3) 모달 UI에 "추천 체크박스" 주입
                    const freqSelect = document.getElementById('modalFreq');
                    const freqContainer = freqSelect.parentElement; // .form-group

                    // 기존에 추가된 배지가 있다면 제거 (중복 방지)
                    const existingBadge = freqContainer.querySelector('.recommendation-badge');
                    if(existingBadge) existingBadge.remove();

                    // 추천 배지 HTML 생성
                    const badgeHTML = `
                        <div class="recommendation-badge" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #15803d; font-weight: 600; font-size: 0.9rem;">
                                <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
                                <span>AI 추천 물주기</span>
                            </div>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #374151; font-size: 0.95rem;">
                                <input type="checkbox" id="useRecCheck" checked style="width: 16px; height: 16px; accent-color: #16a34a;">
                                <span><strong>${recommendation.label}</strong>로 설정하기</span>
                            </label>
                        </div>
                    `;
                    
                    // Select 박스 위에 삽입
                    freqContainer.insertAdjacentHTML('afterbegin', badgeHTML);
                    if(typeof lucide !== 'undefined') lucide.createIcons(); // 아이콘 새로고침

                    // 체크박스 동작 로직
                    const useRecCheck = document.getElementById('useRecCheck');
                    
                    // 함수: 체크 상태에 따라 select 박스 제어
                    const toggleSelect = () => {
                        if (useRecCheck.checked) {
                            freqSelect.value = recommendation.freq; // 추천값 적용
                            freqSelect.style.backgroundColor = '#f3f4f6'; // 비활성 느낌 배경
                            freqSelect.style.pointerEvents = 'none'; // 클릭 방지
                        } else {
                            freqSelect.style.backgroundColor = ''; // 원래대로
                            freqSelect.style.pointerEvents = 'auto'; // 클릭 가능
                        }
                    };

                    // 초기 실행 및 이벤트 연결
                    toggleSelect();
                    useRecCheck.addEventListener('change', toggleSelect);

                    // 모달 표시
                    scheduleModal.classList.add('show');

                } else {
                    alert(`${newPlant.nickname} 등록 완료!`);
                    window.location.href = '/app/main/main.html';
                }

            } catch (error) {
                console.error('등록 실패:', error);
                alert('등록 중 오류가 발생했습니다: ' + error.message);
                registerBtn.textContent = '이 식물 등록하기';
                registerBtn.disabled = false;
            }
        });

        // 3. [모달] 일정 저장 버튼
        if(saveScheduleBtn) {
            saveScheduleBtn.addEventListener('click', async () => {
                if (!registeredPlantId) return;

                const date = modalDate.value;
                if (!date) { alert('날짜를 선택하세요'); return; }

                // 반복 주기 값 가져오기 (체크박스 로직이 이미 select 값을 바꿨으므로 select 값만 보면 됨)
                const freqVal = modalFreq.value;
                let frequencyDays = null;
                
                if (freqVal === 'DAILY') frequencyDays = 1;
                else if (freqVal === 'WEEKLY') frequencyDays = 7;
                else if (freqVal === 'MONTHLY') frequencyDays = 30;

                const scheduleData = {
                    "next_due_date": date,
                    "plant_id": Number(registeredPlantId),
                    "schedule_type": modalType.value,
                    "frequency_days": frequencyDays
                };

                try {
                    saveScheduleBtn.textContent = '저장 중...';
                    await addSchedule(scheduleData);
                    alert('식물과 물주기 일정이 등록되었습니다! 🌱');
                    window.location.href = '/app/main/main.html';
                } catch (error) {
                    console.error('일정 등록 실패', error);
                    alert('식물은 등록되었으나, 일정 생성에 실패했습니다.');
                    window.location.href = '/app/main/main.html';
                }
            });
        }

        // 4. [모달] 나중에 하기 버튼
        if(skipScheduleBtn) {
            skipScheduleBtn.addEventListener('click', () => {
                alert('식물 등록이 완료되었습니다.');
                window.location.href = '/app/main/main.html';
            });
        }
    }
});