# frontend
# 🌿 Leafy - Frontend (HTML/CSS/JS)

> 반려식물 성장 관리 및 AI 진단/추천 서비스 'Leafy'의 프론트엔드 레пози토리입니다. (Vanilla JS)

## 1. 📜 프로젝트 개요

'Leafy'는 식물 입문자들이 겪는 식별의 어려움과 관리의 막막함을 IT 기술로 해결하는 모바일 앱입니다. 사용자는 사진 한 장으로 식물을 식별하고, AI 진단을 받으며, 개인화된 성장 일지를 작성하고, 스마트한 관리 알림을 받을 수 있습니다.

---

## 2. 💻 기술 스택 (Tech Stack)

| 구분 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Language** | HTML5, CSS3, JavaScript (ES6+) | |
| **Data Fetching**| Native `fetch()` API | |
| **Styling** | Plain CSS3 | |

---

## 3. 🚀 시작하기 (Getting Started)

### 1. 레포지토리 클론
```bash
git clone [YOUR_REPO_URL]
cd frontend-repo
```

팀원 최소 1명 이상의 **Approve(승인)**를 받아야만 develop 브랜치로 병합(Merge)할 수 있습니다.

PR을 올릴 때는 어떤 기능을 구현했는지, 어떻게 테스트했는지 상세히 작성합니다.

### 2. (필수) API 환경 변수 설정
프레임워크가 없으므로, API 서버 주소를 JavaScript 파일로 직접 관리합니다.

js/ 폴더 안에 api-config.js 파일을 새로 생성합니다.

이 파일은 Git에 올라가지 않도록 .gitignore 파일에 다음 한 줄을 추가합니다.

/js/api-config.js

api-config.js 파일에 아래 내용을 복사하고, 로컬 백엔드 서버 주소를 입력합니다.

#### js/api-config.js

```JavaScript

// 이 파일은 .gitignore에 등록되어야 합니다.
const API_BASE_URL = "http://localhost:8080";
모든 HTML 파일(index.html 등)의 <head> 태그 안에서, 메인 app.js 스크립트보다 먼저 이 config 파일을 불러옵니다.
```

#### index.html

```HTML

<head>
  <script src="/js/api-config.js"></script>
  <script src="/js/app.js" defer></script>

</head>
```

### 3. 로컬 서버로 실행 (Live Server)
로컬 HTML 파일은 fetch API 사용 시 CORS 오류가 발생할 수 있으므로, 반드시 로컬 서버로 실행해야 합니다.

VS Code 확장 프로그램 사용 (권장):

VS Code 마켓플레이스에서 'Live Server' 확장을 설치합니다.

index.html 파일을 우클릭한 뒤 **[Open with Live Server]**를 선택합니다.

브라우저에서 http://127.0.0.1:5500 (또는 유사한 주소)로 자동 실행됩니다.

### 4. 🤝 협업 규칙 (Ground Rules)
원활한 협업을 위해 다음 규칙을 준수합니다.

#### 1. 브랜치 전략 (Git Flow)
main: 릴리즈(배포)용 브랜치. 오직 develop 브랜치만 main으로 병합(merge)할 수 있습니다.

develop: 개발의 중심이 되는 브랜치. 모든 기능 브랜치는 develop에서 시작합니다.

feature/기능명: 기능 개발을 위한 브랜치.

feature/login (로그인 기능)

feature/plant-registration (식물 등록 기능)

feature/journal (성장일지 기능)

hotfix/이슈명: 배포 후 발생한 긴급 버그 수정 브랜치.

#### 2. 커밋 메시지 (Commit Convention)
커밋 메시지는 어떤 작업을 했는지 명확하게 알 수 있도록 **태그(Tag)**를 사용하여 작성합니다.

feat: 새로운 기능 추가 (e.g., feat: Add login page)

fix: 버그 수정 (e.g., fix: Correct login API typo)

docs: 문서 수정 (e.g., README.md 수정)

style: 코드 스타일 수정 (세미콜론, 들여쓰기 등)

refactor: 코드 리팩토링 (기능 변경 없는 내부 구조 개선)

chore: 기타 작업 (e.g., .gitignore 수정)

예시:

```Bash

git commit -m "feat: 로그인 페이지 UI 및 API 연동 기능 구현"
```
#### 3. Pull Request (PR) 및 코드 리뷰
기능 개발(feature/*)이 완료되면, develop 브랜치로 **Pull Request(PR)**를 생성합니다.

팀원 최소 1명 이상의 **Approve(승인)**를 받아야만 develop 브랜치로 병합(Merge)할 수 있습니다.

PR을 올릴 때는 어떤 기능을 구현했는지, 어떻게 테스트했는지 상세히 작성합니다.

#### 4. 프로젝트 디렉토리 구조
```
/
├── app/
│   ├── calendar/
│   │   ├── calendar.css
│   │   └── calendar.html
│   ├── diagnosis/
│   │   ├── diagnosis_api.js
│   │   ├── diagnosis.css
│   │   └── diagnosis.html
│   ├── dictionary/
│   │   ├── dictionary.css
│   │   └── dictionary.html
│   ├── main/
│   │   ├── main.css
│   │   └── main.html
│   ├── myplant_detail/
│   │   ├── myplant_detail.css
│   │   └── myplant_detail.html
│   ├── plant/
│   │   └── plant_api.js
│   ├── recommend/
│   │   ├── recommend.css
│   │   └── recommend.html
│   └── register/
│       ├── register.js
│       ├── registerglobal.css
│       ├── register1/
│       │   ├── register1.css
│       │   └── register1.html
│       ├── register2/
│       │   ├── register2.css
│       │   └── register2.html
│       └── register3/
│           ├── register3.css
│           └── register3.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       └── core_api.js
├── callback.html
├── index.html
└── README.md
```