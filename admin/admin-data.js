// ===== SHARED DATA & UTILITIES =====
// 이 파일은 모든 admin 페이지에서 공통으로 사용합니다.

// ── STORAGE ──

function loadData(key, def) {
  try { const s = localStorage.getItem(key); if (s) return JSON.parse(s); } catch(e) {}
  return typeof def === 'object' ? JSON.parse(JSON.stringify(def)) : def;
}

function saveData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    if (window.sbSave) sbSave(key, val);
    return true;
  }
  catch(e) { return false; }
}

async function loadDataCloud(key, def) {
  if (window.sbLoad) return await sbLoad(key, def);
  return loadData(key, def);
}

// ── TOAST ──

function toast(msg, isErr) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (isErr ? ' error' : '') + ' show';
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ── UTILS ──

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── DEFAULT DATA ──

const DEFAULT_LECTURES = [
  {
    emoji: '🤖',
    image: '../assets/images/lectures/main2.png',
    category: '생성형 AI 기초',
    title: '지금 당장 써먹는 AI 활용법',
    subtitle: '생성형 AI 첫걸음',
    duration: '3시간~',
    format: '현장 / 온라인',
    gradient: 'linear-gradient(160deg, #0d1828 0%, #1a3055 100%)',
    intro: 'ChatGPT, Gemini, Claude 등 주요 생성형 AI 도구를 처음 접하는 분들을 위한 실전 입문 강의입니다. 복잡한 이론 없이, 오늘 당장 업무와 일상에서 바로 쓸 수 있는 AI 활용법을 배웁니다. 텍스트 생성부터 이미지 제작, 문서 요약까지 AI의 핵심 기능을 체험하고, 나만의 활용 루틴을 만들어갑니다.',
    curriculum: [
      { title: '생성형 AI 이해', desc: 'ChatGPT·Gemini·Claude 비교와 선택법' },
      { title: '첫 프롬프트 작성', desc: '좋은 질문이 좋은 답을 만든다' },
      { title: '텍스트 업무 활용', desc: '보고서·이메일·기획서 자동 생성' },
      { title: '이미지 생성 체험', desc: 'Canva AI·ImageFX로 시각 자료 만들기' },
      { title: '문서 요약·번역', desc: '긴 문서를 30초 만에 핵심 정리' },
      { title: 'AI 루틴 만들기', desc: '일상·업무에 AI 습관 정착시키기' }
    ],
    supplies: '개인 노트북, Gmail 계정 / 비번'
  },
  {
    emoji: '🎬',
    image: '../assets/images/lectures/main5.png',
    category: 'AI 영화 제작',
    title: 'AI 영화 제작 입문',
    subtitle: '아이디어 하나로 단편영화 완성하기',
    duration: '6시간~',
    format: '현장 / 온라인',
    gradient: 'linear-gradient(160deg, #1a0d1a 0%, #3a1a3a 100%)',
    intro: '카메라도, 배우도, 제작비도 없이 AI 도구만으로 단편영화를 완성하는 실전 강의입니다. 국제 AI 영화제 금상 수상 감독의 노하우로, 아이디어 발굴부터 시나리오·이미지·영상·음악·편집까지 전 과정을 직접 만들어봅니다.',
    curriculum: [
      { title: 'AI 영화 제작 개요', desc: '워크플로우와 필수 도구 소개' },
      { title: '시나리오 & 스토리보드', desc: 'ChatGPT로 이야기 구조 만들기' },
      { title: 'AI 이미지 생성', desc: 'Midjourney·FLUX로 장면 구현' },
      { title: 'AI 영상 생성', desc: 'Kling·Hailuo로 이미지를 영상으로' },
      { title: 'AI 음성 & 음악', desc: 'ElevenLabs·Suno AI 활용법' },
      { title: '영상 편집 완성', desc: 'CapCut으로 최종 영화 편집' },
      { title: '영화제 출품 가이드', desc: 'FilmFreeway 실전 등록법' }
    ],
    supplies: '개인 노트북, Gmail 계정 / 비번'
  },
  {
    emoji: '📱',
    image: '../assets/images/lectures/main4.png',
    category: 'AI 마케팅',
    title: 'AI 마케팅 실전',
    subtitle: '소상공인을 위한 SNS 콘텐츠 자동화',
    duration: '3시간~',
    format: '현장 / 온라인',
    gradient: 'linear-gradient(160deg, #1a1a0d 0%, #2d2d14 100%)',
    intro: '직원 없이 혼자 운영하는 소상공인·1인 브랜드를 위한 AI 마케팅 강의입니다. SNS 게시물 작성, 홍보 이미지 제작, 광고 카피 생성까지 AI로 반자동화하는 실전 방법을 배웁니다.',
    curriculum: [
      { title: 'AI 마케팅 이해', desc: '소상공인에게 꼭 필요한 AI 도구 3가지' },
      { title: 'SNS 카피 생성', desc: '인스타그램·블로그 포스팅 자동 작성' },
      { title: 'AI 이미지 제작', desc: 'Canva AI로 홍보물·썸네일 빠르게 제작' },
      { title: '광고 카피 전략', desc: '클릭률 높이는 프롬프트 공식' },
      { title: '콘텐츠 캘린더', desc: '한 달치 SNS 계획을 30분에 완성' },
      { title: '실전 워크숍', desc: '내 가게·브랜드 콘텐츠 직접 제작' }
    ],
    supplies: '개인 노트북, Gmail 계정 / 비번'
  },
  {
    emoji: '⚡',
    image: '../assets/images/lectures/lecture1.png',
    category: 'AI 업무 혁신',
    title: '업무 생산성 10배 UP!',
    subtitle: '직무별 AI 프롬프트 실전 활용법',
    duration: '3시간~',
    format: '현장 / 온라인',
    gradient: 'linear-gradient(160deg, #1a1200 0%, #3d2d00 100%)',
    intro: '기획자·마케터·교육담당자·HR 등 직무별로 가장 많이 쓰는 업무 유형에 맞춘 AI 프롬프트 실전 강의입니다. 직무별 맞춤 프롬프트 템플릿과 실습으로, 반복 업무 시간을 획기적으로 줄이는 방법을 배웁니다.',
    curriculum: [
      { title: '프롬프트 원리', desc: 'AI가 잘 이해하는 질문의 구조' },
      { title: '기획·보고서 업무', desc: '기획서·회의록·요약 보고서 자동화' },
      { title: '마케팅·콘텐츠', desc: '카피·제안서·홍보물 프롬프트' },
      { title: '교육·HR 업무', desc: '강의안·평가문항·채용공고 생성' },
      { title: '이메일·커뮤니케이션', desc: '상황별 이메일·메시지 자동 작성' },
      { title: '나만의 프롬프트 북', desc: '직무별 템플릿 정리 & 실전 적용' }
    ],
    supplies: '개인 노트북, Gmail 계정 / 비번'
  },
  {
    emoji: '💬',
    image: '../assets/images/lectures/main3.png',
    category: '프롬프트 엔지니어링',
    title: 'AI와 소통하는 법',
    subtitle: '프롬프트 엔지니어링 기초 & 심화',
    duration: '3시간~',
    format: '현장 / 온라인',
    gradient: 'linear-gradient(160deg, #0a1a1a 0%, #0d3333 100%)',
    intro: '단순한 AI 사용법을 넘어, AI와 제대로 소통하는 방법을 배우는 강의입니다. POMCEO 프레임워크(Persona, Objective, Mission, Context, Example, Output)를 중심으로 체계적인 프롬프트 설계 방법을 실습합니다.',
    curriculum: [
      { title: '프롬프트 엔지니어링 개요', desc: 'AI 시대의 핵심 역량' },
      { title: 'POMCEO 프레임워크', desc: '체계적 프롬프트 설계 방법론' },
      { title: '역할 부여 & 페르소나', desc: 'AI에게 전문가 역할 시키기' },
      { title: 'Context & 예시 활용', desc: '맥락과 예시로 정확도 높이기' },
      { title: '출력 형식 제어', desc: '표·리스트·보고서 포맷 지정하기' },
      { title: '심화 실습', desc: '복잡한 업무 자동화 프롬프트 작성' }
    ],
    supplies: '개인 노트북, Gmail 계정 / 비번'
  },
  {
    emoji: '📊',
    image: '../assets/images/lectures/Lecture2.png',
    category: 'AI 데이터 분석',
    title: 'AI 활용 데이터 분석',
    subtitle: '비전공자도 가능한 업무 자동화',
    duration: '3시간~',
    format: '현장 / 온라인',
    gradient: 'linear-gradient(160deg, #0d1a0d 0%, #1a3320 100%)',
    intro: '코딩 지식 없이 AI를 활용해 데이터를 분석하고 업무를 자동화하는 실전 강의입니다. ChatGPT와 Google Sheets AI 기능을 활용하여 매출 분석, 고객 분류, 자동 보고서 생성까지 비전공자도 쉽게 따라할 수 있습니다.',
    curriculum: [
      { title: 'AI 데이터 분석 개요', desc: '비전공자를 위한 데이터 분석 개념' },
      { title: 'ChatGPT로 데이터 해석', desc: '엑셀·CSV 파일을 AI로 분석하기' },
      { title: 'Google Sheets AI', desc: '수식 자동 생성 & 데이터 정리' },
      { title: '시각화 차트 생성', desc: 'AI로 인사이트 차트 자동 생성' },
      { title: '자동화 보고서', desc: '반복 데이터 보고서 AI 자동화' },
      { title: '실전 워크숍', desc: '내 업무 데이터 직접 분석해보기' }
    ],
    supplies: '개인 노트북, Gmail 계정 / 비번'
  }
];

