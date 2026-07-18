// utils/dom.js

/**
 * Shorthand for document.querySelector.
 * @param {string} selector - CSS selector
 * @param {ParentNode} [parent=document] - Optional parent node container
 * @returns {Element|null} Target element
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Shorthand for document.querySelectorAll converted to a clean Array.
 * @param {string} selector - CSS selector
 * @param {ParentNode} [parent=document] - Optional parent node container
 * @returns {Array<Element>} Array of target elements
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Helper to dynamically create DOM nodes with properties and children.
 * @param {string} tag - Tag name of the element
 * @param {Object} [attributes={}] - Key-value pair of attributes
 * @param {string|Array<Node|string>} [children=[]] - Inner content or children
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes, handling objects or direct properties
  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined) continue;
    
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      for (const [dataKey, dataVal] of Object.entries(value)) {
        element.dataset[dataKey] = dataVal;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, String(value));
    }
  }

  // Set children
  const childrenArray = Array.isArray(children) ? children : [children];
  for (const child of childrenArray) {
    if (child instanceof Node) {
      element.appendChild(child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(String(child)));
    }
  }

  return element;
}

/**
 * Traps key focus inside a specific container (e.g. for modal accessibility).
 * @param {HTMLElement} container - The container element to lock focus inside
 * @returns {Function} Function to release/cleanup the focus trap listener
 */
export function createFocusTrap(container) {
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    const focusables = $$(focusableSelector, container).filter(
      el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );
    
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      // Shift + Tab -> loop backwards
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      // Tab -> loop forwards
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  
  // Return release callback
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announces a message to screen readers using an aria-live container.
 * @param {string} message - Text announcement
 * @param {string} [politeness='polite'] - Assertive or polite priority
 */
let liveRegion = null;
export function announceToScreenReader(message, politeness = 'polite') {
  if (!liveRegion) {
    liveRegion = createElement('div', {
      'aria-live': politeness,
      'aria-atomic': 'true',
      'className': 'sr-only',
      'style': 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px);'
    });
    document.body.appendChild(liveRegion);
  } else {
    liveRegion.setAttribute('aria-live', politeness);
  }

  // Trigger announcement by clearing and setting text contents
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

export default { $, $$, createElement, createFocusTrap, announceToScreenReader };
