// ===== SEO META 자동 반영 =====
// 관리자 패널(SEO / 메타태그)에서 저장한 seoData를 읽어
// 페이지의 <meta> 태그에 반영한다.
// 주의: 카카오·페이스북·X 등 소셜 크롤러는 JS를 실행하지 않으므로
// OG/Twitter 공유 미리보기는 HTML에 직접 반영해야 한다 (admin의 "HTML 복사" 사용).
(async function() {
  if (!window.sbLoad) return;
  try {
    const raw = await sbLoad('seoData', null);
    if (!raw) return;
    // 신구조({home,about,...})면 home을, 레거시 평면 구조면 그대로 사용
    const d = (raw.home || raw.about || raw.lectures || raw.works) ? raw.home : raw;
    if (!d) return;

    function setMeta(selector, content) {
      if (!content) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    }

    setMeta('meta[name="description"]',            d.metaDesc);
    setMeta('meta[name="keywords"]',               d.keywords);
    setMeta('meta[property="og:description"]',     d.ogDesc);
    setMeta('meta[name="twitter:description"]',    d.twitterDesc);
  } catch(e) {}
})();
