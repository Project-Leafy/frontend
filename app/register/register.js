// register.js

import { identifyPlant, registerMyPlant } from "../plant/plant_api.js";
import { addSchedule } from "../calendar/schedule_api.js";

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
        const plantImageInput = document.getElementById('plant-image'); // 앨범용
        const cameraInput = document.getElementById('camera-input');    // 카메라용
        
        const buttonGroup = document.querySelector('.button-group');
        const takePhotoBtn = document.getElementById('take-photo-btn');
        const iconImage = document.querySelector('.icon-circle img');

        // [수정] 카메라 버튼 클릭 핸들러 강화
        if (takePhotoBtn) {
            takePhotoBtn.addEventListener('click', (e) => {
                e.preventDefault(); // 기본 동작 차단
                if (cameraInput) {
                    console.log('📸 카메라 실행 요청');
                    cameraInput.click(); // 강제 클릭 트리거
                } else {
                    alert('카메라 입력 태그(id="camera-input")를 찾을 수 없습니다.');
                }
            });
        }

        // 앨범 버튼 클릭 핸들러
        if (albumBtn) {
            albumBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (plantImageInput) plantImageInput.click();
            });
        }

        // 파일 선택 시 처리 (공통 함수)
        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log('📂 파일 선택됨:', file.name);
                
                // ★ 충돌 방지: 한쪽이 선택되면 다른 쪽 비우기
                if (event.target === cameraInput && plantImageInput) plantImageInput.value = '';
                if (event.target === plantImageInput && cameraInput) cameraInput.value = '';

                // UI 변경
                if (buttonGroup) buttonGroup.style.display = 'none';
                if (takePhotoBtn) takePhotoBtn.style.display = 'none'; // 혹시 별도로 있다면
                identifyBtn.style.display = 'block';

                // 미리보기 이미지 변경
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

        // 이벤트 리스너 연결
        if (plantImageInput) plantImageInput.addEventListener('change', handleFileSelect);
        if (cameraInput) cameraInput.addEventListener('change', handleFileSelect);

        // 식별하기 버튼 클릭
        identifyBtn.addEventListener('click', async () => {
            // 카메라 또는 앨범 중 값이 있는 파일 선택
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
                        console.log('✅ 식별 성공:', result);

                        sessionStorage.setItem('identificationResult', JSON.stringify(result));
                        window.location.href = '../register2/register2.html';
                    } catch (error) {
                        console.error('식별 실패:', error);
                        alert('식물 식별에 실패했습니다.');
                        identifyBtn.disabled = false; identifyBtn.textContent = '식별하기';
                    }
                },
                (error) => {
                    console.error('위치 오류:', error);
                    alert('위치 정보를 가져올 수 없습니다.');
                    identifyBtn.disabled = false; identifyBtn.textContent = '식별하기';
                }
            );
        });
    }

    // ========================================================
    // 2단계 & 3단계: 등록 및 AI 스케줄 추천 (register2.html)
    // ========================================================
    const registerBtn = document.getElementById('register-btn');

    if (registerBtn) {
        // UI 요소 가져오기
        const plantImageEl = document.getElementById('plant-preview');
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

        // 1. 데이터 로드 및 표시
        const resultString = sessionStorage.getItem('identificationResult');
        let identificationResult = null;

        if (resultString) {
            try {
                const parsedData = JSON.parse(resultString);
                
                // 데이터 정제
                let imageUrl = parsedData.imageUrl || parsedData.image_url;
                let commonName = parsedData.commonName || parsedData.common_name;
                let scientificName = parsedData.scientificName || parsedData.scientific_name;
                let speciesId = parsedData.speciesId || parsedData.species_id;
                
                let candidates = parsedData.identificationData || 
                                 parsedData.identification_candidates || 
                                 parsedData.suggestions || [];

                // 화면 렌더링
                if (plantImageEl) plantImageEl.src = imageUrl || 'https://placehold.co/300x300';
                if (commonNameEl) commonNameEl.textContent = commonName || '이름 없음';
                if (scientificNameEl) scientificNameEl.textContent = scientificName || '학명 정보 없음';

                identificationResult = {
                    imageUrl, commonName, scientificName, speciesId,
                    identificationData: candidates
                };
            } catch (e) {
                console.error('데이터 파싱 오류', e);
            }
        } else {
            // register2 페이지인데 데이터가 없으면 1단계로 보냄
            if (window.location.pathname.includes('register2')) {
                alert('식물 정보가 없습니다. 다시 촬영해주세요.');
                window.location.href = '../register1/register1.html';
                return;
            }
        }

        // 2. [등록하기] 버튼 클릭 -> 추천 로직 실행
        registerBtn.addEventListener('click', async () => {
            const nickname = nicknameInput.value.trim();
            const adoptionDate = adoptionDateInput.value;

            if (!adoptionDate) { alert('입양일을 선택해주세요.'); return; }
            if (!identificationResult?.speciesId) { alert('식물 종 정보가 없습니다.'); return; }

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
                // API 호출
                const newPlant = await registerMyPlant(plantData);
                console.log('✅ 식물 등록 성공:', newPlant);
                registeredPlantId = newPlant.my_plant_id || newPlant.id;

                // 데이터 백업 후 삭제
                const savedPlantInfo = { ...identificationResult };
                sessionStorage.removeItem('identificationResult');

                // ★★★ [AI 추천 및 모달 표시 로직] ★★★
                if (scheduleModal) {
                    // 기본 날짜: 오늘
                    if (modalDate) modalDate.value = new Date().toISOString().split('T')[0];

                    // 1) 추천 값 계산 함수
                    const getRec = (info) => {
                        const candidates = info.identificationData || [];
                        let desc = "";
                        if (candidates.length > 0) {
                            desc = candidates[0].description || candidates[0].wiki_description || "";
                        }
                        const text = (String(info.commonName) + " " + String(info.scientificName) + " " + String(desc)).toLowerCase();

                        const dryKeys = ['cactus', 'succulent', 'sansevieria', 'aloe', '선인장', '다육', '스투키', '산세베리아'];
                        if (dryKeys.some(k => text.includes(k))) return { freq: 'MONTHLY', label: '매달 (건조형 식물)' };

                        const wetKeys = ['fern', 'basil', 'mint', '고사리', '아디안텀', '바질', '민트'];
                        if (wetKeys.some(k => text.includes(k))) return { freq: 'DAILY', label: '매일 (습윤형 식물)' };

                        return { freq: 'WEEKLY', label: '매주 (일반 식물)' };
                    };

                    const recommendation = getRec(savedPlantInfo);
                    console.log('🤖 AI 추천 결과:', recommendation);

                    // 2) UI 강제 주입 (Select 박스 바로 위에 삽입)
                    const freqSelect = document.getElementById('modalFreq');
                    
                    if (freqSelect) {
                        // 기존 배지 제거 (중복 방지)
                        const oldBadge = scheduleModal.querySelector('.recommendation-badge-container');
                        if (oldBadge) oldBadge.remove();

                        // 새 배지 생성
                        const badgeDiv = document.createElement('div');
                        badgeDiv.className = 'recommendation-badge-container';
                        badgeDiv.innerHTML = `
                            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
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

                        // Select 박스의 부모 요소에 삽입 (Select 박스 바로 앞)
                        freqSelect.parentNode.insertBefore(badgeDiv, freqSelect);
                        
                        // 아이콘 새로고침
                        if (typeof lucide !== 'undefined') lucide.createIcons();

                        // 3) 체크박스 동작 연결
                        const useRecCheck = document.getElementById('useRecCheck');
                        const toggleSelect = () => {
                            if (useRecCheck && useRecCheck.checked) {
                                freqSelect.value = recommendation.freq;
                                freqSelect.style.backgroundColor = '#f3f4f6';
                                freqSelect.style.pointerEvents = 'none'; // 수정 불가하게 만듦
                            } else {
                                freqSelect.style.backgroundColor = '';
                                freqSelect.style.pointerEvents = 'auto'; // 수정 가능
                            }
                        };
                        
                        if (useRecCheck) {
                            useRecCheck.addEventListener('change', toggleSelect);
                            toggleSelect(); // 초기 상태 적용
                        }
                    }

                    // 모달 표시
                    scheduleModal.classList.add('show');

                } else {
                    // 모달이 없으면 그냥 완료 알림
                    alert(`${nickname} 등록 완료!`);
                    window.location.href = '/app/main/main.html';
                }

            } catch (error) {
                console.error('등록 프로세스 에러:', error);
                alert('등록 중 오류가 발생했습니다: ' + error.message);
                registerBtn.disabled = false;
                registerBtn.textContent = '이 식물 등록하기';
            }
        });

        // 모달: 일정 저장 버튼
        if (saveScheduleBtn) {
            saveScheduleBtn.addEventListener('click', async () => {
                if (!registeredPlantId) return;
                
                const date = modalDate.value;
                if (!date) { alert('날짜를 선택하세요'); return; }

                // 반복 주기 값 계산
                let freqDays = null;
                const val = modalFreq.value;
                if (val === 'DAILY') freqDays = 1;
                else if (val === 'WEEKLY') freqDays = 7;
                else if (val === 'MONTHLY') freqDays = 30;

                const scheduleData = {
                    "next_due_date": date,
                    "plant_id": Number(registeredPlantId),
                    "schedule_type": modalType.value,
                    "frequency_days": freqDays
                };

                try {
                    saveScheduleBtn.textContent = '저장 중...';
                    await addSchedule(scheduleData);
                    alert('일정이 등록되었습니다! 🌱');
                    window.location.href = '/app/main/main.html';
                } catch (error) {
                    console.error('일정 등록 실패', error);
                    alert('식물은 등록되었으나, 일정 생성에 실패했습니다.');
                    window.location.href = '/app/main/main.html';
                }
            });
        }

        // 모달: 나중에 하기 버튼
        if (skipScheduleBtn) {
            skipScheduleBtn.addEventListener('click', () => {
                alert('식물 등록이 완료되었습니다.');
                window.location.href = '/app/main/main.html';
            });
        }
    }
});