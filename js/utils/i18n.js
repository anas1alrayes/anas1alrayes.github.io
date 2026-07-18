// utils/i18n.js
import { state } from '../core/state.js';

/**
 * Resolves a UI key based on the currently loaded active translations.
 * Supports placeholder replacement. Example: t("footer.copyright", { year: "2026" })
 *
 * @param {string} key - The dictionary key to resolve
 * @param {Object} [placeholders={}] - Token replacements mapping
 * @returns {string} Fully resolved UI text string
 */
export function t(key, placeholders = {}) {
  const dictionary = state.translations || {};
  let resolvedText = dictionary[key];

  // Graceful fallback to the key identifier itself if dictionary doesn't resolve it
  if (resolvedText === undefined) {
    console.warn(`[i18n] Missing translation string for key: "${key}"`);
    return key;
  }

  // Handle template variable interpolation (e.g. replacing "{name}" with values)
  for (const [token, value] of Object.entries(placeholders)) {
    resolvedText = resolvedText.replace(new RegExp(`{${token}}`, 'g'), String(value));
  }

  return resolvedText;
}

/**
 * Helper to select the appropriate localized text from a bilingual data object.
 * Example: resolveField(project.title) -> returns project.title.en or project.title.ar
 * 
 * @param {Object} localizedObject - Object of shape { en: string, ar: string }
 * @returns {string} Correctly localized field value
 */
export function resolveField(localizedObject) {
  if (!localizedObject) return '';
  const currentLang = state.lang || 'en';
  
  // Return requested language text, fallback to the alternate language, or an empty string
  return localizedObject[currentLang] || localizedObject['en'] || localizedObject['ar'] || '';
}

export default { t, resolveField };
