// modules/contact.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

let contactContainer = null;

/**
 * Initializes the Contact module.
 */
export async function init() {
  console.log('[Contact Module] Initializing contact section...');
  contactContainer = $('#contact');

  if (!contactContainer) {
    console.warn('[Contact Module] Target container "#contact" not found.');
    return;
  }

  contactContainer.className = 'contact-section';

  subscribe('translations', renderContact);
  renderContact();
}

/**
 * Renders a single large closing panel — the site's confident final
 * call-to-action — rather than a row of equally-weighted cards.
 */
function renderContact() {
  if (!contactContainer) return;
  contactContainer.innerHTML = '';

  const activeLang = state.lang;
  const siteData = state.siteData;

  if (!siteData || !siteData.contact) {
    console.warn('[Contact Module] No contact data found.');
    return;
  }

  const contact = siteData.contact;

  const eyebrowText = t('contact.eyebrow');
  const headingText = t('section.contact.title');
  const subtitleText = t('contact.subtitle');
  const ctaText = t('contact.cta');

  const glow = createElement('div', { className: 'contact-panel-glow', 'aria-hidden': 'true' });

  const heading = createElement('div', { className: 'contact-panel-heading-block' }, [
    createElement('p', { className: 'contact-panel-sub' }, subtitleText)
  ]);

  const emailBtn = createElement('a', {
    href: `mailto:${contact.email}`,
    className: 'btn-primary contact-panel-cta'
  }, [icon('mail', 'icon icon-sm'), ctaText]);

  const chips = [];
  chips.push(createElement('span', { className: 'contact-chip' }, [
    icon('pin', 'icon icon-sm'),
    contact.location[activeLang]
  ]));

  if (contact.github) {
    const cleanGitUrl = contact.github.replace(/^https?:\/\//, '');
    chips.push(createElement('a', {
      href: contact.github,
      className: 'contact-chip contact-chip--link',
      target: '_blank',
      rel: 'noopener noreferrer'
    }, [
      icon('github', 'icon icon-sm'),
      cleanGitUrl
    ]));
  }

  const chipsRow = createElement('div', { className: 'contact-chips' }, chips);

  const panel = createElement('div', { className: 'contact-panel surface-card', 'data-reveal': '' }, [
    glow, heading, emailBtn, chipsRow
  ]);

  contactContainer.appendChild(panel);
}

export default { init };
