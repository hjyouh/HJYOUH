// ===== SEO HTML 서버 렌더링 (다중 URL) =====
// vercel.json routes가 / /index.html /about /lectures /works 를 이 함수로 보낸다.
// 정적 index.html을 읽어 경로별로 (1) title/description/canonical/og·twitter 메타태그와
// (2) #page-container 안의 정적 body 콘텐츠(h1·본문)를 치환해 응답한다.
// → JS 미실행 크롤러·OG 스크래퍼·view-source에서도 경로별 고유 콘텐츠가 보인다.
// title/description은 Supabase seoData(페이지별 { home, about, lectures, works })로 덮어쓸 수 있고,
// 값이 없으면 아래 ROUTE_CONTENT의 기본값을 사용한다. body 콘텐츠는 코드로 고정.

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://croflpzoljrnnanutpsh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gkr1EzfYlAPOqE0oAh3FSw_VpIeV5-Z';

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setMetaContent(html, tagPattern, value) {
  if (!value) return html;
  return html.replace(tagPattern, (m, before, after) => before + escAttr(value) + after);
}

// ── 경로별 기본 메타 + 정적 body (본문에 내부 링크 포함) ──
const ROUTE_CONTENT = {
  about: {
    canonical: 'https://hjyouh.com/about',
    title: 'AI강사 유형재 프로필 | IBM 출신 생성형 AI 교육 전문가',
    description: 'IBM Korea와 IBM France에서 30년간 IT 경력을 쌓은 생성형 AI 교육 전문가 유형재를 소개합니다. 현재 포인트넥스트 대표이자 디지털융합교육원 지도교수로 활동하며 기업·공공기관 대상 AI 교육을 진행합니다.',
    body: `      <section class="seo-intro">
        <h1>AI강사 유형재</h1>
        <p>생성형 AI 강사이자 AI영화감독. IBM Korea와 IBM France에서 30년간 IT 현장을 경험한 뒤, 그 경력을 바탕으로 기업·공공기관·병원·소상공인·시니어를 대상으로 실습 중심의 생성형 AI 교육을 진행하고 있습니다.</p>

        <h2>현직</h2>
        <ul>
          <li>(주)포인트넥스트 대표이사</li>
          <li>디지털융합교육원 지도교수</li>
        </ul>

        <h2>경력</h2>
        <ul>
          <li>IBM Korea · IBM France — 30년 IT 경력</li>
        </ul>

        <h2>학력</h2>
        <ul>
          <li>Eastern Michigan University</li>
        </ul>

        <p>진행 중인 <a href="/lectures">생성형 AI 강의</a>와 수상한 <a href="/works">AI 영화 작품</a>도 함께 확인해 보세요.</p>
      </section>`
  },
  lectures: {
    canonical: 'https://hjyouh.com/lectures',
    title: '생성형 AI 강의 | 기업·공공기관·소상공인 맞춤 교육 | AI강사 유형재',
    description: '기업·공공기관·소상공인·시니어·농업인 대상으로 맞춤 설계한 생성형 AI 실습 강의를 안내합니다. ChatGPT·Claude 활용부터 AI 콘텐츠 제작까지 현장에서 바로 쓰는 실무 중심으로 교육합니다.',
    body: `      <section class="seo-intro">
        <h1>생성형 AI 강의 안내</h1>
        <p>기업, 공공기관, 소상공인, 시니어, 농업인 등 대상에 맞춰 설계한 생성형 AI 실습 강의를 제공합니다. ChatGPT·Claude 활용부터 AI 콘텐츠 제작까지 현장에서 바로 쓰는 실무 중심으로 진행합니다.</p>

        <h2>주요 강의 분야</h2>
        <ul>
          <li>생성형 AI 활용 실무 교육 (ChatGPT · Claude · Midjourney)</li>
          <li>Claude Code 바이브 코딩</li>
          <li>AI 콘텐츠 제작 (카드뉴스 · PPT 자동화 · 영상)</li>
          <li>공공기관·기업 맞춤형 AI 리터러시 교육</li>
        </ul>

        <h2>대상별 커리큘럼</h2>
        <ul>
          <li>기업 — 업무 자동화·생산성 향상 중심의 생성형 AI 실무</li>
          <li>공공기관 — AI 리터러시와 공공 서비스 적용 사례</li>
          <li>소상공인 — 마케팅 콘텐츠·홍보물 제작 실습</li>
          <li>시니어 — 일상에서 쉽게 쓰는 생성형 AI 입문</li>
          <li>농업인 — 스마트팜·판로 홍보를 위한 AI 활용</li>
        </ul>

        <h2>강의 문의</h2>
        <p>강의 일정과 커리큘럼은 대상·인원에 맞춰 조율합니다. <a href="/about">강사 프로필</a>을 확인하시고, 문의는 홈페이지 Contact를 통해 남겨 주세요. 강사의 <a href="/works">AI 영화 작품</a>도 참고하실 수 있습니다.</p>
      </section>`
  },
  works: {
    canonical: 'https://hjyouh.com/works',
    title: 'AI 영화 작품 | 서울국제AI영화제 그랑프리 | AI영화감독 유형재',
    description: '서울국제AI영화제 그랑프리를 수상한 AI영화감독 유형재의 작품과 국내외 영화제 수상 이력을 소개합니다. 생성형 AI로 제작한 영화·뮤직비디오를 만나보세요.',
    body: `      <section class="seo-intro">
        <h1>AI 영화 작품</h1>
        <p>서울국제AI영화제 그랑프리를 수상한 AI영화감독 유형재의 작품을 소개합니다. 생성형 AI로 제작한 영상으로 국내외 영화제에서 수상·초청되었습니다.</p>

        <h2>수상 및 활동</h2>
        <ul>
          <li>서울국제AI영화제 그랑프리</li>
          <li>ARFF Paris Finalist</li>
          <li>베를린 영화제 Best AI Creation 부문 Official Finalist (영화 「情 Jeong: The Love that Lingers」)</li>
          <li>Venice · Japan · Miami AI Film Festival 파이널리스트</li>
          <li>유튜브 채널 Korisian · Maison d'Étoile 운영</li>
        </ul>

        <h2>작품 소개</h2>
        <p>대표작 「情 Jeong: The Love that Lingers」를 비롯한 AI 영화·뮤직비디오를 제작했습니다. 감독의 <a href="/about">프로필</a>과 진행 중인 <a href="/lectures">생성형 AI 강의</a>도 함께 살펴보세요.</p>
      </section>`
  }
};

