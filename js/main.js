/**
 * Hyungjae Youh Portfolio - Main Router & Common Functions
 * Created: 2026-04-16
 */

// ===== CONSTANTS =====
const PAGES = {
  home: { path: 'pages/home.html', title: 'Home' },
  about: { path: 'pages/about.html', title: '강사' },
  lectures: { path: 'pages/lectures.html', title: 'Lectures' },
  works: { path: 'pages/works.html', title: 'Works' },
  prompts: { path: 'pages/prompts.html', title: '프롬프트' },
  mv:      { path: 'pages/mv.html',      title: 'M/V'     },
  contact: { path: 'pages/contact.html', title: 'Contact' }
};

const INSTRUCTOR_DATA = {
  name: '유형재',
  nameEng: 'Hyungjae Youh',
  title: '생성형 AI Creator 강사',
  company: '(주)포인트넥스트 대표이사',
  institute: '디지털융합교육원 지도교수',
  address: '서울 서초구 강남대로 53길 8, 8-25호',
  phone: '010-3558-6960',
  email: 'hjyouh@naver.com',
  website: 'https://aitalker.co.kr/hjyouh/',
  rating: 4.9,
  students: 200
};

// ===== STATE MANAGEMENT =====
let appState = {
  currentPage: 'home',
  menuOpen: false,
  selectedLecture: null,
  selectedWork: null
};

// ===== DOM ELEMENTS =====
let elements = {
  app: null,
  header: null,
  nav: null,
  mobileNav: null,
  hamburger: null,
  logo: null,
  pageContainer: null,
  modal: null,
  modalContent: null,
  modalClose: null
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  loadPage('home');
  initializeHeaderScroll();
  // defer 스크립트 실행 순서상 sbLoad는 이미 정의됨 — 직접 호출
  syncPromptsActiveState();
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
  elements.app = document.getElementById('app');
  elements.header = document.querySelector('header');
  elements.nav = document.querySelector('nav.desktop-nav');
  elements.mobileNav = document.querySelector('nav.mobile-nav');
  elements.hamburger = document.querySelector('.hamburger');
  elements.logo = document.querySelector('.logo');
  elements.pageContainer = document.getElementById('page-container');
  elements.modal = document.getElementById('modal');
  elements.modalContent = document.querySelector('.modal-content');
  elements.modalClose = document.querySelector('.modal-close');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Header logo click
  if (elements.logo) {
    elements.logo.addEventListener('click', () => navigateTo('home'));
  }

  // Desktop navigation
  if (elements.nav) {
    elements.nav.querySelectorAll('a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) navigateTo(page);
      });
    });
    // WIP 페이지 nav 시각적 비활성화 (동적)
    applyNavWipStyles();
  }

  // Mobile hamburger
  if (elements.hamburger) {
    elements.hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Mobile navigation
  if (elements.mobileNav) {
    elements.mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          navigateTo(page);
          closeMobileMenu();
        }
      });
    });
  }

  // Modal close
  if (elements.modalClose) {
    elements.modalClose.addEventListener('click', closeModal);
  }

  // Modal background click
  if (elements.modal) {
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) closeModal();
    });
  }

  // Prevent modal scroll
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modal?.classList.contains('active')) {
      closeModal();
    }
  });
}

// ===== NAVIGATION & ROUTING =====

/* ── 작업 중인 페이지 (차단 목록) — 낙관적 초기값: 비어있음 ── */
let UNDER_CONSTRUCTION = [];

async function syncPromptsActiveState() {
  try {
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem('pageMsgPrompts') || '{}'); } catch(e) {}
    if (window.sbLoad) {
      const cloud = await window.sbLoad('pageMsgPrompts', {});
      if (cloud && typeof cloud === 'object') cfg = cloud;
    }
    const anyActive = cfg.imageActive !== false || cfg.videoActive !== false || cfg.etcActive !== false;
    if (anyActive) {
      UNDER_CONSTRUCTION = UNDER_CONSTRUCTION.filter(p => p !== 'prompts');
    } else {
      if (!UNDER_CONSTRUCTION.includes('prompts')) UNDER_CONSTRUCTION.push('prompts');
      applyNavWipStyles();
    }
  } catch(e) {}
}

