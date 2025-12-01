// uploadImageFile을 중괄호 안에 꼭 추가해야 해
import { createGrowthRecord, uploadImageFile } from './myplant_journal_api.js';
// === 상태 관리 변수 ===
const state = {
    images: [], // { file: File객체, url: 'blob:...' } 형태로 저장
    memo: '',
    selectedTags: []
};

// 태그 목록
const AVAILABLE_TAGS = ['새순', '물주기', '분갈이', '가지치기', '성장', '개화', '건강', '비료'];

// URL 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
const plantId = urlParams.get('plantId');
const plantNickname = urlParams.get('nickname') || '나의 반려식물';

// === 초기화 ===
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    document.getElementById('plantNicknameDisplay').textContent = plantNickname;
    renderTags();
    
    // 이벤트 리스너 등록
    document.getElementById('backBtn').addEventListener('click', handleBack);
    document.getElementById('saveBtn').addEventListener('click', handleSave);
    document.getElementById('memoInput').addEventListener('input', handleMemoInput);
    
    // [수정됨] 이미지 추가 버튼 -> 파일 선택창 열기
    document.getElementById('addImageBtn').addEventListener('click', handleAddImageClick);
    // [추가됨] 파일이 선택되었을 때 처리
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
});

// === 기능 함수들 ===

// 1. 태그 렌더링 (기존 동일)
function renderTags() {
    const container = document.getElementById('tagContainer');
    container.innerHTML = '';

    AVAILABLE_TAGS.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = `tag-btn ${state.selectedTags.includes(tag) ? 'active' : ''}`;
        btn.textContent = `#${tag}`;
        btn.onclick = () => toggleTag(tag);
        container.appendChild(btn);
    });
}

function toggleTag(tag) {
    if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter(t => t !== tag);
    } else {
        state.selectedTags.push(tag);
    }
    renderTags();
}

// 2. [수정됨] 이미지 처리 로직

// (1) 추가 버튼 클릭 시 숨겨진 input 클릭
function handleAddImageClick() {
    if (state.images.length >= 3) {
        alert('사진은 최대 3장까지만 추가할 수 있습니다.');
        return;
    }
    // 숨겨진 파일 인풋 클릭 트리거
    document.getElementById('fileInput').click();
}

// (2) 파일 선택 시 미리보기 생성 및 상태 저장
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 브라우저 보안상 로컬 파일 경로를 바로 쓸 수 없으므로, 임시 URL 생성
    const previewUrl = URL.createObjectURL(file);

    // 상태에 파일 객체와 미리보기 URL 저장
    state.images.push({
        file: file,      // 실제 전송용 파일 객체
        url: previewUrl  // 화면 표시용 URL
    });

    renderImages();

    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    event.target.value = '';
}


function removeImage(index) {
    // 메모리 누수 방지를 위해 URL 해제
    URL.revokeObjectURL(state.images[index].url);
    state.images.splice(index, 1);
    renderImages();
}

function renderImages() {
    const grid = document.getElementById('imageGrid');
    const addBtn = document.getElementById('addImageBtn');
    
    // 1. 추가 버튼을 잠시 그리드에서 떼어냅니다 (안전하게 보관)
    if (addBtn && addBtn.parentNode === grid) {
        grid.removeChild(addBtn);
    }
    
    // 2. 그리드 내부를 깨끗하게 비웁니다 (기존 이미지 제거)
    grid.innerHTML = '';
    
    // 3. 상태(state)에 있는 이미지들을 하나씩 만들어서 넣습니다
    state.images.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'photo-item'; // CSS 클래스 (.photo-item) 적용
        div.innerHTML = `
            <img src="${item.url}" alt="식물 사진">
            <button class="delete-photo-btn" type="button">
                <i data-lucide="x" width="14" height="14"></i>
            </button>
        `;
        
        // 삭제 버튼 이벤트
        div.querySelector('.delete-photo-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            removeImage(index);
        });
        
        grid.appendChild(div); // 이미지 추가
    });

    // 4. 마지막에 추가 버튼을 다시 맨 뒤에 붙여줍니다
    if (addBtn) {
        grid.appendChild(addBtn);
        // 사진이 3장 미만일 때만 버튼 보이기
        addBtn.style.display = state.images.length >= 3 ? 'none' : 'flex';
    }
    
    // 아이콘 다시 그리기
    lucide.createIcons();
}

// 3. 메모 입력 처리 (기존 동일)
function handleMemoInput(e) {
    const value = e.target.value;
    const errorMsg = document.getElementById('memoError');
    const input = e.target;
    state.memo = value;
    if (value.trim()) {
        errorMsg.style.display = 'none';
        input.style.borderColor = '#4A7C59';
    }
}

// 4. 뒤로가기 (기존 동일)
function handleBack() {
    const hasChanges = state.memo.trim() !== '' || state.images.length > 0 || state.selectedTags.length > 0;
    if (hasChanges) {
        if(confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
            history.back();
        }
    } else {
        history.back();
    }
}

// 5. 저장하기
async function handleSave() {
    const memoInput = document.getElementById('memoInput');
    const memoValue = memoInput.value.trim();
    const errorMsg = document.getElementById('memoError');

    if (!memoValue) {
        memoInput.style.borderColor = '#EF4444';
        errorMsg.style.display = 'block';
        return;
    }

    // ⚠️ [중요] 백엔드 연동 시 주의사항
    // 현재 백엔드(CreateGrowthRecordRequest)는 String photoUrl을 받습니다.
    // 하지만 파일 업로드는 보통 별도의 API(S3 등)를 통해 이미지를 올리고 URL을 받아오는 과정이 필요합니다.
    // 여기서는 일단 '파일 업로드가 구현되지 않았음'을 가정하고 null을 보내거나, 
    // 추후 구현해야 할 로직을 주석으로 남겨둡니다.

    try {
        let finalImageUrl = null;

        if (state.images.length > 0) {
            const imageFile = state.images[0].file;
            console.log("S3 업로드 시작...");
            
            // 2. API 파일에서 가져온 uploadImageFile 함수 사용 (정상)
            finalImageUrl = await uploadImageFile(imageFile);
            
            console.log("S3 업로드 완료. URL:", finalImageUrl);
        }

        
        // 2. 받은 URL을 포함하여 데이터 구성
        const requestData = {
            record_date: new Date().toISOString().split('T')[0],
            
            // 여기에 '가짜 주소' 대신 '서버에서 받은 S3 주소'를 넣음
            photo_url: finalImageUrl, 

            memo: memoValue,
            watered: state.selectedTags.includes('물주기'),
            repotted: state.selectedTags.includes('분갈이'),
            pruned: state.selectedTags.includes('가지치기'),
            fertilized: state.selectedTags.includes('비료'),
            water_amount_type: null,
            fertilizer_type: null
        };

        // 3. 최종 데이터 저장 (기존 백엔드 로직 사용)
        if (!plantId) throw new Error("URL에 식물 ID(plantId)가 없습니다.");
        
        await createGrowthRecord(plantId, requestData);
        
        alert('성장 기록이 저장되었습니다!');
        history.back();

    } catch (error) {
        console.error(error);
        alert('저장 중 오류가 발생했습니다: ' + error.message);
    }
}