function getRoute(req) {
  try {
    const u = new URL(req.url, 'http://x');
    const q = u.searchParams.get('route');
    if (q && (q === 'home' || ROUTE_CONTENT[q])) return q;
    const p = u.pathname.replace(/\/+$/, '');
    if (p === '/about') return 'about';
    if (p === '/lectures') return 'lectures';
    if (p === '/works') return 'works';
  } catch (e) {}
  return 'home';
}

async function fetchSeoData() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/settings?key=eq.seoData&select=value`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.value || null;
}

// 저장된 seoData가 신구조({home,about,...})면 해당 페이지를, 구구조(평면)면 home일 때만 반환
function pickSeo(all, route) {
  if (!all || typeof all !== 'object') return null;
  const nested = all.home || all.about || all.lectures || all.works;
  if (nested) return all[route] || null;
  return route === 'home' ? all : null; // 레거시 평면 구조 = home
}

module.exports = async function handler(req, res) {
  const route = getRoute(req);
  let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

  let seo = null;
  try { seo = pickSeo(await fetchSeoData(), route); } catch (e) { /* Supabase 장애 시 기본값 */ }

  if (route === 'home') {
    // 홈: 기존 동작 — seoData(home)로 6개 태그 치환, body·canonical은 정적 원본 유지
    if (seo) {
      if (seo.title) html = html.replace(/(<title>)[^<]*(<\/title>)/, (m, a, b) => a + escAttr(seo.title) + b);
      html = setMetaContent(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, seo.title);
      html = setMetaContent(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, seo.title);
      html = setMetaContent(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, seo.metaDesc);
      html = setMetaContent(html, /(<meta\s+name="keywords"\s+content=")[^"]*(")/, seo.keywords);
      html = setMetaContent(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, seo.ogDesc);
      html = setMetaContent(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, seo.twitterDesc);
    }
  } else {
    // /about /lectures /works: 경로별 메타 + body 주입
    const rc = ROUTE_CONTENT[route];
    const title = (seo && seo.title) || rc.title;
    const desc  = (seo && seo.metaDesc) || rc.description;

    if (title) html = html.replace(/(<title>)[^<]*(<\/title>)/, (m, a, b) => a + escAttr(title) + b);
    html = setMetaContent(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, title);
    html = setMetaContent(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, title);
    html = setMetaContent(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, desc);
    html = setMetaContent(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, desc);
    html = setMetaContent(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, desc);
    // canonical + og:url을 자기 자신으로
    html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, (m, a, b) => a + rc.canonical + b);
    html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, (m, a, b) => a + rc.canonical + b);
    // #page-container 정적 body 교체
    html = html.replace(/(<main id="page-container"[^>]*>)[\s\S]*?(<\/main>)/, (m, a, b) => a + '\n' + rc.body + '\n    ' + b);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // CDN 60초 캐시 — admin 저장 후 최대 1분 내 반영. 60초 후 즉시 재검증.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=0');
  res.status(200).send(html);
};
