// core/app.js
import { fetchJSON } from '../utils/fetchJSON.js';
import { state, setState, eventBus } from './state.js';
import languageModule from '../modules/language.js';
import navModule from '../modules/nav.js';
import animationsModule from '../modules/animations.js';
import heroModule from '../modules/hero.js';
import aboutModule from '../modules/about.js';
import projectsModule from '../modules/projects.js';
import galleryModule from '../modules/gallery.js';
import skillsModule from '../modules/skills.js';
import achievementsModule from '../modules/achievements.js';
import documentsModule from '../modules/documents.js';
import contactModule from '../modules/contact.js';
import footerModule from '../modules/footer.js';

// Collection of registered modules to initialize during startup
const registeredModules = [];

// Register language switcher engine
registerModule({
  name: 'language',
  init: languageModule.init
});

// Register navigation and layout shell engine
registerModule({
  name: 'nav',
  init: navModule.init
});

// Register scroll-reveal / micro-interaction engine
registerModule({
  name: 'animations',
  init: animationsModule.init
});

// Register hero narrative engine
registerModule({
  name: 'hero',
  init: heroModule.init
});

// Register professional snapshot summary engine
registerModule({
  name: 'about',
  init: aboutModule.init
});

// Register projects workstation centerpiece engine
registerModule({
  name: 'projects',
  init: projectsModule.init
});

// Register shared lightbox/gallery popup engine
registerModule({
  name: 'gallery',
  init: galleryModule.init
});

// Register skills matrix engine
registerModule({
  name: 'skills',
  init: skillsModule.init
});

// Register academic and national achievements engine
registerModule({
  name: 'achievements',
  init: achievementsModule.init
});

// Register official credentials and sitemap documents engine
registerModule({
  name: 'documents',
  init: documentsModule.init
});

// Register contact form/links channels engine
registerModule({
  name: 'contact',
  init: contactModule.init
});

// Register footer attribution engine
registerModule({
  name: 'footer',
  init: footerModule.init
});


/**
 * Registers an application module to participate in the lifecycle.
 * @param {Object} module - Module definition
 * @param {string} module.name - Unique module name for identification
 * @param {Function} module.init - Asynchronous initialization function
 */
export function registerModule(module) {
  if (!module || typeof module.init !== 'function') {
    throw new Error(`[App] Module registration failed: module must expose an init() function.`);
  }
  registeredModules.push(module);
  console.log(`[App] Registered module: "${module.name || 'Unnamed Module'}"`);
}

/**
 * Runs the application bootstrap sequence.
 */
export async function bootstrap() {
  console.log('[App] Initializing portfolio website engine...');
  eventBus.emit('app:boot:started');

  try {
    // 1. Resolve Language Preference
    const lang = detectLanguage();
    setState({ lang });
    console.log(`[App] Language resolved to: "${lang}"`);

    // 2. Fetch Core Resources Concurrently (Performance-First Architecture)
    console.log('[App] Fetching core dataset assets in parallel...');
    const [
      siteData,
      projectsIndex,
      skills,
      achievements,
      documents,
      translations
    ] = await Promise.all([
      fetchJSON('./data/site.json', ['name', 'title', 'heroIntro']),
      fetchJSON('./data/projects/index.json'),
      fetchJSON('./data/skills.json'),
      fetchJSON('./data/achievements.json'),
      fetchJSON('./data/documents.json'),
      fetchJSON(`./data/i18n/${lang}.json`)
    ]);

    // 3. Update state with loaded dataset
    setState({
      siteData,
      projectsIndex,
      skills,
      achievements,
      documents,
      translations
    });
    console.log('[App] Global state populated with loaded dataset.');

    // 4. Initialize Registered Modules (Safe Error Isolation)
    for (const module of registeredModules) {
      try {
        console.log(`[App] Initializing module: "${module.name}"`);
        await module.init();
      } catch (moduleError) {
        // Safe Error Handling: prevent a single faulty module from crashing the entire app
        console.error(`[App] Module "${module.name}" failed to initialize:`, moduleError);
        eventBus.emit('app:module:error', { name: module.name, error: moduleError });
      }
    }

    // 5. Lifecycle Boot Completion
    setState({ initialized: true });
    eventBus.emit('app:boot:completed');
    console.log('[App] Application bootstrap sequence successfully completed.');
  } catch (criticalError) {
    // Handle failures loading core files (e.g. offline status or missing critical assets)
    console.error('[App] Critical bootstrap error occurred:', criticalError);
    eventBus.emit('app:boot:failed', criticalError);
    displayFallbackErrorUI(criticalError);
  }
}

/**
 * Detects the user's language preference.
 * Priority: 1. LocalStorage cache, 2. Browser locale preferences, 3. English default.
 * @returns {string} resolved language code
 */
function detectLanguage() {
  try {
    const cachedLang = localStorage.getItem('portfolio-lang');
    if (cachedLang === 'en' || cachedLang === 'ar') {
      return cachedLang;
    }
  } catch (e) {
    console.warn('[App] LocalStorage is unavailable or restricted:', e);
  }

  const systemLocale = navigator.language || navigator.userLanguage;
  if (systemLocale && systemLocale.startsWith('ar')) {
    return 'ar';
  }

  return 'en';
}

/**
 * Renders a fallback UI if a critical data loading failure occurs during startup.
 * @param {Error} error - The critical error
 */
function displayFallbackErrorUI(error) {
  const container = document.getElementById('main-content') || document.body;
  if (container) {
    container.innerHTML = `
      <div style="
        max-width: 460px;
        margin: 8rem auto;
        padding: 2.25rem;
        background: #17171a;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 22px;
        box-shadow: 0 24px 60px -20px rgba(0,0,0,0.6);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        text-align: center;
        color: #f5f5f7;
      ">
        <h2 style="color: #f87171; margin-bottom: 0.5rem; font-size: 1.15rem; font-weight: 600;">Connection or Loading Error</h2>
        <p style="color: #b6b6c0; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
          We couldn't load the portfolio resources. Please verify your network connection and refresh.
        </p>
        <button onclick="window.location.reload()" style="
          background: #c9974e;
          color: #fff;
          border: none;
          padding: 0.7rem 1.4rem;
          font-weight: 600;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.85rem;
        ">
          Reload Page
        </button>
        <details style="margin-top: 2rem; text-align: left;">
          <summary style="font-size: 0.75rem; color: #7c7c86; cursor: pointer; user-select: none;">
            Technical Details
          </summary>
          <pre style="
            background: #0c0c10;
            border: 1px solid rgba(255,255,255,0.06);
            padding: 0.75rem;
            font-size: 0.72rem;
            color: #83838d;
            border-radius: 10px;
            overflow-x: auto;
            margin-top: 0.5rem;
          ">${error.stack || error.message || error}</pre>
        </details>
      </div>
    `;
  }
}

// Attach lifecycle boots when DOM content is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
export default { registerModule, bootstrap };
