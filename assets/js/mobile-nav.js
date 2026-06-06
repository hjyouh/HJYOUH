/**
 * mobile-nav.js
 * 모바일 페이지 공용 드로어 메뉴 — 이 파일 하나로 전체 관리
 * 메뉴 추가/수정 시 NAV_ITEMS 배열만 수정하면 됩니다.
 */
(function () {
  /* ========== 메뉴 목록 (여기만 수정하면 전체 반영) ========== */
  const NAV_ITEMS = [
    { href: 'mobile-page.html',    label: 'Home'   },
    { href: 'mobile-강사.html',    label: '강사'   },
    { href: 'mobile-강의.html',    label: '강의'   },
    { href: 'mobile-작업들.html',  label: '작품' },
    { href: 'mobile-프롬프트.html',label: '프롬프트'},
    { href: 'mobile-mv.html',      label: 'M/V'    },
    { href: 'mobile-문의.html',    label: '문의'   },
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

    const WIP_HREFS = ['mobile-프롬프트.html'];
    NAV_ITEMS.forEach(function (item) {
      const a = document.createElement('a');
      if (WIP_HREFS.includes(item.href)) {
        a.href = '#';
        a.style.color = 'rgba(201,169,110,0.45)';
        a.addEventListener('click', function(e) {
          e.preventDefault();
          closeDrawer();
          // 토스트 표시
          const ex = document.getElementById('mobile-wip-toast');
          if (ex) ex.remove();
          const el = document.createElement('div');
          el.id = 'mobile-wip-toast';
          el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);'
            + 'background:rgba(10,10,10,0.88);backdrop-filter:blur(16px);'
            + 'border:1px solid rgba(201,169,110,0.55);border-radius:18px;'
            + 'padding:24px 36px;text-align:center;z-index:9999;pointer-events:none;'
            + "font-family:'Poppins','SUITE',sans-serif;";
          el.innerHTML = '<div style="font-size:28px;margin-bottom:8px">🚧</div>'
            + '<div style="font-size:16px;font-weight:700;color:#c9a96e">작업 중입니다</div>'
            + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:5px">준비 중인 페이지입니다</div>';
          document.body.appendChild(el);
          setTimeout(function() { el.style.transition='opacity 0.4s'; el.style.opacity='0'; setTimeout(function(){el.remove();},420); }, 2200);
        });
      } else {
        a.href = item.href;
      }
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
