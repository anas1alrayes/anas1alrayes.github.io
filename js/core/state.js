// core/state.js

// Initial default state configuration
const defaultState = {
  lang: 'en',               // 'en' or 'ar'
  theme: 'light',            // Light mode only for V1
  siteData: null,           // data/site.json
  projectsIndex: [],        // data/projects/index.json
  projects: new Map(),      // Cache of loaded project details (slug -> details)
  skills: null,             // data/skills.json
  achievements: [],         // data/achievements.json
  documents: [],            // data/documents.json
  translations: {},         // Current loaded UI translations
  activeProjectId: null,    // Slug of active project modal (null if closed)
  initialized: false        // App status flag
};

// Sealed global state storage to prevent accidental outside mutations
let currentState = { ...defaultState };

// Subscriptions for state keys
const stateListeners = new Map();

// General Event Bus listeners for pub-sub messaging
const eventListeners = new Map();

/**
 * Read-only proxy for the global state.
 * Direct property assignment is prevented through getters.
 */
export const state = {
  get lang() { return currentState.lang; },
  get theme() { return currentState.theme; },
  get siteData() { return currentState.siteData; },
  get projectsIndex() { return currentState.projectsIndex; },
  get projects() { return currentState.projects; },
  get skills() { return currentState.skills; },
  get achievements() { return currentState.achievements; },
  get documents() { return currentState.documents; },
  get translations() { return currentState.translations; },
  get activeProjectId() { return currentState.activeProjectId; },
  get initialized() { return currentState.initialized; }
};

/**
 * Updates the global state and triggers notifications for changed properties.
 * @param {Object} updates - State delta object
 */
export function setState(updates) {
  const changedKeys = [];
  
  for (const [key, value] of Object.entries(updates)) {
    if (key in currentState && currentState[key] !== value) {
      currentState[key] = value;
      changedKeys.push(key);
    }
  }

  // Notify property-specific observers
  for (const key of changedKeys) {
    if (stateListeners.has(key)) {
      for (const callback of stateListeners.get(key)) {
        try {
          callback(currentState[key]);
        } catch (e) {
          console.error(`[State] Observer callback failed for key "${key}":`, e);
        }
      }
    }
  }
}

/**
 * Subscribes to changes in a specific state property.
 * @param {string} key - State property key to observe
 * @param {Function} callback - Callback triggered with the new value
 * @returns {Function} Unsubscribe handler function
 */
export function subscribe(key, callback) {
  if (!(key in defaultState)) {
    console.warn(`[State] Attempted to subscribe to invalid state property: "${key}"`);
    return () => {};
  }

  if (!stateListeners.has(key)) {
    stateListeners.set(key, new Set());
  }
  stateListeners.get(key).add(callback);

  // Return unsubscribe cleanup callback
  return () => {
    if (stateListeners.has(key)) {
      stateListeners.get(key).delete(callback);
    }
  };
}

/**
 * Core event bus utility for cross-module decoupled messaging.
 */
export const eventBus = {
  /**
   * Listen for an application-wide event.
   * @param {string} event - Event descriptor
   * @param {Function} callback - Callback payload handler
   * @returns {Function} Unsubscribe handler function
   */
  on(event, callback) {
    if (!eventListeners.has(event)) {
      eventListeners.set(event, new Set());
    }
    eventListeners.get(event).add(callback);
    return () => {
      if (eventListeners.has(event)) {
        eventListeners.get(event).delete(callback);
      }
    };
  },

  /**
   * Broadcast an event to all registered listeners.
   * @param {string} event - Event descriptor
   * @param {any} [data] - Optional payload parameters
   */
  emit(event, data) {
    if (eventListeners.has(event)) {
      for (const callback of eventListeners.get(event)) {
        try {
          callback(data);
        } catch (e) {
          console.error(`[EventBus] Handler failed for event "${event}":`, e);
        }
      }
    }
  }
};
export default { state, setState, subscribe, eventBus };
