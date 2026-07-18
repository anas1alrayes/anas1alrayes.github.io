// modules/animations.js
// Lightweight scroll-reveal engine. Observes any [data-reveal] element currently
// in the DOM and staggers a fade/blur/translate transition (see keyframes.css)
// as it enters the viewport. Re-scans on translation changes since section
// modules fully re-render their markup on language switches.
import { subscribe } from '../core/state.js';
import { $$ } from '../utils/dom.js';

let observer = null;
const revealedOnce = new WeakSet();

export function init() {
  console.log('[Animations Module] Initializing scroll-reveal engine...');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.log('[Animations Module] Reduced motion preferred — skipping observer setup.');
    return;
  }

  observer = new IntersectionObserver(handleIntersections, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  });

  // Modules render asynchronously; scan shortly after boot and whenever
  // translations change (which triggers a full section re-render).
  scheduleScan();
  subscribe('translations', scheduleScan);

  // Also catch late-mounted content (e.g. project drawer) via a light MutationObserver
  const mutationObserver = new MutationObserver(() => scheduleScan());
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

let scanTimer = null;
function scheduleScan() {
  clearTimeout(scanTimer);
  scanTimer = setTimeout(scan, 60);
}

function scan() {
  if (!observer) return;
  const targets = $$('[data-reveal]');
  targets.forEach((el, idx) => {
    if (revealedOnce.has(el)) return;
    if (!el.style.getPropertyValue('--reveal-delay')) {
      const stagger = Number(el.dataset.revealGroup || 0);
      el.style.setProperty('--reveal-delay', `${Math.min(idx % 6, 5) * 70 + stagger}ms`);
    }
    observer.observe(el);
  });
}

function handleIntersections(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealedOnce.add(entry.target);
      observer.unobserve(entry.target);
    }
  });
}

export default { init };