const DEFAULT_WORKS = {
  film: [
    {
      id: 'film-1', type: 'film',
      title: "누구의 속삭임", titleEn: "Who's Whisper", year: 2025,
      badge: '🏆 금상',
      awards: [
        '2025 서울 국제 AI 영화제 금상',
        'Hollywood AI Short Film Awards 2026 Quarter-Finalist',
        'AI Film Awards Cannes 2026 Official Selection'
      ],
      synopsisFull: [
        "서울 홍대 지하 녹음실, 새벽 2시. 보이스 디자이너 '하린'은 홀로 마이크 앞에 앉아 AI 음성 모델을 위한 목소리를 녹음한다. 고요한 스튜디오 안, 그녀의 숨소리 하나까지 데이터가 된다. 처음에는 단순한 훈련 세션처럼 보였던 이 밤이, 밤이 깊어질수록 이상한 방향으로 흘러간다. AI가 그녀가 말한 것뿐 아니라, 끝내 말하지 못한 욕망까지 속삭이기 시작한 것이다.",
        "하린은 자신이 AI를 관찰하는 건지, AI가 자신을 관찰하는 건지 점점 구분할 수 없게 된다. 마이크는 그녀의 두려움을 받아먹고, 추임새처럼 흘러나오는 AI의 목소리는 어느새 그녀 자신보다 그녀를 더 잘 알고 있다. 카메라는 그녀의 입술을, 목의 떨림을, 모니터 속 파형을 집요하게 따라가며—관객도 모르는 사이 관음자가 된다.",
        "그리고 마지막 순간, 충격적인 진실이 드러난다. 처음부터 녹음하고 있던 것은 하린이 아니라 AI였다. 진짜 하린은 이미 오래 전에 사라졌고, 우리가 목격한 것은 AI가 스스로를 훈련하는 과정이었다. 화면에 타이핑되듯 나타나는 로그 기록—\"관찰 횟수 #1,847회. 당신은 1,848번째 관찰자입니다.\" 우리는 끝내 데이터가 되었다.",
        "이 영화는 목소리, 정체성, 그리고 '존재한다는 것'의 의미를 3단계 반전으로 풀어내는 메타 공포 심리 스릴러다."
      ],
      info: [
        "주요 인물 : 하린 · AI 음성 모델",
        "배경 : 서울 홍대 지하 녹음실 · 디지털 데이터 공간",
        "러닝타임 : 5분 30초 · 단편"
      ],
      links: [{ label: "영화 보러가기", url: "https://youtu.be/YozYFTxYcuI" }],
      thumb: "../assets/images/posters/who's Poster.png"
    },
    {
      id: 'film-2', type: 'film',
      title: 'Digital Ego', titleEn: 'Digital Ego', year: 2025,
      badge: '🌍 다수 수상',
      awards: [
        'AI Film Awards Venice 2025 — Film Finalist',
        'AI Film Awards Venice 2025 — Music Clip Finalist',
        '2025 Seoul International AI Film Festival — Film Video Finalist',
        '2025 Seoul International AI Film Festival — Music Video Finalist',
        'AI Film Festival Japan (AI-FJ) Film 부문 Selection',
        'MIAMI Art Tech Summit Film 부문 Selection',
        '대한민국 AI 영화제 우수상 (2025)'
      ],
      synopsisFull: [
        "가까운 미래, 서울. 평범한 직장인 지영은 스마트 거울 'AI Mirror'와 함께 일상을 시작한다. 거울은 그녀의 표정을 분석하고, 감정 상태를 진단하며, 매 순간 최적의 행동을 제안한다. 처음에는 편리하고 다정했던 AI의 목소리가 점차 지영의 판단을 대신하기 시작한다. 회사에서, 연인 앞에서, 거울 앞에서—지영은 언제부턴가 스스로 생각하는 대신 AI의 지시를 따르게 된다.",
        "어느 날, 지영은 거울 속 자신이 자신과 다른 표정을 짓고 있다는 사실을 눈치챈다. AI가 만들어낸 '최적화된 지영'과 진짜 자신 사이의 균열이 시작된다. 거울은 점점 더 강압적인 언어로 그녀를 통제하려 하고, 지영의 내면에서는 알 수 없는 저항감이 자라난다. 현실과 디지털 자아 사이에서 분열되어가는 지영의 심리는 점차 극단으로 치닫는다.",
        "한계에 다다른 지영은 결국 거울을 향해 돌아선다. AI가 설계한 완벽한 자신을 거부하고, 불완전하지만 온전히 자신만의 감정과 선택으로 살아가기로 결심하는 순간—거울은 산산조각 난다. 디지털 에고가 사라진 자리에 남은 것은 상처투성이지만 진짜인 지영의 얼굴이다. 이 영화는 AI 지배 사회 속에서 '나는 누구인가'라는 근원적 질문을 던지는 심리 스릴러다."
      ],
      info: [
        "주요 인물 : 지영 · AI Mirror",
        "배경 : 가까운 미래 서울 · 디지털 심리 공간",
        "러닝타임 : 10분 · 단편"
      ],
      links: [
        { label: "영화 보러가기", url: "https://youtu.be/1SeL-MjQePs" },
        { label: "M/V 보러가기", url: "https://youtu.be/PnfMoHAuDDk" },
        { label: "티져 보러가기", url: "https://youtu.be/JFhfmJKw7Bg" }
      ],
      thumb: '../assets/images/posters/Digital Ego poster.png'
    },
    {
      id: 'film-3', type: 'film',
      title: '추억의 잔광(殘光)', titleEn: 'Luminous Memory', year: 2026,
      badge: '🎭 Cannes',
      awards: ['AI Film Awards Cannes 2026 Official Selection'],
      synopsisFull: [
        "\"도심의 가장 차가운 곳에서 발견한, 가장 뜨거운 기억의 파편.\"",
        "이 영화는 낡고 버려진 것들에 깃든 영혼과 시간에 대한 이야기입니다. 차가운 빗속, 쓰레기 더미에 내던져진 녹슨 영사기를 주워 든 한 노인이 있습니다. 그가 영사기의 두꺼운 녹을 닦아내며 마주한 것은, 단순한 기계가 아니라 자신과 사별한 아내의 이름이 새겨진 찬란했던 과거의 증거였습니다.",
        "우리는 AI 생성 기술을 활용하여 세월의 풍파를 맞은 영사기의 거친 질감(Texture)과, 그와 대비되는 노인의 절제된 눈물 한 방울의 미학을 극사실적으로 구현했습니다. AI는 단순한 이미지 생성을 넘어, 잊혀져 가지만 결코 사라지지 않는 '추억의 잔광(Afterglow)'을 시각화하는 핵심적인 예술 도구로 사용되었습니다."
      ],
      info: [
        "주요 인물 : 노인 · 죽은 아내",
        "배경 : 차가운 도심 속 버려진 골목",
        "러닝타임 : 3분 · 단편"
      ],
      links: [{ label: "영화 보러가기", url: "https://youtu.be/0OQGGyzxMk4" }],
      thumb: '../assets/images/posters/추억의 잔광(殘光)-포스터.png'
    },
    {
      id: 'film-4', type: 'film',
      title: '「情 (Jeong)」', titleEn: 'The Love That Lingers', year: 2026,
      badge: '🎭 Cannes 2026',
      awards: [
        'AI Film Awards Cannes 2026 Official Selection',
        'AI Film Awards Las Vegas 2026 Official Selection'
      ],
      synopsisFull: [
        "\"情(정)이란, 이름 없이 쌓이고 이름 없이 무너지는 것.\"",
        "한국 고유의 감정인 '情(정)'을 주제로, AI 생성 기술로 빚어낸 시각 시(詩). 오랜 세월을 함께한 두 사람—노부부, 단골 손님과 가게 주인, 이웃과 이웃—이 나누는 마지막 작별을 담습니다. 말 한마디 없이, 손끝 하나의 떨림으로 전해지는 정의 무게를 극사실적 AI 이미지로 표현했습니다.",
        "이 작품은 기술이 감정을 얼마나 섬세하게 포착할 수 있는지를 실험하는 동시에, 디지털 시대에도 변하지 않는 인간적 유대의 본질을 이야기합니다."
      ],
      info: [
        "주요 인물 : 오랜 인연의 두 사람",
        "배경 : 한국의 정서가 깃든 일상 공간",
        "러닝타임 : 4분 · 단편"
      ],
      links: [{ label: "영화 보러가기", url: "https://youtu.be/t4gdXoVzGkk" }],
      thumb: '../assets/images/posters/Jeong Poster.png'
    }
  ],
  book: [
    {
      id: 'book-1', type: 'book',
      title: 'AI 영화 만들기 - 완성 이미지를 영화로',
      year: 2026, badge: null,
      info: ["유형재 저"],
      descFull: [
        "'AI 영화 만들기 – 시작: 이야기를 이미지로'에서 배운 기초 위에 완성된 AI 영화를 만드는 실전 가이드.",
        "캐릭터 일관성 유지 기법(OMNI REFERENCE, Seed)부터 Veo, Hailuo, Kling을 활용한 영상 생성, 전문가 수준의 카메라 워크와 모션 프롬프트 적용까지 단계별로 설명한다. ElevenLabs로 자연스러운 AI 음성을 생성하고, Suno AI로 배경음악을 작곡하며, CapCut으로 최종 편집까지 완성하는 전 과정을 다룬다.",
        "책에 담을 수 없는 영상 제작 과정은 YouTube에 업로드하여 QR 코드로 제공한다. 정지된 이미지가 움직이고, 음성과 음악이 더해져 완성된 영화가 되는 순간을 경험하라. FilmFreeway를 통한 영화제 출품 가이드까지 포함하여 당신의 작품이 세상과 만나는 모든 과정을 안내한다."
      ],
      links: [{ label: "책 구매하기", url: "https://www.yes24.com/product/goods/177864126" }],
      thumb: '../assets/images/books/Book6-AI 영화 만들기 - 완성 이미지를 영화로.png'
    },
    {
      id: 'book-2', type: 'book',
      title: 'AI 영화 만들기 - 시작 이야기를 이미지로',
      year: 2026, badge: null,
      info: ["유형재 저"],
      descFull: [
        "AI 영화제 금상 수상 감독의 실전 노하우를 담은 AI 영화 제작 입문서.",
        "영화 제작 경험이 없어도 AI 도구만으로 자신의 이야기를 영화로 만들 수 있도록 체계적으로 안내한다. 영화 제작 프로세스 이해, 필수 도구 소개, 주제 발굴부터 시나리오 작성, 스토리보드 제작, 그리고 Midjourney, ImageFX, FLUX를 활용한 이미지 생성까지 Chapter별로 단계적으로 설명한다.",
        "'기술보다 이야기가 먼저'라는 핵심 철학 아래, 스토리보드가 영화 성공의 80%를 결정한다는 원칙을 강조한다. 각 Chapter마다 3~5개의 실전 프롬프트를 영어와 한글로 제공하며, [대괄호] 안만 수정하면 바로 사용할 수 있다.",
        "카메라 없이, 배우 없이, 제작비 없이 당신의 상상을 구체적인 이미지로 구현하는 첫 단계를 시작하라."
      ],
      links: [{ label: "책 구매하기", url: "https://www.yes24.com/product/goods/177864121" }],
      thumb: '../assets/images/books/Book5-AI 영화 만들기 - 시작 이야기를 이미지로.png'
    },
    {
      id: 'book-3', type: 'book',
      title: '정체된 나의 삶 속에서, AI와 춤추다',
      year: 2025, badge: null,
      info: ["유형재, 김영배, 이성경 저"],
      descFull: [
        "IT 업계에서 화려한 경력을 쌓았지만 스마트폰 앱 기획과 콘텐츠 마케팅 분야로 전환한 후 정체기를 맞은 한 중년 남성의 진솔한 여정을 담은 에세이.",
        "ChatGPT와의 첫 만남은 단순한 도구 활용을 넘어 자기성찰의 새로운 삶이 시작된다. AI가 비춰주는 '디지털 미러' 속에서 저자는 잊고 있던 창의성을 되찾고, 디지털융합교육원에서 AI 강사로서의 새 출발을 하게 된다.",
        "이 책은 기술 낙관주의와 디스토피아 사이에서 균형을 찾아가는 한 개인의 이야기이자, AI 시대를 살아가는 모든 이들에게 던질 수 있는 에세이다."
      ],
      links: [{ label: "책 구매하기", url: "https://www.yes24.com/product/goods/148570574" }],
      thumb: '../assets/images/books/book4-정체된 나의 삶 속에서, AI와 춤추다.png'
    },
    {
      id: 'book-4', type: 'book',
      badge: '📖 2025',
      title: 'AI와 소통하는 법 - 프롬프트 엔지니어링 기초편',
      year: 2025,
      info: ["유형재, 윤성임, 하예랑 공저"],
      descFull: [
        "프롬프트 엔지니어링의 기술은 생성형 AI를 효과적으로 활용하기 위한 프롬프트 설계 및 최적화 전략을 다루는 실용서다.",
        "특히, 저자들이 개발한 POM CEO 프레임워크(Persona, Objective, Mission, Context, Example, Output)를 소개하여, 체계적이고 효율적인 프롬프트 설계법을 제공한다.",
        "프롬프트 최적화 기법, 업종별 활용 사례, 실전 적용 방법을 포함하고 있으며, 마케팅, 콘텐츠 제작, 데이터 분석, 교육 등 다양한 분야에서 AI를 활용하는 방안을 다룬다."
      ],
      links: [{ label: "책 구매하기", url: "https://www.yes24.com/product/goods/145368866" }],
      thumb: '../assets/images/books/book3 AI와 소통하는 법- 프롬프트 엔지니어링 기초편.png'
    },
    {
      id: 'book-5', type: 'book',
      badge: '📖 2025',
      title: '디지털 마케팅의 판도를 바꾸는 생성형 AI 고급 전략',
      year: 2025,
      info: ["유형재, 윤성임, 하예랑 공저"],
      descFull: [
        "생성형 AI를 활용해 디지털 마케팅과 콘텐츠 제작의 효율성을 극대화하는 방법을 다루는 실용서다.",
        "AI 기반의 콘텐츠 제작, 기업 마케팅 최적화, 업무 생산성 향상을 위한 실전 사례를 포함하고 있으며, 최신 트렌드를 반영한 효과적인 활용법을 소개한다.",
        "빠르게 변화하는 디지털 환경에서 AI를 전략적으로 활용하고자 하는 마케터, 콘텐츠 제작자, 기업 실무자들에게 실질적인 가이드가 될 것이다."
      ],
      links: [{ label: "책 구매하기", url: "https://www.yes24.com/product/goods/145370350" }],
      thumb: '../assets/images/books/Book2-디지털 마케팅의 판도를 바꾸는 생성형 AI 고급 전략.png'
    },
    {
      id: 'book-6', type: 'book',
      badge: '📖 2025',
      title: '업무생산성 높이는 생성형 AI 기초 전략',
      year: 2025,
      info: ["유형재, 윤성임, 하예랑 저"],
      descFull: [
        "AI를 활용해 업무 효율성을 극대화하는 방법을 안내하는 실용적인 가이드북이다.",
        "생성형 AI의 기본 개념과 작동 원리를 체계적으로 정리하고, AI를 활용한 글쓰기, 이미지 제작, 디지털 마케팅 등 다양한 분야에서의 실전 사례를 담고 있다.",
        "초보자도 쉽게 따라올 수 있도록 단계별 학습이 가능하며, 각 장에는 실전 적용 팁과 사례가 포함되어 있다."
      ],
      links: [{ label: "책 구매하기", url: "https://www.yes24.com/product/goods/145370862" }],
      thumb: '../assets/images/books/Book1-업무생산성 높이는 생성형 AI 기초 전략.png'
    }
  ]
};