function applyNavWipStyles() {
  if (elements.nav) {
    elements.nav.querySelectorAll('a[data-page]').forEach(link => {
      if (UNDER_CONSTRUCTION.includes(link.dataset.page)) {
        link.style.color = 'rgba(255,255,255,0.28)';
        link.style.cursor = 'default';
        link.title = '준비 중입니다';
      } else {
        link.style.color = '';
        link.style.cursor = '';
        link.title = '';
      }
    });
  }
  // home 사이드 카드 뱃지 동기화
  document.querySelectorAll('.side-card[data-nav]').forEach(card => {
    const nav = card.getAttribute('data-nav');
    const shouldBeWip = UNDER_CONSTRUCTION.includes(nav);
    let wipEl = card.querySelector('.side-card-wip');
    if (shouldBeWip && !wipEl) {
      wipEl = document.createElement('span');
      wipEl.className = 'side-card-wip';
      wipEl.textContent = '🚧 작업중';
      card.appendChild(wipEl);
    } else if (!shouldBeWip && wipEl) {
      wipEl.remove();
    }
  });
}

function showConstructionMsg() {
  const existing = document.getElementById('construction-toast');
  if (existing) { existing.remove(); }
  const el = document.createElement('div');
  el.id = 'construction-toast';
  el.style.cssText = [
    'position:fixed','top:50%','left:50%','transform:translate(-50%,-50%)',
    'background:rgba(12,12,12,0.93)','backdrop-filter:blur(18px)',
    '-webkit-backdrop-filter:blur(18px)',
    'border:1px solid rgba(201,169,110,0.55)','border-radius:18px',
    'padding:28px 40px','text-align:center','z-index:9999',
    'color:#fff',"font-family:'Poppins','SUITE',sans-serif",
    'box-shadow:0 10px 48px rgba(0,0,0,0.7)','pointer-events:none'
  ].join(';');
  el.innerHTML = '<div style="font-size:30px;margin-bottom:10px">🚧</div>'
    + '<div style="font-size:17px;font-weight:700;color:#c9a96e">작업 중입니다</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.45);margin-top:6px">준비 중인 페이지입니다</div>';
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 420);
  }, 2400);
}

/**
 * Navigate to a page
 */
function navigateTo(pageName) {
  if (UNDER_CONSTRUCTION.includes(pageName)) {
    showConstructionMsg();
    return;
  }
  if (!PAGES[pageName]) {
    console.error(`Page not found: ${pageName}`);
    return;
  }

  appState.currentPage = pageName;
  loadPage(pageName);
  updateActiveNav(pageName);
  // No scroll - fullscreen design
}

/**
 * Load page content
 */
