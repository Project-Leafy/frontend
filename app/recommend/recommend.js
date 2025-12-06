document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const submitBtn = document.getElementById('submitBtn');

    // 1. 추천 받기 버튼 클릭 시 유효성 검사 및 API 호출
    submitBtn.addEventListener('click', async () => {
        // 이전에 추가된 warning 클래스 모두 제거
        document.querySelectorAll('.block.warning').forEach(block => {
            block.classList.remove('warning');
        });

        // 각 질문 그룹의 선택 여부와 DOM 요소를 매핑
        const questions = [
            { name: 'sunlight', element: document.querySelector('input[name="sunlight"]'), title: '햇빛 환경' },
            { name: 'watering', element: document.querySelector('input[name="watering"]'), title: '물주기 선호도' },
            { name: 'experience', element: document.querySelector('input[name="experience"]'), title: '식물 키우기 경험' },
            { name: 'size', element: document.querySelector('input[name="size"]'), title: '선호하는 크기' },
            { name: 'pet', element: document.querySelector('input[name="pet"]'), title: '반려동물 여부' }
        ];

        const unanswered = [];
        let isComplete = true;

        // 모든 질문 그룹을 순회하며 답변 여부 확인
        questions.forEach(q => {
            const selected = document.querySelector(`input[name="${q.name}"]:checked`);
            if (!selected) {
                isComplete = false;
                unanswered.push(q.title);
                // 답변 안 된 질문 블록에 warning 클래스 추가
                q.element.closest('.block').classList.add('warning');
            }
        });

        // 모든 질문에 답하지 않았을 경우
        if (!isComplete) {
            const warningMsg = `🍃 모든 선택지를 선택해주세요.\n\n[선택하지 않은 항목]\n- ${unanswered.join('\n- ')}`;
            alert(warningMsg);
            return; // API 호출 중단
        }

        // --- 모든 질문에 답했을 경우, 기존 API 호출 로직 실행 ---

        // 선택된 값 가져오기
        const requestData = {
            preferredLight: document.querySelector('input[name="sunlight"]:checked').value,
            preferredWater: document.querySelector('input[name="watering"]:checked').value,
            userSkill: document.querySelector('input[name="experience"]:checked').value,
            preferredSize: document.querySelector('input[name="size"]:checked').value,
            hasPet: (document.querySelector('input[name="pet"]:checked').value === 'true')
        };

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '분석 중... <div class="loader"></div>';
        submitBtn.disabled = true;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("로그인이 필요합니다.");
                window.location.href = '/index.html'; // 로그인 페이지로 이동
                return;
            }

            const response = await fetch('/api/v1/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const recommendations = await response.json();
                localStorage.setItem('recommendationResults', JSON.stringify(recommendations));
                window.location.href = '/app/recommend/recommend_result.html';
            } else {
                const errorData = await response.json();
                alert(`추천 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
            }

        } catch (error) {
            console.error('API Error:', error);
            alert('서버 통신 중 오류가 발생했습니다.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // 2. 헤더 버튼 이벤트 리스너
    document.getElementById('notifications-btn').addEventListener('click', () => {
        window.location.href = '/app/alarm/alarm.html';
    });

    document.getElementById('profile-btn').addEventListener('click', () => {
        window.location.href = '/app/profile/profile.html';
    });

    // 3. 하단 네비게이션 활성화 로직
    function setActiveNavItem() {
        const navItems = document.querySelectorAll('#bottom-nav .nav-item');
        const currentPath = window.location.pathname;

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }

    setActiveNavItem();
});