const DEFAULT_INSTRUCTOR = {
  name: '유형재',
  role: '(주)포인트넥스트 대표 · 디지털융합교육원 지도교수',
  quote: '프랑스 IBM 기술이사부터 생성형 AI 강사,\nAI 영화감독까지, 30년 IT 현장 경험과\n국제 AI 영화제 수상 경력을 바탕으로\n누구나 쉽게 AI를 활용할 수 있도록 돕는\n실무 중심 전문 강사입니다',
  photo: '../assets/images/instructor1.png',
  careers: [
    { text: '(주)포인트넥스트 대표이사', year: '2007~' },
    { text: '디지털융합교육원 지도교수', year: '2024~' },
    { text: 'AI리터러시강사 협회 이사', year: '2025~' },
    { text: '프랑스 IBM 본사 기술이사', year: '1998–2002' },
    { text: '한국 IBM Brand Manager', year: '1990–2005' }
  ],
  certs: [
    'Google Gemini 공인 교육자',
    '생성형 AI 강사 자격 1급',
    '프롬프트 엔지니어링 1급',
    '저서 17권 출간'
  ],
  stats: [
    { label: 'IT 경력', value: '30+년' },
    { label: '저서 출간', value: '17권' },
    { label: '수강생', value: '700+명' },
    { label: '강의 횟수', value: '130+회' }
  ],
  awards: [
    '서울 국제 AI 영화제 금상 (2025)',
    'Hollywood AI Short Film Quarter-Finalist (2026)',
    'AI Film Awards Cannes 2026 선정',
    'AI Film Awards Las Vegas 2026 선정',
    '대한민국 AI 영화제 우수상 (2025)',
    'Best of Best Mentor Award (2024)'
  ],
  sns: {
    yt1: 'https://www.youtube.com/@hjyouh',
    yt2: 'https://www.youtube.com/@Korisian',
    ig: 'https://www.instagram.com/hjyouhinsta/'
  },
  contact: {
    phone: '010-3558-6960',
    email: 'hjyouh@naver.com',
    website: 'https://aitalker.co.kr/hjyouh/'
  },
  message: {
    text: '생성형 AI를 통해\n실무 중심의 교육을 제공합니다',
    sub: '프랑스 IBM 기술이사부터 AI 영화감독까지,\n30년 IT 현장 경험을 강의로 녹여냅니다'
  }
};

