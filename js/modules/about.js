// modules/about.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

let aboutContainer = null;

const SNAPSHOT_ICONS = ['sparkle', 'layers', 'bolt', 'target'];

/**
 * Initializes the About (Professional Snapshot) section renderer.
 */
export function init() {
  console.log('[About Module] Initializing about section...');
  aboutContainer = $('#about');

  if (!aboutContainer) {
    console.warn('[About Module] Container "#about" not found in DOM.');
    return;
  }

  aboutContainer.className = 'about-section';

  subscribe('translations', renderSnapshot);
  renderSnapshot();
}

/**
 * Compiles the About layout: a header with a quick-jump link, an
 * at-a-glance stat strip, an optional current-focus tag row, and a
 * bento grid of four scannable snapshot cards.
 */
function renderSnapshot() {
  if (!aboutContainer) return;
  aboutContainer.innerHTML = '';

  const activeLang = state.lang;
  const siteData = state.siteData;

  if (!siteData) {
    console.warn('[About Module] Cannot compile snapshot: siteData is missing from state.');
    return;
  }

  const eyebrowText = t('about.eyebrow');
  const sectionTitle = t('about.title');

  const header = createElement('div', { className: 'section-header', 'data-reveal': '' }, [
    createElement('span', { className: 'eyebrow' }, eyebrowText),
    createElement('h2', { className: 'about-title', id: 'about-title' }, sectionTitle)
  ]);

  aboutContainer.appendChild(header);

  // Stat strip (proof points a recruiter can absorb at a glance)
  if (Array.isArray(siteData.stats) && siteData.stats.length > 0) {
    const statsRow = createElement('div', { className: 'about-stats', 'data-reveal': '' },
      siteData.stats.map(stat => createElement('div', { className: 'stat-item' }, [
        createElement('span', { className: 'stat-number' }, stat.value[activeLang]),
        createElement('span', { className: 'stat-label' }, stat.label[activeLang])
      ]))
    );
    aboutContainer.appendChild(statsRow);
  }

  // Current-focus tag row
  if (siteData.currentFocus && Array.isArray(siteData.currentFocus[activeLang])) {
    const focusLabel = t('about.focus_label') || (activeLang === 'ar' ? 'أركز حالياً على' : 'Currently focused on');
    const focusRow = createElement('div', { className: 'about-focus-row', 'data-reveal': '' }, [
      createElement('span', { className: 'about-focus-label' }, focusLabel),
      createElement('div', { className: 'tag-row' },
        siteData.currentFocus[activeLang].map(item => createElement('span', { className: 'tag' }, item))
      )
    ]);
    aboutContainer.appendChild(focusRow);
  }

  // Bento grid of snapshot cards
  const cards = [
    createSnapshotCard(SNAPSHOT_ICONS[0], t('about.label.identity'), t('about.value.identity')),
    createSnapshotCard(SNAPSHOT_ICONS[1], t('about.label.outputs'), t('about.value.outputs')),
    createSnapshotCard(SNAPSHOT_ICONS[2], t('about.label.approach'), t('about.value.approach')),
    createSnapshotCard(SNAPSHOT_ICONS[3], t('about.label.purpose'), t('about.value.purpose'))
  ];

  const grid = createElement('div', { className: 'about-grid' }, cards);
  aboutContainer.appendChild(grid);
}

/**
 * Builds a single bento-grid snapshot card.
 */
function createSnapshotCard(iconName, label, text) {
  return createElement('div', {
    className: 'about-card surface-card surface-card--interactive',
    'data-reveal': ''
  }, [
    createElement('div', { className: 'about-card-icon' }, [icon(iconName, 'icon icon-lg')]),
    createElement('span', { className: 'about-card-label' }, label),
    createElement('p', { className: 'about-card-text' }, text)
  ]);
}

export default { init };
