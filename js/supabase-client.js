// ===== SUPABASE CLIENT (경량) =====
// 공개 페이지 성능: 초기 렌더에 필요한 읽기(sbLoad)/쓰기(sbSave·sbSubmitContact)는
// supabase-js UMD(206KB) 없이 REST fetch로 처리한다. → 공개 페이지에서 UMD를 로드하지 않음.
// Storage 업로드(sbUploadImage, 어드민 전용)만 UMD가 필요하므로 그때 지연 로드한다.
const SUPABASE_URL = 'https://croflpzoljrnnanutpsh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gkr1EzfYlAPOqE0oAh3FSw_VpIeV5-Z';

const SB_HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

// 어드민 등 UMD가 이미 로드된 페이지에서는 기존처럼 window._sb 를 제공 (직접 _sb.from() 사용 호환)
if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
  window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// UMD가 필요할 때(Storage 업로드)만 지연 로드해 클라이언트 생성
let _sbClientPromise = null;
async function ensureSbClient() {
  if (window._sb) return window._sb;
  if (!_sbClientPromise) {
    _sbClientPromise = (async () => {
      if (typeof window.supabase === 'undefined') {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      return window._sb;
    })();
  }
  return _sbClientPromise;
}

// ===== settings 통합 캐시 =====
// 앱 시작 시 settings 테이블을 1회 전체 조회해 메모리에 캐시한다.
// 이후 sbLoad(key)는 캐시를 재사용 → 페이지 전환마다 반복 쿼리하지 않음.
// TTL(5분) 경과 또는 페이지 새로고침 시 갱신. sbSave는 캐시를 즉시 갱신.
const SETTINGS_TTL_MS = 5 * 60 * 1000;
let _settingsCache = null;     // { key: value }
let _settingsCacheAt = 0;
let _settingsPromise = null;   // 동시 호출 dedup

function _loadAllSettings() {
  if (_settingsCache && (Date.now() - _settingsCacheAt < SETTINGS_TTL_MS)) return Promise.resolve(_settingsCache);
  if (_settingsPromise) return _settingsPromise;
  _settingsPromise = (async () => {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=key,value`, { headers: SB_HEADERS });
      if (r.ok) {
        const rows = await r.json();
        const map = {};
        for (const row of rows) map[row.key] = row.value;
        _settingsCache = map;
        _settingsCacheAt = Date.now();
        try { for (const k in map) localStorage.setItem(k, JSON.stringify(map[k])); } catch(e) {}
      }
    } catch(e) {}
    _settingsPromise = null;
    return _settingsCache || {};
  })();
  return _settingsPromise;
}

// 캐시 강제 무효화(어드민 저장 후 등)
window.sbInvalidateSettings = function() { _settingsCache = null; _settingsCacheAt = 0; };

// Supabase settings 읽기 — 통합 캐시 사용, 폴백은 localStorage
window.sbLoad = async function(key, def) {
  try {
    const all = await _loadAllSettings();
    if (all && all[key] !== undefined) return all[key];
  } catch(e) {}
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return (typeof def === 'object' && def !== null) ? JSON.parse(JSON.stringify(def)) : def;
};

// Supabase settings 저장 (REST upsert) + localStorage 동시 저장
window.sbSave = async function(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  if (_settingsCache) _settingsCache[key] = val;   // 캐시 즉시 갱신(어드민 편집 반영)
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/settings?on_conflict=key`, {
      method: 'POST',
      headers: { ...SB_HEADERS, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ key, value: val, updated_at: new Date().toISOString() })
    });
    if (!r.ok) { console.error('[Supabase] save error:', key, r.status); return false; }
    return true;
  } catch(e) { console.error('[Supabase] save exception:', key, e); return false; }
};

// 이미지 → Supabase Storage 업로드 → 공개 URL (어드민 전용, UMD 지연 로드)
window.sbUploadImage = async function(file, folder) {
  try {
    const sb = await ensureSbClient();
    const safeName = Date.now() + '_' + file.name.replace(/[^\w.\-]/g, '_');
    const path = folder ? `${folder}/${safeName}` : safeName;
    const { error } = await sb.storage.from('work').upload(path, file, { cacheControl: '3600', upsert: true });
    if (error) { console.error('[Supabase Storage] upload error:', error.message); return null; }
    const { data } = sb.storage.from('work').getPublicUrl(path);
    return data.publicUrl;
  } catch(e) { console.error('[Supabase Storage] upload exception:', e); return null; }
};

// 문의 접수 저장 (REST insert)
window.sbSubmitContact = async function(name, email, phone, message) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: { ...SB_HEADERS, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ name, email, phone, message })
    });
    return r.ok;
  } catch(e) { return false; }
};
