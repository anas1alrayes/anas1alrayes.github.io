// modules/achievements.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

let achievementsContainer = null;

/**
 * Initializes the Achievements module.
 */
export async function init() {
  console.log('[Achievements Module] Initializing achievements timeline...');
  achievementsContainer = $('#achievements');

  if (!achievementsContainer) {
    console.warn('[Achievements Module] Target container "#achievements" not found.');
    return;
  }

  achievementsContainer.className = 'achievements-section';

  subscribe('translations', renderAchievements);
  renderAchievements();
}

/**
 * Renders achievements as a connected vertical timeline — distinct from
 * the card grids used elsewhere in the page.
 */
function renderAchievements() {
  if (!achievementsContainer) return;
  achievementsContainer.innerHTML = '';

  const activeLang = state.lang;
  const achievementsData = state.achievements;

  if (!achievementsData) {
    console.warn('[Achievements Module] No achievements data found.');
    return;
  }

  const eyebrowText = t('achievements.eyebrow');
  const titleText = t('section.achievements.title');

  const sectionHeader = createElement('div', { className: 'section-header', 'data-reveal': '' }, [
    createElement('span', { className: 'eyebrow' }, eyebrowText),
    createElement('h2', { className: 'achievements-title', id: 'achievements-title' }, titleText)
  ]);

  const timeline = createElement('div', { className: 'achievements-timeline' });

  // Data is authored newest-first; render in chronological reading order (oldest → newest).
  const orderedAchievements = [...achievementsData].reverse();

  orderedAchievements.forEach(ach => {
    const markerCol = createElement('div', { className: 'timeline-marker-col' }, [
      createElement('div', { className: 'timeline-marker' }, [icon('award', 'icon icon-sm')])
    ]);

    const cardChildren = [
      createElement('span', { className: 'timeline-year' }, ach.year),
      createElement('h3', { className: 'timeline-title' }, ach.title[activeLang]),
      createElement('span', { className: 'timeline-issuer' }, ach.issuer[activeLang]),
      createElement('p', { className: 'timeline-desc' }, ach.description[activeLang])
    ];



    const card = createElement('div', { className: 'timeline-card surface-card surface-card--interactive' }, cardChildren);
    const item = createElement('div', { className: 'timeline-item', 'data-reveal': '' }, [markerCol, card]);
    timeline.appendChild(item);
  });

  achievementsContainer.appendChild(sectionHeader);
  achievementsContainer.appendChild(timeline);
}

export default { init };
