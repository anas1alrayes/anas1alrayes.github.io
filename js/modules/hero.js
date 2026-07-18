// modules/hero.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

let heroContainer = null;

/**
 * Initializes the Hero module.
 */
export function init() {
  console.log('[Hero Module] Initializing hero...');
  heroContainer = $('#hero');

  if (!heroContainer) {
    console.warn('[Hero Module] Target container "#hero" not found.');
    return;
  }

  heroContainer.className = 'hero-section';

  subscribe('translations', renderHero);
  renderHero();
}

/**
 * Renders the localized Hero layout.
 * A huge headline, a short bio, a strong CTA pair, and a single scannable
 * meta line replace the old two-column sidebar layout entirely. A profile
 * photo is rendered automatically if `siteData.photo` is provided.
 */
function renderHero() {
  if (!heroContainer) return;
  heroContainer.innerHTML = '';

  const activeLang = state.lang;
  const siteData = state.siteData;

  if (!siteData) {
    console.warn('[Hero Module] Cannot compile hero layout: siteData is missing from state.');
    return;
  }

  const nameText = siteData.name[activeLang] || 'Anas Alrayes';
  const roleText = siteData.title[activeLang] || '';
  const bioText = siteData.heroIntro[activeLang] || '';
  const ctaProjectsText = t('hero.cta.projects');
  const ctaCvText = t('hero.cta.cv_text');
  const availabilityText = t('hero.value.availability');
  const cvPath = `assets/documents/resume-${activeLang}.pdf`;

  const badge = createElement('div', { className: 'hero-badge pill-badge', 'data-reveal': '' }, [
    createElement('span', { className: 'pill-badge-dot' }),
    availabilityText
  ]);

  const heading = createElement('h1', {
    className: 'hero-name',
    id: 'hero-title',
    'data-reveal': ''
  }, nameText);

  const role = createElement('p', { className: 'hero-role', 'data-reveal': '' }, roleText);
  const bio = createElement('p', { className: 'hero-bio', 'data-reveal': '' }, bioText);

  const ctaPrimary = createElement('a', { href: '#projects', className: 'btn-primary' }, [
    ctaProjectsText,
    icon('arrowRight', 'icon icon-sm mirror-rtl')
  ]);

  const ctaSecondary = createElement('a', {
    href: cvPath,
    className: 'btn-secondary',
    target: '_blank',
    rel: 'noopener noreferrer'
  }, [
    icon('download', 'icon icon-sm'),
    ctaCvText
  ]);

  const actions = createElement('div', { className: 'hero-actions', 'data-reveal': '' }, [ctaPrimary, ctaSecondary]);

  const metaRow = createElement('div', { className: 'hero-meta-row', 'data-reveal': '' }, [
    createMetaItem('pin', siteData.contact.location[activeLang]),
    createMetaItem('cap', t('hero.value.education')),
    createMetaItem('target', t('hero.value.focus'))
  ]);

  const textCol = createElement('div', { className: 'hero-text' }, [
    badge, heading, role, bio, actions, metaRow
  ]);

  const photoUrl = siteData.photo;
  let heroInner;

  if (photoUrl) {
    const photoCol = createElement('div', { className: 'hero-photo-col', 'data-reveal': '' }, [
      createElement('div', { className: 'hero-photo-frame' }, [
        createElement('img', { src: photoUrl, alt: nameText, className: 'hero-photo' })
      ]),
      createElement('div', { className: 'hero-photo-glow', 'aria-hidden': 'true' })
    ]);
    heroInner = createElement('div', { className: 'hero-grid has-photo' }, [textCol, photoCol]);
  } else {
    heroInner = createElement('div', { className: 'hero-grid' }, [textCol]);
  }

  heroContainer.appendChild(heroInner);
}

/**
 * Creates a single icon + text meta chip for the scannable meta line.
 */
function createMetaItem(iconName, text) {
  return createElement('span', { className: 'hero-meta-item' }, [
    icon(iconName, 'icon icon-sm'),
    createElement('span', {}, text)
  ]);
}

export default { init };
