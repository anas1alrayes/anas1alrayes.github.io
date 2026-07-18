// utils/icons.js
// Minimal hand-authored monoline icon set (24x24, stroke-based).
// Kept dependency-free per the vanilla-only architecture constraint.

const ICONS = {
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M9 7h8v8"/>',
  download: '<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 18h14" stroke-linecap="round"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
  pin: '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>',
  cap: '<path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z"/><path d="M6.5 11.7v4.3c0 1.3 2.4 2.5 5.5 2.5s5.5-1.2 5.5-2.5v-4.3" /><path d="M21 9.5v5.8"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="m4.5 7 7.5 6 7.5-6"/>',
  github: '<path d="M12 2.5c-5.25 0-9.5 4.36-9.5 9.75 0 4.31 2.73 7.96 6.52 9.25.48.09.65-.22.65-.48 0-.24-.01-.87-.01-1.71-2.65.59-3.21-1.31-3.21-1.31-.44-1.13-1.06-1.44-1.06-1.44-.87-.6.07-.59.07-.59.96.07 1.46 1 1.46 1 .85 1.48 2.24 1.05 2.78.8.09-.63.34-1.05.61-1.29-2.11-.24-4.34-1.07-4.34-4.78 0-1.06.37-1.92.97-2.6-.1-.24-.42-1.22.09-2.55 0 0 .79-.26 2.6.99a8.83 8.83 0 0 1 4.73 0c1.81-1.25 2.6-.99 2.6-.99.51 1.33.19 2.31.09 2.55.6.68.97 1.54.97 2.6 0 3.72-2.24 4.54-4.36 4.78.35.31.66.91.66 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.17.58.66.48 3.78-1.3 6.51-4.94 6.51-9.25 0-5.39-4.25-9.75-9.5-9.75Z"/>',
  quote: '<path d="M7.5 8.5c-2 1-3 2.8-3 5 0 2 1.3 3.5 3 3.5s3-1.3 3-3c0-1.6-1.1-2.9-2.6-3 .2-1.3 1.2-2.4 2.6-3l-3-2.5Zm9 0c-2 1-3 2.8-3 5 0 2 1.3 3.5 3 3.5s3-1.3 3-3c0-1.6-1.1-2.9-2.6-3 .2-1.3 1.2-2.4 2.6-3l-3-2.5Z" fill="currentColor" stroke="none"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
  bolt: '<path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  award: '<circle cx="12" cy="8.5" r="5.5"/><path d="M8.2 13.2 6.5 21l5.5-3 5.5 3-1.7-7.8"/>',
  file: '<path d="M7 3h6.5L19 8.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M13.5 3v5.5H19"/>'
};

/**
 * Builds an inline SVG icon element.
 * @param {string} name - Key from the ICONS map
 * @param {string} [className='icon'] - Extra class name(s) to attach
 * @returns {SVGElement|null}
 */
export function icon(name, className = 'icon') {
  const inner = ICONS[name];
  if (!inner) {
    console.warn(`[Icons] Unknown icon requested: "${name}"`);
    return null;
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
  const svg = wrapper.firstElementChild;
  svg.setAttribute('class', className);
  return svg;
}

export default { icon };
