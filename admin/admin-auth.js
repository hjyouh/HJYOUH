/* ════════════════════════════════════════
   admin-auth.js  —  회원/인증 유틸리티
   localStorage 기반 (프론트 전용)
   ════════════════════════════════════════ */

const AUTH = {
  USERS:   'adminUsers',
  SESSION: 'adminSession',
  AUTO:    'adminAutoSession',
  RESET:   'adminResetTokens'
};

/* ── 비밀번호 인코딩 (base64 obfuscation) ── */
function _enc(pw) { return btoa(encodeURIComponent(pw)); }
function _dec(h)  {
  try { return decodeURIComponent(atob(h)); } catch { return ''; }
}

/* ── 기본 슈퍼 관리자 초기화 ── */
function initUsers() {
  const now = new Date().toISOString();

  const SUPER_DEFAULTS = [
    {
      id: 'usr_admin', loginId: 'admin', name: '유형재',
      password: _enc('inni1!inni'), email: 'hjyouh@naver.com',
      phone: '010-3558-6960', role: 'super', createdAt: now
    },
    {
      id: 'usr_hjyouh', loginId: 'hjyouh', name: '유형재',
      password: _enc('inni1!inni'), email: 'hjyouh@naver.com',
      phone: '010-3558-6960', role: 'super', createdAt: now
    }
  ];

  const raw = localStorage.getItem(AUTH.USERS);
  if (!raw) {
    localStorage.setItem(AUTH.USERS, JSON.stringify(SUPER_DEFAULTS));
    return;
  }

  /* 마이그레이션: 구형 기본값(name=관리자, hjyouh 미존재) 감지 후 교정 */
  let users = JSON.parse(raw);
  let changed = false;

  SUPER_DEFAULTS.forEach(def => {
    const idx = users.findIndex(u => u.loginId === def.loginId);
    if (idx < 0) {
      users.push(def);
      changed = true;
    } else {
      const u = users[idx];
      if (u.name === '관리자' || !u.email || u.role !== 'super') {
        users[idx] = { ...u, name: def.name, email: def.email, phone: def.phone, role: 'super' };
        changed = true;
      }
    }
  });

  if (changed) localStorage.setItem(AUTH.USERS, JSON.stringify(users));
}

/* ── 사용자 CRUD ── */
function getUsers() {
  initUsers();
  try { return JSON.parse(localStorage.getItem(AUTH.USERS) || '[]'); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(AUTH.USERS, JSON.stringify(users));
}

function addUser(data) {
  const users = getUsers();
  // 중복 ID 확인
  if (users.find(u => u.loginId === data.loginId)) return { ok: false, msg: '이미 사용 중인 아이디입니다.' };
  users.push({
    id:        'usr_' + Date.now() + Math.random().toString(36).substr(2,4),
    loginId:   data.loginId,
    name:      data.name,
    password:  _enc(data.password),
    email:     data.email  || '',
    phone:     data.phone  || '',
    role:      data.role   || 'user',
    createdAt: new Date().toISOString()
  });
  saveUsers(users);
  return { ok: true };
}

function updateUser(id, data) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx < 0) return { ok: false, msg: '사용자를 찾을 수 없습니다.' };
  // 중복 ID 확인 (자기 자신 제외)
  if (data.loginId && users.find(u => u.loginId === data.loginId && u.id !== id))
    return { ok: false, msg: '이미 사용 중인 아이디입니다.' };
  if (data.loginId) users[idx].loginId = data.loginId;
  if (data.name)    users[idx].name    = data.name;
  if (data.password) users[idx].password = _enc(data.password);
  if (data.email  !== undefined) users[idx].email = data.email;
  if (data.phone  !== undefined) users[idx].phone = data.phone;
  if (data.role)  users[idx].role = data.role;
  saveUsers(users);
  return { ok: true };
}

function deleteUser(id) {
  const users = getUsers().filter(u => u.id !== id);
  saveUsers(users);
}

/* ── 로그인 / 로그아웃 / 세션 ── */
function authLogin(loginId, password, autoLogin) {
  const users = getUsers();
  const user  = users.find(u => u.loginId === loginId && u.password === _enc(password));
  if (!user) return null;
  const session = { id: user.id, loginId: user.loginId, name: user.name, role: user.role };
  sessionStorage.setItem(AUTH.SESSION, JSON.stringify(session));
  if (autoLogin) localStorage.setItem(AUTH.AUTO, JSON.stringify(session));
  else           localStorage.removeItem(AUTH.AUTO);
  return session;
}

function authLogout() {
  sessionStorage.removeItem(AUTH.SESSION);
  localStorage.removeItem(AUTH.AUTO);
  window.location.href = 'login.html';
}

function getSession() {
  const raw = sessionStorage.getItem(AUTH.SESSION) || localStorage.getItem(AUTH.AUTO);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/* 세션 없으면 로그인 페이지로 리다이렉트 */
function requireAuth() {
  const s = getSession();
  if (!s) { window.location.href = 'login.html'; return null; }
  return s;
}

/* ── 비밀번호 재설정 토큰 ── */
function generateResetToken(email) {
  const users = getUsers();
  const user  = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const token  = Math.random().toString(36).substr(2, 8).toUpperCase();
  const expiry = Date.now() + 30 * 60 * 1000; // 30분

  const tokens = JSON.parse(localStorage.getItem(AUTH.RESET) || '{}');
  tokens[token] = { userId: user.id, expiry };
  localStorage.setItem(AUTH.RESET, JSON.stringify(tokens));

  return { token, user };
}

function generateResetTokenById(userId) {
  const users = getUsers();
  const user  = users.find(u => u.id === userId);
  if (!user) return null;

  const token  = Math.random().toString(36).substr(2, 8).toUpperCase();
  const expiry = Date.now() + 30 * 60 * 1000;

  const tokens = JSON.parse(localStorage.getItem(AUTH.RESET) || '{}');
  tokens[token] = { userId: user.id, expiry };
  localStorage.setItem(AUTH.RESET, JSON.stringify(tokens));

  return { token, user };
}

function verifyResetToken(token) {
  const tokens = JSON.parse(localStorage.getItem(AUTH.RESET) || '{}');
  const data   = tokens[token.toUpperCase()];
  if (!data || Date.now() > data.expiry) return null;
  return data;
}

function resetPasswordByToken(token, newPw) {
  const data = verifyResetToken(token);
  if (!data) return false;

  const users = getUsers();
  const idx   = users.findIndex(u => u.id === data.userId);
  if (idx < 0) return false;

  users[idx].password = _enc(newPw);
  saveUsers(users);

  const tokens = JSON.parse(localStorage.getItem(AUTH.RESET) || '{}');
  delete tokens[token.toUpperCase()];
  localStorage.setItem(AUTH.RESET, JSON.stringify(tokens));
  return true;
}

/* ── 권한 레이블 ── */
function roleLabel(role) {
  return { super: '슈퍼관리자', admin: '관리자', user: '일반회원' }[role] || role;
}
function roleBadgeClass(role) {
  return { super: 'badge-gold', admin: 'badge-gold', user: 'badge-dim' }[role] || 'badge-dim';
}