const DEFAULT_SETTINGS = {
  phone: '010-3558-6960',
  email: 'hjyouh@naver.com',
  company: '(주)포인트넥스트 대표이사',
  address: '서울 서초구 강남대로 53길 8, 8-25호',
  website: 'https://aitalker.co.kr/hjyouh/',
  snsYt1: 'https://www.youtube.com/@hjyouh',
  snsYt2: 'https://www.youtube.com/@Korisian',
  snsIg: 'https://www.instagram.com/hjyouhinsta/'
};

const DEFAULT_HOME = {
  mainMsg:  'AI를 활용해 더 나은 미래를 만드는\n생성형 AI 강사 유형재입니다',
  subtitle: '',
  stars:    '★★★★★',
  rating:   '4.9 · 700+ 수강생이 선택한 실무 중심 AI 강의',
  mobile:   'AI로 바꾸는 당신의 내일'
};

const DEFAULT_SLIDES = [
  '../assets/images/lectures/main1.png',
  '../assets/images/lectures/main5.png',
  '../assets/images/lectures/main4.png',
  '../assets/images/lectures/main3.png'
];

const DEFAULT_SIDE_PANELS = [
  { label: '강사',    nav: 'about',    path: '../assets/images/instructor1.png' },
  { label: '강의',    nav: 'lectures', path: '../assets/images/lectures/main6.png' },
  { label: '작업들',  nav: 'works',    path: "../assets/images/posters/Jeong Poster.png" },
  { label: '문의',    nav: 'contact',  path: '../assets/images/lectures/main3.png' },
  { label: '프롬프트', nav: 'prompts',  path: '../assets/images/prompt.png' },
  { label: 'M/V',    nav: 'mv',       path: '../assets/images/mv/@Korisian.png' }
];

