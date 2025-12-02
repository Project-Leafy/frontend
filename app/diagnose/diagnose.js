// 1. 경로에 맞춰 Import (plant_api.js 대신 core_api.js 등 토큰 포함 fetch가 있는 곳)
// 만약 myplant_detail.js와 같은 방식이라면 아래 경로를 쓰세요.
import { fetchApi } from '../../assets/js/core_api.js'; 
// 또는 plant_api.js에 진단 함수가 있다면 그것을 import 하세요.

document.addEventListener('DOMContentLoaded', async () => {
    
    // --- DOM 요소 ---
    const imageInput = document.getElementById('diagnosis-image');
    const imagePreview = document.getElementById('image-preview');
    const imageUploadWrapper = document.querySelector('.image-upload-wrapper');
    const myPlantSelect = document.getElementById('my-plant-select');
    const startBtn = document.getElementById('start-diagnosis-btn');
    const retryBtn = document.getElementById('retry-btn');

    const formSection = document.getElementById('diagnosis-form-section');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultContainer = document.getElementById('diagnosis-result-container');

    let selectedFile = null;

    // 1. 내 식물 목록 불러오기 (선택사항)
    try {
        // API 경로는 프로젝트에 맞게 확인하세요 (/api/v1/my-plants)
        const response = await fetchApi('/api/v1/my-plants', { method: 'GET' });
        if (response.ok) {
            const plants = await response.json();
            // 백엔드: snake_case 일 수 있음. console.log(plants)로 확인 필요
            plants.forEach(plant => {
                const option = document.createElement('option');
                // plant.my_plant_id 또는 plant.myPlantId (목록 API 설정에 따름)
                option.value = plant.my_plant_id || plant.myPlantId; 
                option.textContent = plant.nickname;
                myPlantSelect.appendChild(option);
            });
        }
    } catch (e) {
        console.warn("식물 목록 로드 실패 (무시 가능):", e);
    }

    // 2. 이미지 미리보기 기능
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (ev) => {
                imagePreview.src = ev.target.result;
                imageUploadWrapper.classList.add('has-image');
                startBtn.disabled = false; // 버튼 활성화
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. 진단 시작
    startBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        // UI 전환: 폼 숨기기 -> 로딩 보이기
        formSection.style.display = 'none';
        loadingSpinner.style.display = 'flex'; // css에서 flex로 정의하면 클래스 토글로 변경 가능

        // FormData 생성
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        // 내 식물 ID가 선택되었다면 추가
        if (myPlantSelect.value) {
            formData.append('myPlantId', myPlantSelect.value);
        } else {
            // 필수 파라미터라면 0 또는 더미 ID를 보내야 할 수도 있음
            // 현재 백엔드 Controller는 @RequestParam Long myPlantId가 필수라면
            // 프론트에서 처리가 필요함 (선택안함일 경우 로직 확인 필요)
            // 만약 필수라면: alert('식물을 선택해주세요'); return;
            formData.append('myPlantId', myPlantSelect.value || 0); 
        }

        try {
            // 토큰 가져오기
            const token = localStorage.getItem('accessToken');

            // 파일 업로드는 fetchApi 래퍼 대신 직접 fetch를 쓰는게 헤더 처리(Content-Type)에서 안전할 수 있음
            const response = await fetch('http://localhost:8080/api/v1/diagnosis', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type은 설정하지 않음 (브라우저가 boundary 설정)
                },
                body: formData
            });

            if (!response.ok) throw new Error('진단 실패');

            const data = await response.json();
            showResult(data);

        } catch (error) {
            console.error(error);
            alert("진단 중 오류가 발생했습니다.");
            resetView();
        }
    });

    // 4. 결과 보여주기 (Snake Case 대응!)
    function showResult(data) {
        loadingSpinner.style.display = 'none';
        resultContainer.style.display = 'block';

        const healthCard = document.getElementById('health-card');
        const statusIcon = document.getElementById('status-icon');
        const healthTitle = document.getElementById('health-title');
        const healthProb = document.getElementById('health-probability');
        const diseaseSection = document.getElementById('disease-detail-section');

        // 데이터 바인딩 (snake_case)
        // data.is_healthy, data.disease_name, data.description ...

        if (data.is_healthy) {
            // 건강함
            healthCard.className = 'result-card healthy-state';
            statusIcon.setAttribute('data-lucide', 'smile'); // 아이콘 변경
            healthTitle.textContent = "식물이 건강합니다! 🌿";
            healthProb.textContent = "안심하셔도 좋아요.";
            diseaseSection.style.display = 'none';
        } else {
            // 아픔
            healthCard.className = 'result-card sick-state';
            statusIcon.setAttribute('data-lucide', 'frown');
            healthTitle.textContent = "치료가 필요해요 🤒";
            healthProb.textContent = `질병 확률: ${(data.probability * 100).toFixed(1)}%`;
            
            diseaseSection.style.display = 'block';
            
            // 병명 & 설명
            document.getElementById('disease-name').textContent = data.disease_name || "알 수 없는 질병";
            document.getElementById('disease-description').textContent = data.description || "상세 설명이 없습니다.";

            // 치료법 (JSON 파싱)
            // solution_detail 또는 treatment 필드로 올 것임 (백엔드 DTO 확인)
            // 여기서는 solution_detail 이라고 가정 (DTO 필드명 확인!)
            const solutionJson = data.solution_detail || data.treatment; 
            renderSolution(solutionJson);
        }
        
        lucide.createIcons(); // 아이콘 갱신
    }

    // 치료법 렌더링 함수
    function renderSolution(jsonString) {
        const container = document.getElementById('solution-content');
        container.innerHTML = '';

        if (!jsonString) {
            container.textContent = "치료법 정보가 없습니다.";
            return;
        }

        try {
            const treatment = JSON.parse(jsonString);
            // treatment = { prevention: [], biological: [], chemical: [] }

            let html = '';
            
            if (treatment.prevention && treatment.prevention.length > 0) {
                html += `<span class="solution-category">🛡️ 예방</span><ul>`;
                treatment.prevention.forEach(t => html += `<li>${t}</li>`);
                html += `</ul>`;
            }
            if (treatment.biological && treatment.biological.length > 0) {
                html += `<span class="solution-category">🐞 생물학적 방제</span><ul>`;
                treatment.biological.forEach(t => html += `<li>${t}</li>`);
                html += `</ul>`;
            }
            if (treatment.chemical && treatment.chemical.length > 0) {
                html += `<span class="solution-category">🧪 화학적 방제</span><ul>`;
                treatment.chemical.forEach(t => html += `<li>${t}</li>`);
                html += `</ul>`;
            }

            container.innerHTML = html;

        } catch (e) {
            console.error("JSON 파싱 에러", e);
            container.textContent = jsonString; // 파싱 실패 시 그냥 텍스트로 출력
        }
    }

    // 초기화 버튼
    retryBtn.addEventListener('click', resetView);

    function resetView() {
        resultContainer.style.display = 'none';
        formSection.style.display = 'block';
        loadingSpinner.style.display = 'none';
        
        imageInput.value = '';
        selectedFile = null;
        imageUploadWrapper.classList.remove('has-image');
        document.getElementById('image-preview').src = "../../assets/images/placeholder_plant.png"; // 경로 확인
        startBtn.disabled = true;
        myPlantSelect.value = "";
    }
});