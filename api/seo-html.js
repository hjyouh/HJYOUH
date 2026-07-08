// ===== SEO HTML 서버 렌더링 =====
// vercel.json의 rewrite에 의해 "/" 와 "/index.html" 요청이 이 함수로 들어온다.
// 정적 index.html을 읽고, Supabase settings 테이블의 seoData 값으로
// <meta> 태그를 치환해 원본 HTML 응답에 포함시킨다.
// → JS를 실행하지 않는 OG 스크래퍼(카카오·페이스북·X)와 view-source에서도 새 값이 보인다.

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

async function fetchSeoData() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/settings?key=eq.seoData&select=value`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.value || null;
}

module.exports = async function handler(req, res) {
  let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

  try {
    const d = await fetchSeoData();
    if (d) {
      // 타이틀 3종(<title>, og:title, twitter:title)은 seoData.title 하나로 통일
      if (d.title) {
        html = html.replace(/(<title>)[^<]*(<\/title>)/, (m, a, b) => a + escAttr(d.title) + b);
      }
      html = setMetaContent(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, d.title);
      html = setMetaContent(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, d.title);
      html = setMetaContent(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, d.metaDesc);
      html = setMetaContent(html, /(<meta\s+name="keywords"\s+content=")[^"]*(")/, d.keywords);
      html = setMetaContent(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, d.ogDesc);
      html = setMetaContent(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, d.twitterDesc);
    }
  } catch (e) {
    // Supabase 장애 시 정적 HTML 원본 그대로 응답
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // CDN 60초 캐시 — admin 저장 후 최대 1분 내 반영.
  // stale-while-revalidate=0: 60초 후에는 옛 응답을 재사용하지 않고 즉시 재검증한다.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=0');
  res.status(200).send(html);
};
