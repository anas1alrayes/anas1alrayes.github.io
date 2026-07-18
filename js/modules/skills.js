// modules/skills.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';

let skillsContainer = null;

/**
 * Initializes the Skills module.
 */
export async function init() {
  console.log('[Skills Module] Initializing skills grid...');
  skillsContainer = $('#skills');

  if (!skillsContainer) {
    console.warn('[Skills Module] Target container "#skills" not found.');
    return;
  }

  skillsContainer.className = 'skills-section';

  subscribe('translations', renderSkills);
  renderSkills();
}

/**
 * Renders the skills as a grid of cards, each with its items shown as
 * scannable pill tags rather than a plain bulleted list.
 */
function renderSkills() {
  if (!skillsContainer) return;
  skillsContainer.innerHTML = '';

  const activeLang = state.lang;
  const skillsData = state.skills;

  if (!skillsData) {
    console.warn('[Skills Module] No skills data found in state.');
    return;
  }

  const eyebrowText = t('skills.eyebrow');
  const titleText = t('section.skills.title');

  const sectionHeader = createElement('div', { className: 'section-header', 'data-reveal': '' }, [
    createElement('span', { className: 'eyebrow' }, eyebrowText),
    createElement('h2', { className: 'skills-title', id: 'skills-title' }, titleText)
  ]);

  const cards = Object.keys(skillsData).map(key => {
    const category = skillsData[key];

    const tagRow = createElement('div', { className: 'tag-row' },
      category.items.map(item => createElement('span', { className: 'tag' }, item))
    );

    return createElement('div', {
      className: 'skill-category-card surface-card surface-card--interactive',
      'data-reveal': ''
    }, [
      createElement('h3', { className: 'skill-category-title' }, category.title[activeLang]),
      tagRow
    ]);
  });

  const gridContainer = createElement('div', { className: 'skills-grid' }, cards);

  skillsContainer.appendChild(sectionHeader);
  skillsContainer.appendChild(gridContainer);
}

export default { init };
