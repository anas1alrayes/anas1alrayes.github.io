// modules/gallery.js
// A single reusable lightbox overlay shared by any module that needs to
// present an image at full size (currently: the project case-study gallery).
import { createElement, createFocusTrap } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

let overlay = null;
let imgEl = null;
let captionEl = null;
let closeBtn = null;
let focusTrapRelease = null;
let triggerElement = null;

/**
 * Builds the (initially hidden) lightbox overlay and appends it to the body.
 */
export function init() {
  console.log('[Gallery Module] Initializing lightbox overlay...');

  closeBtn = createElement('button', {
    className: 'btn-icon lightbox-close',
    type: 'button',
    'aria-label': 'Close image preview'
  }, [icon('close')]);
  closeBtn.addEventListener('click', close);

  imgEl = createElement('img', { className: 'lightbox-image', alt: '' });
  captionEl = createElement('p', { className: 'lightbox-caption' });

  const frame = createElement('div', { className: 'lightbox-frame' }, [imgEl, closeBtn]);

  overlay = createElement('div', {
    className: 'lightbox-overlay',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-hidden': 'true'
  }, [frame, captionEl]);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  document.body.appendChild(overlay);
}

/**
 * Opens the lightbox with a given image source.
 * @param {string} src
 * @param {string} [caption]
 * @param {HTMLElement} [trigger] - element to restore focus to on close
 */
export function open(src, caption = '', trigger = null) {
  if (!overlay) init();

  imgEl.src = src;
  imgEl.alt = caption;
  captionEl.textContent = caption;
  triggerElement = trigger || document.activeElement;

  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  focusTrapRelease = createFocusTrap(overlay);
  closeBtn.focus();
}

/**
 * Closes the lightbox and restores focus/scroll.
 */
export function close() {
  if (!overlay || !overlay.classList.contains('is-open')) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (focusTrapRelease) {
    focusTrapRelease();
    focusTrapRelease = null;
  }

  if (triggerElement) {
    triggerElement.focus();
    triggerElement = null;
  }
}

export default { init, open, close };
