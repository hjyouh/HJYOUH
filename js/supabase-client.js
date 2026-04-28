// ===== SUPABASE CLIENT =====
const SUPABASE_URL = 'https://croflpzoljrnnanutpsh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gkr1EzfYlAPOqE0oAh3FSw_VpIeV5-Z';

window._sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Supabase에서 데이터 로드 (없으면 localStorage 폴백)
window.sbLoad = async function(key, def) {
  try {
    const { data, error } = await _sb.from('settings').select('value').eq('key', key).single();
    if (!error && data?.value !== undefined) {
      try { localStorage.setItem(key, JSON.stringify(data.value)); } catch(e) {}
      return data.value;
    }
  } catch(e) {}
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return typeof def === 'object' ? JSON.parse(JSON.stringify(def)) : def;
};

// Supabase + localStorage 동시 저장
window.sbSave = async function(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  try {
    const { error } = await _sb.from('settings')
      .upsert({ key, value: val, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    return !error;
  } catch(e) { return false; }
};

// 문의 접수 저장
window.sbSubmitContact = async function(name, email, phone, message) {
  try {
    const { error } = await _sb.from('contact_submissions').insert({ name, email, phone, message });
    return !error;
  } catch(e) { return false; }
};
