// modules/footer.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement } from '../utils/dom.js';

let footerContainer = null;

/**
 * Initializes the Footer module.
 */
export async function init() {
  console.log('[Footer Module] Initializing footer...');
  footerContainer = $('#site-footer .container');

  if (!footerContainer) {
    console.warn('[Footer Module] Target container "#site-footer .container" not found.');
    return;
  }

  // Subscribe to translations state updates
  subscribe('translations', renderFooter);

  // Initial render
  renderFooter();
}

/**
 * Renders the footer copyright and attribution logs.
 */
function renderFooter() {
  if (!footerContainer) return;
  footerContainer.innerHTML = '';

  const copyrightText = t('footer.copyright') || '© 2026 Anas Alrayes. All rights reserved.';
  const builtWithText = t('footer.built_with') || 'Built with HTML, CSS, and vanilla JS.';

  const copyright = createElement('span', { className: 'footer-copyright' }, copyrightText);
  const builtWith = createElement('span', { className: 'footer-built-with' }, builtWithText);

  const footerContent = createElement('div', { className: 'footer-content' }, [
    copyright,
    builtWith
  ]);

  footerContainer.appendChild(footerContent);
}

export default { init };
