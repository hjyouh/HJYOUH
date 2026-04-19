# 유형재 강사 포트폴리오 홈페이지 제작 Instruction
> 작성일: 2026-04-15  
> 작업자: Claude (쩡)  
> 재사용 가능한 바이브코딩 홈페이지 제작 가이드

---

## 1. 프로젝트 기본 정보

| 항목 | 내용 |
|------|------|
| 작업 폴더 | `I:\vibecoding\homepage\` |
| GitHub | hjyouh |
| 배포 URL | hjyouh.vercel.app |
| 언어 | 한국어 |
| 디자인 테마 | 다크 & 미니멀 (Gusto 레스토랑 템플릿 스타일 참고) |
| 레퍼런스 | https://gusto-template.framer.website/ |

---

## 2. 강사 정보 (콘텐츠 데이터)

```
이름: 유형재 (Hyungjae Youh)
직함: 생성형 AI Creator 강사
소속: (주)포인트넥스트 대표이사 / 디지털융합교육원 지도교수
주소: 서울 서초구 강남대로 53길 8, 8-25호
연락처: 010-3558-6960
이메일: hjyouh@naver.com
웹사이트: https://aitalker.co.kr/hjyouh/
```

---

## 3. 파일 구조 (필수 준수)

```
I:\vibecoding\homepage\
├── index.html              ← 메인 진입점 (라우팅만 담당)
├── pages/
│   ├── home.html           ← 홈 (슬라이드쇼 + 메시지)
│   ├── about.html          ← 강사 소개
│   ├── lectures.html       ← 강의 프로그램
│   ├── works.html          ← AI 영화 / 저서 작품
│   └── contact.html        ← 강의 의뢰 폼
├── admin/
│   └── index.html          ← 관리자 패널
├── css/
│   └── style.css           ← 공통 스타일 (다크 테마)
├── js/
│   └── main.js             ← 공통 스크립트 (라우터 포함)
└── assets/
    ├── images/             ← 이미지 파일
    └── fonts/              ← 폰트 파일
```

> ⚠️ **핵심 원칙**: 각 페이지를 독립 파일로 분리하여 한 파일 수정이 다른 파일에 영향을 주지 않도록 한다.

---

## 4. 디자인 시스템

### 색상
```css
--bg-primary:     #0d0d0d;   /* 메인 배경 */
--bg-secondary:   #1a1a1a;   /* 카드/섹션 배경 */
--bg-overlay:     rgba(0, 0, 0, 0.6);  /* 반투명 오버레이 */
--text-primary:   #ffffff;   /* 메인 텍스트 */
--text-secondary: #a0a0a0;   /* 서브 텍스트 */
--accent-gold:    #c9a96e;   /* 포인트 컬러 (골드) */
--border-color:   rgba(255, 255, 255, 0.1);
```

### 타이포그래피
```css
/* 제목 - 세리프 */
font-family: 'Playfair Display', 'Noto Serif KR', serif;

/* 본문 - 산세리프 */
font-family: 'Inter', 'Noto Sans KR', sans-serif;
```

### 공통 컴포넌트 스타일

#### 헤더
- 좌측: 로고 "유형재" (세리프, 이탤릭)
- 우측: 메뉴 링크 (Home / About / 강의 / Works / Contact)
- 배경: 투명 → 스크롤 시 반투명 다크
- 모바일: 햄버거 메뉴 → 전체 화면 드로어

#### 좌하단 메시지 박스 (전 페이지 공통)
```css
.message-box {
  position: absolute;
  bottom: 40px;
  left: 40px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px 28px;
  max-width: 420px;
}
```

#### 라운드 카드 (서브페이지)
```css
.round-card {
  border-radius: 20px;
  overflow: hidden;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.08);
  transition: transform 0.3s ease;
}
.round-card:hover {
  transform: translateY(-4px);
}
```

#### 라운드 태그 (이미지 위 레이블)
```css
.image-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}
```

---

## 5. 페이지별 상세 스펙

### 5-1. Home (홈)

**레이아웃:** 풀스크린 슬라이드쇼
- 이미지 3~5장 자동 전환 (강의 현장 사진)
- 좌/우 화살표 네비게이션
- 하단 도트 인디케이터
- 좌하단 반투명 메시지 박스

**메시지 박스 내용 (예시):**
```
"AI를 활용해 더 나은 미래를 만드는
생성형 AI 강사 유형재입니다"
★★★★★  4.9 (200+ 수강생)
```

**우측 사이드 패널 (데스크탑):**
- About 카드
- 강의 카드
- Works 카드
- 각 클릭 시 해당 페이지로 이동

---

### 5-2. About (강사 소개)

**레이아웃:** 좌우 2단 분할
- 좌측: 강사 프로필 사진 (라운드 처리)
- 우측: 소개 텍스트 + 주요 경력 + Contact 버튼

**콘텐츠:**
```
- 이름 / 직함
- 한 줄 소개 문구
- 주요 경력 (IBM 프랑스, 포인트넥스트, 디지털융합교육원 등)
- 주요 자격증 (Google Gemini 공인 강사 등)
- 저서 수 (17권)
- "강의 문의하기" 버튼 → Contact 페이지 이동
```

---

### 5-3. 강의 (Lectures)

**레이아웃:** 카드 그리드 + 팝업

**강의 카드 구성:**
```
[이미지]
강의명
카테고리 태그
가격 / 시간 / 인원
```

**팝업 내용:**
```
수업명
카테고리
클래스 소개
소요 시간 / 1인당 가격
최소/최대 인원
커리큘럼 (시간 | 제목 | 내용)
준비물
[강의 문의하기] 버튼
```

**좌측 메시지 박스:** "실무 중심의 생성형 AI 강의"

---

### 5-4. Works (작품/성과)

**카테고리 탭:**
1. AI 영화 & 뮤직비디오
2. 저서
3. 수상 경력

**AI 영화 카드:**
```
[영화 포스터 이미지]
작품명
수상/선정 배지
```

**팝업 내용:**
```
작품명
제작 연도
수상/선정 이력 목록
작품 소개 (선택)
```

**저서 카드:**
```
[책 표지 이미지]
제목
출판 연도
```

---

### 5-5. Contact (강의 의뢰)

**폼 구성:**
```
- 이름 (필수)
- 소속/기관명 (필수)
- 연락처 (필수)
- 이메일 (필수)
- 강의 종류 선택 (드롭다운)
  └ 생성형 AI 기초 / 심화 / AI 마케팅 / AI 영화 제작 / 기업 맞춤형 / 기타
