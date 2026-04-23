/**
 * mobile-nav.js
 * 모바일 페이지 공용 드로어 메뉴 — 이 파일 하나로 전체 관리
 * 메뉴 추가/수정 시 NAV_ITEMS 배열만 수정하면 됩니다.
 */
(function () {
  /* ========== 메뉴 목록 (여기만 수정하면 전체 반영) ========== */
  const NAV_ITEMS = [
    { href: 'mobile-page.html',   label: 'Home'   },
    { href: 'mobile-강사.html',   label: '강사'   },
    { href: 'mobile-강의.html',   label: '강의'   },
    { href: 'mobile-작업들.html', label: '작업들' },
    { href: 'mobile-문의.html',   label: '문의'   },
  ];
  /* ========================================================== */

  const currentPage = window.location.pathname.split('/').pop() || 'mobile-page.html';

  /* ----- CSS 주입 ----- */
  const style = document.createElement('style');
  style.textContent = `
    .drawer-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 998;
    }
    .drawer-overlay.open { display: block; }

    .drawer {
      position: fixed;
      top: 0; right: 0;
      width: 120px;
      box-sizing: border-box;
      height: 100%;
      background: rgba(5,5,5,0.18);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      z-index: 999;
      padding: 56px 16px;
      transform: translateX(100%);
      transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
    }
    .drawer.open { transform: translateX(0); }

    .drawer a {
      display: block;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 16px;
      margin-bottom: 14px;
      font-family: 'Poppins', 'Noto Sans KR', sans-serif;
      transition: color 0.15s;
    }
    .drawer a.nav-active { color: #c9a96e; }
    .drawer a:hover { color: #fff; }

    .drawer-close {
      position: absolute;
      top: 16px; right: 14px;
      font-size: 15px;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      background: none;
      border: none;
      line-height: 1;
    }
  `;
  document.head.appendChild(style);

  /* ----- HTML 주입 (body 로드 후 실행 보장) ----- */
  function injectNav() {
    /* 오버레이 */
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.id = 'drawerOverlay';
    overlay.addEventListener('click', closeDrawer);

    /* 드로어 */
    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.id = 'drawer';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'drawer-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', closeDrawer);
    drawer.appendChild(closeBtn);

    NAV_ITEMS.forEach(function (item) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.href === currentPage) a.classList.add('nav-active');
      drawer.appendChild(a);
    });

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }

  /* ----- 전역 함수 ----- */
  window.openDrawer = function () {
    const el = document.getElementById('drawer');
    const ov = document.getElementById('drawerOverlay');
    if (!el || !ov) return;

    if (window.innerWidth > 430) {
      const offset = Math.floor((window.innerWidth - 390) / 2) + 10;
      el.style.right = offset + 'px';
      ov.style.right = (offset + 120) + 'px';
    } else {
      el.style.right = '0';
      ov.style.right = '120px';
    }
    el.classList.add('open');
    ov.classList.add('open');
  };

  window.closeDrawer = function () {
    const el = document.getElementById('drawer');
    const ov = document.getElementById('drawerOverlay');
    if (el) el.classList.remove('open');
    if (ov) ov.classList.remove('open');
  };

})();