function loadPage(pageName) {
  const pageData = PAGES[pageName];
  if (!pageData) {
    console.error(`Page data not found for: ${pageName}`);
    return;
  }

  const pagePath = pageData.path;
  console.log(`Loading page: ${pageName} from: ${pagePath}`);

  // Get current URL to calculate correct path
  const currentUrl = window.location.href;
  const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));

  // contact 페이지 진입 시 EmailJS 지연 로드
  if (pageName === 'contact' && !window._emailjsLoaded) {
    window._emailjsLoaded = true;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    document.head.appendChild(s);
  }

  fetch(pagePath + '?v=23')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load ${pageName}`);
      return response.text();
    })
    .then(html => {
      if (elements.pageContainer) {
        elements.pageContainer.innerHTML = html;
        document.title = `${pageData.title} | 유형재 강사 포트폴리오`;

        // Re-execute inline scripts (innerHTML does not auto-execute scripts)
        elements.pageContainer.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
          document.body.removeChild(newScript);
        });

        // Initialize page-specific scripts
        initializePage(pageName);
      }
    })
    .catch(error => {
      console.error(`Error loading page "${pageName}":`, error.message);
      console.error('Full error:', error);

      if (elements.pageContainer) {
        elements.pageContainer.innerHTML = `
          <div style="color: #a0a0a0; padding: 100px 20px; text-align: center;">
            <p>페이지를 불러올 수 없습니다.</p>
            <p style="font-size: 12px; margin-top: 10px; color: #666;">
              Error: ${error.message}<br>
              Path: ${pagePath}
            </p>
          </div>
        `;
      }
    });
}

/**
 * Initialize page-specific functionality
 */
function initializePage(pageName) {
  // Each page can have its own init function
  const initFunction = window[`init${capitalize(pageName)}Page`];
  if (typeof initFunction === 'function') {
    initFunction();
  }

  // Dispatch custom event for page change
  window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
}

/**
 * Update active navigation link
 */
function updateActiveNav(pageName) {
  // Desktop nav
  if (elements.nav) {
    elements.nav.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageName);
      // WIP 링크는 항상 색상 비활성화 유지
      if (UNDER_CONSTRUCTION.includes(link.dataset.page)) {
        link.style.color = 'rgba(255,255,255,0.28)';
        link.style.cursor = 'default';
      } else {
        if (link.dataset.page !== pageName) link.style.color = '';
        link.style.cursor = '';
      }
    });
  }

  // Mobile nav
  if (elements.mobileNav) {
    elements.mobileNav.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageName);
    });
  }
}

// ===== MOBILE MENU =====

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  appState.menuOpen = !appState.menuOpen;

  if (elements.hamburger) {
    elements.hamburger.classList.toggle('active', appState.menuOpen);
  }

  if (elements.mobileNav) {
    elements.mobileNav.classList.toggle('active', appState.menuOpen);
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  appState.menuOpen = false;

  if (elements.hamburger) {
    elements.hamburger.classList.remove('active');
  }

  if (elements.mobileNav) {
    elements.mobileNav.classList.remove('active');
  }
}

// ===== HEADER SCROLL EFFECT =====

/**
 * Initialize header scroll effect
 */
function initializeHeaderScroll() {
  window.addEventListener('scroll', () => {
    if (elements.header) {
      const isScrolled = window.scrollY > 50;
      elements.header.classList.toggle('scrolled', isScrolled);
    }
  });
}

// ===== MODAL MANAGEMENT =====

/**
 * Open modal with content
 */
function openModal(content) {
  if (!elements.modal) return;

  if (typeof content === 'string') {
    if (elements.modalContent) {
      elements.modalContent.innerHTML = content;
    }
  } else if (content instanceof HTMLElement) {
    if (elements.modalContent) {
      elements.modalContent.innerHTML = '';
      elements.modalContent.appendChild(content.cloneNode(true));
    }
  }

  elements.modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
  if (!elements.modal) return;

  elements.modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== UTILITY FUNCTIONS =====

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

/**
 * Format date
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('ko-KR', options);
}

/**
 * Get instructor data
 */
function getInstructorData() {
  return { ...INSTRUCTOR_DATA };
}

/**
 * Send email via EmailJS (placeholder)
 */
async function sendEmail(formData) {
  try {
    // Initialize EmailJS (requires service setup)
    // emailjs.init('YOUR_PUBLIC_KEY');

    // const response = await emailjs.send(
    //   'YOUR_SERVICE_ID',
    //   'YOUR_TEMPLATE_ID',
    //   formData
    // );

    // For now, use a placeholder implementation
    console.log('Email data:', formData);

    // Store in localStorage as backup
    const emails = JSON.parse(localStorage.getItem('pending_emails') || '[]');
    emails.push({
      ...formData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pending_emails', JSON.stringify(emails));

    return { success: true, message: '문의가 접수되었습니다.' };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, message: '문의 전송 중 오류가 발생했습니다.' };
  }
}

/**
 * Get stored data from localStorage
 */
function getStoredData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 */
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Create element with attributes and content
 */
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'style') {
      Object.assign(element.style, value);
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });

  if (content) {
    if (typeof content === 'string') {
      element.innerHTML = content;
    } else {
      element.appendChild(content);
    }
  }

  return element;
}

/**
 * Query selector shorthand
 */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query selector all shorthand
 */
function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Add event delegation
 */
function on(selector, event, callback) {
  document.addEventListener(event, (e) => {
    if (e.target.matches(selector)) {
      callback.call(e.target, e);
    }
  });
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => observer.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

/**
 * Smooth scroll to element
 */
function smoothScroll(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('복사되었습니다.', 'success');
  }).catch(() => {
    showNotification('복사 실패', 'error');
  });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info', duration = 3000) {
  const toast = createElement('div', {
    class: `notification notification-${type}`,
    style: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '8px',
      zIndex: 9999,
      animation: 'slideUp 0.3s ease forwards',
      fontSize: '14px'
    }
  }, message);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Validate email
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone
 */
function validatePhone(phone) {
  const re = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return re.test(phone.replace(/\s/g, ''));
}

// ===== EVENT LISTENERS FOR PAGE CHANGES =====

/**
 * Listen for page changes
 */
window.addEventListener('pageChanged', (e) => {
  closeMobileMenu();
  lazyLoadImages();
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    navigateTo,
    openModal,
    closeModal,
    getInstructorData,
    sendEmail,
    formatPhoneNumber,
    formatDate,
    validateEmail,
    validatePhone
  };
}