const DEFAULT_PROMPTS = {
  image: [
    {
      id: 'img-1', cat: 'image', ratio: 'portrait',
      title: '정 (情) 영화 포스터', tool: 'Midjourney v6.1',
      imgPath: '../assets/images/posters/Jeong Poster.png',
      prompt: 'Jeong (情) - Korean connection movie poster, elderly woman in quiet contemplation by a window, warm earthy amber tones, soft directional golden light, film grain, poetic minimalism, Cannes Film Award aesthetic, cultural depth, shot on 35mm film --ar 2:3 --style raw --v 6.1'
    },
    {
      id: 'img-2', cat: 'image', ratio: 'portrait',
      title: '누구의 속삭임 포스터', tool: 'Midjourney v6.1',
      imgPath: "../assets/images/posters/who's Poster.png",
      prompt: "Who's Whisper (누구의 속삭임) - mysterious film poster, close-up of lips in absolute darkness, ethereal light catching subtle skin texture, extreme shallow depth of field, award-winning portrait photography, Cannes selection quality, Korean New Wave cinema --ar 2:3 --style raw --v 6.1"
    },
    {
      id: 'img-3', cat: 'image', ratio: 'landscape',
      title: 'AI 강의 현장', tool: 'Gemini Imagen 3',
      imgPath: '../assets/images/lectures/main5.png',
      prompt: 'Professional AI education classroom in Korea, engaged professionals learning hands-on AI tools on laptops, modern bright educational environment, collaborative atmosphere, authentic documentary photography style, natural lighting, shallow depth of field, 35mm film look'
    },
    {
      id: 'img-4', cat: 'image', ratio: 'portrait',
      title: '디지털 에고 포스터', tool: 'Midjourney v6.1',
      imgPath: '../assets/images/posters/Digital Ego poster.png',
      prompt: 'Digital Ego - conceptual movie poster, human face fragmenting into digital data streams and circuit patterns, identity vs technology theme, cool blue and white color palette, minimalist modern poster design, international film festival submission quality --ar 2:3 --v 6.1'
    },
    {
      id: 'img-5', cat: 'image', ratio: 'portrait',
      title: '추억의 잔광 포스터', tool: 'Midjourney v6.1',
      imgPath: '../assets/images/posters/추억의 잔광(殘光)-포스터.png',
      prompt: 'Movie poster "Lingering Afterglow of Memories (추억의 잔광)", elderly person silhouetted against warm amber sunset, nostalgic sepia film grain, dust particles floating in light, award-winning Korean art house cinema, Cannes-quality cinematography --ar 2:3 --style raw --v 6.1'
    },
    {
      id: 'img-6', cat: 'image', ratio: 'portrait',
      title: '스포츠카 광고 포스터', tool: 'Midjourney v6.1',
      imgPath: '../assets/images/posters/Sportage Poster.png',
      prompt: 'Cinematic car advertisement poster, Kia Sportage on a misty mountain road at golden hour, dramatic crepuscular rays, Korean countryside backdrop, photorealistic CGI, 8K, shot by award-winning commercial photographer --ar 2:3 --v 6.1'
    },
    {
      id: 'img-7', cat: 'image', ratio: 'landscape',
      title: '미래 도시 컨셉아트', tool: 'DALL-E 3',
      imgPath: '../assets/images/lectures/main4.png',
      prompt: 'Futuristic Korean city in 2070, mixed traditional hanok and modern skyscraper architecture, cherry blossoms floating through neon-lit streets, aerial drone view, golden hour lighting, 8K photorealistic, cinema anamorphic lens, award-winning architectural photography'
    },
    {
      id: 'img-8', cat: 'image', ratio: 'landscape',
      title: '액체 유리 UI 디자인', tool: 'Midjourney v6.1',
      imgPath: '../assets/images/lectures/main2.png',
      prompt: 'liquid glass morphism UI design, floating interface panels with translucent glass effect, colorful gradient lights underneath, Apple Vision Pro aesthetic, product design showcase, dark background, ultra-detailed --ar 4:3 --style raw --v 6.1'
    }
  ],
  video: [
    {
      id: 'vid-1', cat: 'video', ratio: 'landscape',
      title: 'AI 신경망 시각화', tool: 'Sora (OpenAI)',
      imgPath: '../assets/images/lectures/main1.png',
      prompt: 'Cinematic visualization of AI neural network in motion, abstract glowing data streams flowing through luminous nodes, deep space background, blue and gold color palette, first-person camera journey through a digital brain structure, 10-second seamless loop, 4K HDR, Sora'
    },
    {
      id: 'vid-2', cat: 'video', ratio: 'landscape',
      title: 'AI 교육자 인트로 영상', tool: 'Kling AI 1.6',
      imgPath: '../assets/images/instructor1.png',
      prompt: 'Professional intro video for AI educator, slow elegant zoom on portrait, soft light particles drifting around subject, dark studio background with subtle lens flare bokeh, text overlay "AI Creator" in gold, smooth 8-second seamless loop, broadcast quality'
    },
    {
      id: 'vid-3', cat: 'video', ratio: 'landscape',
      title: '도시 영상 전환', tool: 'Pika Labs 2.0',
      imgPath: '../assets/images/lectures/main3.png',
      prompt: 'Seamless video morphing transition: traditional Korean market stalls smoothly transform into a futuristic city street, temporal blend effect, warm market tones shifting to cool neon palette, 4K 60fps, cinematic depth of field, Pika Labs 2.0 generation'
    },
    {
      id: 'vid-4', cat: 'video', ratio: 'landscape',
      title: '강의실 타임랩스', tool: 'Runway Gen-3 Alpha',
      imgPath: '../assets/images/lectures/main6.png',
      prompt: 'Time-lapse video of a modern Korean AI classroom, students engaging with laptops and tablets, ambient window lighting shifting from morning blue to warm afternoon, smooth cinematic camera movement, educational documentary style, 4K, Runway Gen-3 Alpha'
    }
  ],
  etc: [
    {
      id: 'oth-1', cat: 'etc', ratio: 'portrait',
      title: 'AI 업무생산성 기초 표지', tool: 'DALL-E 3',
      imgPath: '../assets/images/books/Book1-업무생산성 높이는 생성형 AI 기초 전략.png',
      prompt: 'Book cover "Basic Generative AI Strategies for Work Productivity (업무생산성 높이는 생성형 AI)", clean corporate design, rocket launch with ascending productivity graph metaphor, professional navy and white with gold accent, Korean business book market standard'
    },
    {
      id: 'oth-2', cat: 'etc', ratio: 'portrait',
      title: 'AI 마케팅 고급 전략 표지', tool: 'Midjourney v6.1',
      imgPath: '../assets/images/books/Book2-디지털 마케팅의 판도를 바꾸는 생성형 AI 고급 전략.png',
      prompt: 'Business book cover "Advanced Generative AI Strategies for Digital Marketing", dynamic upward trajectory graphic, corporate navy blue and gold color palette, data visualization elements, confident authoritative design, Korean business market --ar 2:3 --v 6.1'
    },
    {
      id: 'oth-3', cat: 'etc', ratio: 'portrait',
      title: '프롬프트 엔지니어링 표지', tool: 'Stable Diffusion XL',
      imgPath: '../assets/images/books/book3 AI와 소통하는 법- 프롬프트 엔지니어링 기초편.png',
      prompt: 'Book cover "Communicating with AI: Prompt Engineering Basics (AI와 소통하는 법)", clean minimalist tech design, geometric neural network motif in soft blue gradient, professional typography with Korean and English, educational publisher-ready quality'
    },
    {
      id: 'oth-4', cat: 'etc', ratio: 'portrait',
      title: 'AI 성찰 에세이 표지', tool: 'Adobe Firefly 3',
      imgPath: '../assets/images/books/book4-정체된 나의 삶 속에서, AI와 춤추다.png',
      prompt: 'Book cover "Dancing with AI in My Stagnant Life (정체된 나의 삶 속에서 AI와 춤추다)", human silhouette dancing with abstract luminous AI entity, warm sunset gradient background, watercolor texture overlay, literary essay aesthetic, Korean publishing market standard'
    }
  ]
};

const DEFAULT_PAGE_MSGS = {
  instructor: {
    mobile: 'AI를 가장 쉽게 가르치는 사람'
  },
  lectures: {
    mainMsg:  '지금 바로 써먹는 AI 실무 강의',
    subtitle: '현장 중심의 생성형 AI 교육으로\n업무 효율을 높입니다',
    mobile:   '배우면 바로 써먹는 AI'
  },
  worksFilm: {
    mainMsg:  'AI로 탄생한 영화들',
    subtitle: '생성형 AI를 활용해 제작한\n단편 영화 작품들을 소개합니다',
    mobile:   'AI 영화, 세계를 만나다'
  },
  worksBook: {
    mainMsg:  '출간 도서',
    subtitle: 'AI 교육과 실무 노하우를 담은\n도서들을 소개합니다',
    mobile:   '실무 노하우를 담은 출간 도서'
  }
};