- 희망 강의 일정
- 예상 인원
- 문의 내용 (textarea)
- [문의 전송] 버튼
```

**전송 방식:** EmailJS 또는 Formspree 사용 (백엔드 없이 이메일 전송)
**수신 이메일:** hjyouh@naver.com

---

### 5-6. 관리자 패널 (Admin)

**접근:** `/admin/index.html`
**로그인:** 추후 추가 예정

**기능:**
```
사이드바 메뉴
├── 홈 관리
│   ├── 슬라이드 이미지 업로드/삭제/순서변경
│   └── 메시지 박스 문구 수정
├── About 관리
│   ├── 프로필 사진 교체
│   └── 소개 문구 수정
├── 강의 관리
│   ├── 강의 추가/수정/삭제
│   └── 강의 이미지 업로드
├── Works 관리
│   ├── 작품 추가/수정/삭제
│   └── 포스터 이미지 업로드
└── 설정
    └── 연락처/SNS 링크 수정
```

**데이터 저장 방식:** `localStorage` (초기 버전) → 추후 Google Sheets 또는 Firebase 연동

---

## 6. 반응형 브레이크포인트

```css
/* 데스크탑 */
@media (min-width: 1024px) { }

/* 태블릿 */
@media (max-width: 1023px) and (min-width: 768px) { }

/* 모바일 */
@media (max-width: 767px) {
  /* 사이드 패널 → 세로 스크롤 */
  /* 이미지 풀스크린 */
  /* 햄버거 메뉴 */
}
```

---

## 7. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| HTML/CSS/JS | Vanilla | 빌드 도구 없이 바로 실행 가능 |
| 폰트 | Google Fonts | CDN으로 간편 로드 |
| 이메일 전송 | EmailJS | 백엔드 없이 이메일 전송 |
| 이미지 | Unsplash API | 임시 플레이스홀더 |
| 배포 | Vercel | GitHub 연동 자동 배포 |
| 데이터 | localStorage | 초기 버전 (추후 Firebase 전환) |

---

## 8. 제작 순서 (권장)

```
1단계: css/style.css 공통 스타일 작성
2단계: js/main.js 라우터/공통 함수 작성
3단계: index.html 메인 진입점 + 헤더/푸터
4단계: pages/home.html 홈 페이지
5단계: pages/about.html About 페이지
6단계: pages/lectures.html 강의 페이지 + 팝업
7단계: pages/works.html Works 페이지 + 팝업
8단계: pages/contact.html Contact 폼 + 이메일 연동
9단계: admin/index.html 관리자 패널
10단계: 반응형 모바일 최적화
11단계: GitHub 업로드 → Vercel 배포
```

---

## 9. Claude Code 시작 프롬프트 템플릿

```
작업 폴더: I:\vibecoding\homepage\

이 폴더에 강사 포트폴리오 홈페이지를 만들어줘.
HOMEPAGE_INSTRUCTION.md 파일을 참고해서 진행해.

지금은 [몇 단계] 작업을 해줘:
[구체적인 작업 내용]
```

---

## 10. 주의사항 & 바이브코딩 원칙

1. **파일은 반드시 분리** — index.html 하나에 모든 코드 넣지 않기
2. **한 번에 한 파일씩** — 여러 파일 동시 수정 금지
3. **수정 전 백업** — 완성된 파일은 `_backup` 폴더에 복사
4. **테스트 후 다음 단계** — 각 페이지 완성 확인 후 다음 파일 작업
5. **이미지는 assets/images/** — 경로 통일
6. **공통 스타일은 style.css에** — 각 파일에 중복 스타일 넣지 않기

---

*이 Instruction은 바이브코딩 마스터 플랜 STEP 3 홈페이지 제작을 위해 작성되었습니다.*  
*작성: Claude (쩡) | 2026-04-15*
