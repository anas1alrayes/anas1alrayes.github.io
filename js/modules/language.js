// modules/language.js
import { state, setState, subscribe } from '../core/state.js';
import { fetchJSON } from '../utils/fetchJSON.js';
import { announceToScreenReader } from '../utils/dom.js';

/**
 * Initializes the Language Switching Module.
 * Binds to language state transitions to handle document alterations,
 * local persistence, and screen reader announcements.
 */
export function init() {
  console.log('[Language Module] Initializing localization engine...');

  // Subscribe to changes in active language state
  subscribe('lang', async (newLang) => {
    try {
      console.log(`[Language Module] Switching active language to: "${newLang}"`);

      // 1. Fetch translation dictionary (utilizes in-memory fetch cache automatically)
      const translations = await fetchJSON(`./data/i18n/${newLang}.json`);
      
      // Update dictionary in state first so other modules resolve text immediately
      setState({ translations });

      // 2. Perform document-level layouts modification
      updateDocumentSettings(newLang);

      // 3. Persist lang preference
      localStorage.setItem('portfolio-lang', newLang);

      // 4. Announce change to screen readers for accessibility compliance
      const alertMessage = newLang === 'ar' ? 'تم تغيير لغة الموقع إلى العربية' : 'Language changed to English';
      announceToScreenReader(alertMessage);
    } catch (err) {
      console.error(`[Language Module] Error executing switch to "${newLang}":`, err);
    }
  });

  // Apply baseline settings for boot language
  updateDocumentSettings(state.lang);
}

/**
 * Mutates document settings (lang, dir, class lists) with scroll/focus preservation.
 * @param {string} lang - target language key
 */
function updateDocumentSettings(lang) {
  const html = document.documentElement;
  const targetDir = lang === 'ar' ? 'rtl' : 'ltr';

  // Prevent redundant mutations
  if (html.getAttribute('lang') === lang && html.getAttribute('dir') === targetDir) {
    return;
  }

  // 1. Preserve keyboard focus context (A11y requirement)
  const previouslyFocusedElement = document.activeElement;
  const focusedElementId = previouslyFocusedElement ? previouslyFocusedElement.id : null;
  const focusedElementClassList = previouslyFocusedElement ? previouslyFocusedElement.className : null;

  // 2. Preserve vertical and horizontal scroll position to prevent jumps (UX requirement)
  const cachedScrollX = window.scrollX || window.pageXOffset;
  const cachedScrollY = window.scrollY || window.pageYOffset;

  // 3. Apply changes to root
  html.setAttribute('lang', lang);
  html.setAttribute('dir', targetDir);

  if (targetDir === 'rtl') {
    html.classList.add('rtl');
    html.classList.remove('ltr');
  } else {
    html.classList.add('ltr');
    html.classList.remove('rtl');
  }

  // 4. Restore scroll coordinates immediately after layout mirrors
  window.scrollTo(cachedScrollX, cachedScrollY);

  // 5. Restore focus position contextually if element exists in newly drawn DOM
  if (focusedElementId) {
    const el = document.getElementById(focusedElementId);
    if (el) el.focus();
  } else if (focusedElementClassList) {
    // If id is not set, attempt fallback match via unique class names (e.g. language-toggle)
    const matches = document.getElementsByClassName(focusedElementClassList);
    if (matches.length === 1) {
      matches[0].focus();
    }
  }
}

/**
 * Triggers a global state language switch.
 * @param {string} targetLang - target language code ('en' or 'ar')
 */
export function switchLanguage(targetLang) {
  if (targetLang === state.lang) return;
  setState({ lang: targetLang });
}

export default { init, switchLanguage };
