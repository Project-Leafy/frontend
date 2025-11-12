// [수정됨] 1. registerMyPlant 함수 임포트 추가
import { identifyPlant, registerMyPlant } from "../plant/plant_api.js";

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
        console.log('DOM 요소 확인:');
        console.log('- plantPreview:', plantPreview);
        console.log('- commonNameEl:', commonNameEl);
        console.log('- scientificNameEl:', scientificNameEl);
        
        // 1. sessionStorage에서 1단계 응답 데이터 읽기
        const resultString = sessionStorage.getItem('identificationResult');
        console.log('sessionStorage 원본 문자열:', resultString);
        
        let identificationResult = null;
        
        if (resultString) {
            try {
                identificationResult = JSON.parse(resultString);
                console.log('파싱된 데이터:', identificationResult);
                
                // ⭐️ API 응답은 snake_case로 반환됨
                let imageUrl = identificationResult.image_url;
                let commonName = identificationResult.common_name;
                let scientificName = identificationResult.scientific_name;
                let speciesId = identificationResult.species_id;
                let probability = identificationResult.probability; // probability 추가

                // data 객체 안에 있는 경우도 체크
                if (!imageUrl && identificationResult.data) {
                    console.log('data 객체에서 추출 시도:', identificationResult.data);
                    imageUrl = identificationResult.data.image_url;
                    commonName = identificationResult.data.common_name;
                    scientificName = identificationResult.data.scientific_name;
                    speciesId = identificationResult.data.species_id;
                    probability = identificationResult.data.probability; // probability 추가
                }

                console.log('=== 최종 추출된 값 ===');
                console.log('imageUrl:', imageUrl);
                console.log('commonName:', commonName);
                console.log('scientificName:', scientificName);
                console.log('speciesId:', speciesId);
                console.log('probability:', probability); // probability 로그 추가
                console.log('=====================');

                // 1) 이미지 URL 할당
                if (plantPreview) {
                    const finalImageUrl = imageUrl || 'https://placehold.co/300x300/eee/ccc?text=No+Image';
                    plantPreview.src = finalImageUrl;
                    console.log('이미지 설정됨:', finalImageUrl);
                }

                // 2) 이름 할당
                if (commonNameEl) {
                    const finalCommonName = commonName || '이름 없음';
                    commonNameEl.textContent = finalCommonName;
                    console.log('일반명 설정됨:', finalCommonName);
                }
                if (scientificNameEl) {
                    const finalScientificName = scientificName || '학명 정보 없음';
                    scientificNameEl.textContent = finalScientificName;
                    console.log('학명 설정됨:', finalScientificName);
                }

                // 3) 신뢰도 할당
                if (probability) {
                    if (progressTextEl) progressTextEl.textContent = `${probability}%`;
                    if (progressBarFgEl) progressBarFgEl.style.width = `${probability}%`;
                } else {
                    if (progressTextEl) progressTextEl.textContent = '알수없음';
                    if (progressBarFgEl) progressBarFgEl.style.width = '0%';
                }
                
                // identificationResult 재구성 (등록 시 사용)
                identificationResult = {
                    imageUrl,
                    commonName,
                    scientificName,
                    speciesId,
                    probability: probability || null // probability가 없으면 null로 저장
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

        // --- [추가됨] 3단계 (최종 등록) 로직 ---
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

            const plantData = {
                species_id: identificationResult.speciesId,
                nickname: nickname,
                adoption_date: adoptionDate,
                image_url: identificationResult.imageUrl
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
    }
});