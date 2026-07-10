// ===== 방문 기록 수집 =====
// 클라이언트가 페이지 로드/SPA 전환 시 POST /api/track?path=...&ref=... 로 호출한다.
// 이 함수가 서버측에서 UA(봇 필터·기기 판정)와 Vercel geo 헤더(국가)를 읽어 Supabase에 기록한다.
//
// [기록 방식 판단] 클라이언트 → 서버리스 함수 방식을 택함:
//  - 이 사이트는 SPA라 최초 로드 외 라우트 전환(/lectures 등)은 서버에 HTML 요청을 보내지 않는다.
//    따라서 api/seo-html.js(서버 렌더)에서 기록하면 SPA 내부 이동을 전부 놓친다.
//  - 클라이언트 호출은 최초 진입 + 모든 SPA 전환마다 발생해 실제 방문 흐름을 잡는다.
//  - 봇은 대개 JS를 실행하지 않아 자연 제외 + UA 필터로 이중 차단.
//  - 국가(x-vercel-ip-country)와 UA는 이 함수 요청 헤더에 그대로 들어와 서버측에서 신뢰성 있게 취득.
//
// [referrer 분류 시점] 저장은 '원본 referrer 그대로', 분류(구글/네이버/…)는 '조회 시점'에 한다:
//  - 분류 규칙이 바뀌어도 재마이그레이션 없이 과거 데이터에 소급 적용 가능.
//  - 원본 손실 없이 유연. (대시보드 작업에서 분류)

const SUPABASE_URL = 'https://croflpzoljrnnanutpsh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gkr1EzfYlAPOqE0oAh3FSw_VpIeV5-Z';

// 봇/크롤러/헤드리스 UA (대소문자 무시)
const BOT_RE = /bot|crawler|spider|crawl|slurp|googlebot|bingbot|yandex|baidu|duckduck|facebookexternalhit|headless|phantom|puppeteer|playwright|lighthouse|chrome-lighthouse|pingdom|uptime|monitor|curl|wget|python-requests|axios|okhttp|go-http|java\/|scrapy|semrush|ahrefs|mj12|dotbot|petalbot|applebot|preview|whatsapp|telegrambot|discordbot|embedly/i;

function isBot(ua) {
  if (!ua) return true;               // UA 없음 → 봇 취급
  return BOT_RE.test(ua);
}

function detectDevice(uaRaw) {
  const ua = (uaRaw || '').toLowerCase();
  // 태블릿 먼저 판정 (Android 태블릿은 'Mobile' 토큰이 없음)
  if (/ipad|playbook|silk|kindle|tablet|(android(?!.*mobile))/.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|blackberry|iemobile|opera mini|android/.test(ua)) return 'mobile';
  return 'desktop';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method !== 'POST') { res.status(405).end(); return; }

    const ua = req.headers['user-agent'] || '';
    if (isBot(ua)) { res.status(204).end(); return; }   // 봇 → 기록 안 함

    const u = new URL(req.url, 'http://x');
    const path = (u.searchParams.get('path') || '').slice(0, 512);
    if (!path) { res.status(204).end(); return; }
    const referrer = u.searchParams.get('ref');
    const device = detectDevice(ua);
    const country = req.headers['x-vercel-ip-country'] || null;

    // 서버리스는 응답 후 실행이 동결될 수 있으므로 insert를 await 한다.
    // (클라이언트 호출 자체가 fire-and-forget이라 이 지연은 페이지에 영향 없음)
    await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'        // anon은 SELECT 불가 → 반환 최소화 필수
      },
      body: JSON.stringify({
        path,
        referrer: referrer ? String(referrer).slice(0, 1024) : null,
        user_agent: ua.slice(0, 512),
        device,
        country
      })
    }).catch(() => {});                 // 실패해도 조용히 무시

    res.status(204).end();
  } catch (e) {
    res.status(204).end();              // 어떤 오류든 조용히 204
  }
};
