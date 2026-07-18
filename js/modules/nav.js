// modules/nav.js
import { state, subscribe } from '../core/state.js';
import { switchLanguage } from './language.js';
import { t } from '../utils/i18n.js';
import { $, $$, createElement, createFocusTrap } from '../utils/dom.js';

let navContainer = null;
let footerContainer = null;
let backdropElement = null;
let menuWrapper = null;
let menuToggle = null;
let focusTrapRelease = null;

/**
 * Initializes the navigation and page shell layout renderer.
 */
export function init() {
  console.log('[Nav Module] Initializing global layout shell...');

  navContainer = $('#site-nav');

  if (!navContainer) {
    console.warn('[Nav Module] Navigation target "#site-nav" not found in DOM.');
    return;
  }

  // 1. Setup Scroll Listener for sticky header style modifications
  setupScrollObserver();

  // 2. Setup scroll-spy to highlight the nav link matching the visible section
  setupScrollSpy();

  // 3. Subscribe to translations state updates
  subscribe('translations', renderHeader);

  // Draw layout assets initially
  renderHeader();
}

/**
 * Observes each top-level content section and highlights the matching
 * nav link as the visitor scrolls, mirroring the "scrollspy" behaviour
 * of modern product docs/marketing sites.
 */
function setupScrollSpy() {
  const sections = $$('main section[id]');
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateActiveLink(entry.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));
}

/**
 * Marks the nav link pointing at the currently active section.
 * Queries fresh each time since renderHeader() rebuilds link nodes
 * whenever the active language changes.
 */
function updateActiveLink(sectionId) {
  if (!navContainer) return;
  const links = $$('.nav-link', navContainer);
  links.forEach(link => {
    const isMatch = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', isMatch);
  });
}

/**
 * Attaches scroll observer to toggle sticky header styling.
 */
function setupScrollObserver() {
  const header = $('#site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  // Run immediately and listen passively to maximize scroll performances
  checkScroll();
  window.addEventListener('scroll', checkScroll, { passive: true });
}

/**
 * Dynamically compiles and appends header navigation structures.
 */
function renderHeader() {
  navContainer.innerHTML = '';

  const activeLang = state.lang;
  const brandName = state.siteData ? state.siteData.name[activeLang] : 'Anas Alrayes';

  // Create site logo anchor link
  const logo = createElement('a', {
    href: '#hero',
    className: 'nav-logo',
    id: 'nav-logo',
    'aria-label': activeLang === 'ar' ? 'أنس الريس - الانتقال للرئيسية' : 'Anas Alrayes - Back to home'
  }, brandName);

  // Ensure mobile menu is reset during changes
  closeMobileMenu();

  // Create mobile hamburger menu trigger button
  menuToggle = createElement('button', {
    className: 'mobile-menu-toggle',
    id: 'mobile-menu-toggle',
    'aria-expanded': 'false',
    'aria-controls': 'nav-menu-wrapper',
    'aria-label': activeLang === 'ar' ? 'تعديل قائمة التنقل' : 'Toggle navigation menu',
    onclick: toggleMobileMenu
  }, [
    createElement('span', { className: 'hamburger-bar' }),
    createElement('span', { className: 'hamburger-bar' }),
    createElement('span', { className: 'hamburger-bar' })
  ]);

  // Create navigation link elements (logo already routes back to #hero)
  const linksList = createElement('ul', { className: 'nav-links' }, [
    createNavLink('#about', activeLang === 'ar' ? 'عني' : 'About'),
    createNavLink('#projects', t('nav.projects')),
    createNavLink('#achievements', t('nav.achievements')),
    createNavLink('#skills', activeLang === 'ar' ? 'المهارات' : 'Skills'),
    createNavLink('#documents', t('nav.documents')),
    createNavLink('#contact', t('nav.contact'))
  ]);

  // Create language toggle switch button
  const altLang = activeLang === 'en' ? 'ar' : 'en';
  const altLangName = activeLang === 'en' ? 'العربية' : 'English';

  const langBtn = createElement('button', {
    className: 'lang-toggle-btn',
    id: 'lang-toggle-btn',
    'aria-label': activeLang === 'en' ? 'تحويل لغة العرض للعربية' : 'Switch UI language to English',
    onclick: () => switchLanguage(altLang)
  }, altLangName);

  // Wrap list items and toggles
  menuWrapper = createElement('div', {
    className: 'nav-menu-wrapper',
    id: 'nav-menu-wrapper'
  }, [linksList, langBtn]);

  // Create transparent blur backdrop overlay if missing
  if (!backdropElement) {
    backdropElement = createElement('div', {
      className: 'nav-backdrop',
      onclick: closeMobileMenu
    });
    document.body.appendChild(backdropElement);
  }

  // Append structures to navigation landmark
  navContainer.appendChild(logo);
  navContainer.appendChild(menuWrapper);
  navContainer.appendChild(menuToggle);

  // Close mobile drawer on navigation click
  $$('.nav-link', menuWrapper).forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Listen for Escape key hits
  document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Creates individual list nav links.
 */
function createNavLink(href, label) {
  return createElement('li', {}, [
    createElement('a', {
      href: href,
      className: 'nav-link'
    }, label)
  ]);
}



/**
 * Toggles the responsive mobile navigation drawer.
 */
function toggleMobileMenu() {
  if (!menuWrapper) return;

  const isNowOpen = menuWrapper.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isNowOpen));

  if (isNowOpen) {
    backdropElement.classList.add('is-visible');
    document.body.style.overflow = 'hidden'; // Lock background scroll page jumps
    focusTrapRelease = createFocusTrap(menuWrapper); // Trapping keyboard navigation
  } else {
    backdropElement.classList.remove('is-visible');
    document.body.style.overflow = '';
    if (focusTrapRelease) {
      focusTrapRelease();
      focusTrapRelease = null;
    }
  }
}

/**
 * Closes the responsive mobile navigation drawer.
 */
function closeMobileMenu() {
  if (menuWrapper && menuWrapper.classList.contains('is-open')) {
    menuWrapper.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    backdropElement.classList.remove('is-visible');
    document.body.style.overflow = '';
    if (focusTrapRelease) {
      focusTrapRelease();
      focusTrapRelease = null;
    }
    // Return key focus context to menu toggle
    if (menuToggle) menuToggle.focus();
  }
}

/**
 * Closes drawer if escape is hit.
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
}

export default { init };
