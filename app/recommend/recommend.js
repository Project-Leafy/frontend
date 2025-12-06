document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const submitBtn = document.getElementById('submitBtn');
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    // 1. 모든 항목이 선택되었는지 확인하는 함수
    function checkCompletion() {
        const sunlight = document.querySelector('input[name="sunlight"]:checked');
        const watering = document.querySelector('input[name="watering"]:checked');
        const experience = document.querySelector('input[name="experience"]:checked');
        const size = document.querySelector('input[name="size"]:checked');
        const pet = document.querySelector('input[name="pet"]:checked');

        // 5가지 항목이 모두 선택되어야 버튼 활성화
        if (sunlight && watering && experience && size && pet) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // 라디오 버튼 변경 감지
    radioButtons.forEach(radio => {
        radio.addEventListener('change', checkCompletion);
    });

    // 2. 추천 받기 버튼 클릭 (API 호출)
    submitBtn.addEventListener('click', async () => {
        // 선택된 값 가져오기
        const sunlightVal = document.querySelector('input[name="sunlight"]:checked').value;
        const wateringVal = document.querySelector('input[name="watering"]:checked').value;
        const experienceVal = document.querySelector('input[name="experience"]:checked').value;
        const sizeVal = document.querySelector('input[name="size"]:checked').value;
        const petVal = document.querySelector('input[name="pet"]:checked').value;

        // 백엔드 DTO(RecommendationRequest)에 맞춘 데이터 구조
        const requestData = {
            preferredLight: sunlightVal,   // LOW, MEDIUM, HIGH
            preferredWater: wateringVal,   // FREQUENT, NORMAL, RARE
            userSkill: experienceVal,      // EASY, NORMAL, HARD
            preferredSize: sizeVal,        // SMALL, MEDIUM, LARGE
            hasPet: (petVal === 'true')    // boolean 변환
        };

        // 로딩 표시 (UX 개선)
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '분석 중... <div class="loader"></div>'; 
        submitBtn.disabled = true;

        try {
            // JWT 토큰 가져오기 (로그인 시 저장했다고 가정)
            const token = localStorage.getItem('accessToken'); 
            
            if (!token) {
                alert("로그인이 필요합니다.");
                window.location.href = '/login.html'; // 로그인 페이지로 이동
                return;
            }

            // API 호출
            const response = await fetch('/api/v1/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 인증 헤더
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const recommendations = await response.json();
                
                // 결과 데이터를 로컬 스토리지에 임시 저장 (결과 페이지에서 보여주기 위해)
                localStorage.setItem('recommendationResults', JSON.stringify(recommendations));
                
                // 결과 페이지로 이동
                window.location.href = '/app/recommend/result.html'; 
            } else {
                const errorData = await response.json();
                alert(`추천 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
            }

        } catch (error) {
            console.error('API Error:', error);
            alert('서버 통신 중 오류가 발생했습니다.');
        } finally {
            // 버튼 상태 원복
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});