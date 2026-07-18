# Anas's Portfolio Website

A premium, bilingual (English & Arabic) personal portfolio website designed with a **"Technical Editorial"** visual identity. 

This project is built from the ground up to be static, framework-free, and easy to maintain for years to come.

---

## 🚀 Core Philosophy & Tech Stack

1. **Static, No Build Step:** Runs directly by opening `index.html` or serving the repository via any static file server (such as GitHub Pages). No bundlers, compilers, or package managers are required.
2. **Vanilla Technologies:** Built using standard:
   * **HTML5** for semantic markup.
   * **CSS3** with CSS custom properties (tokens), logical properties, and fluid typography.
   * **ES6+ JavaScript** loaded natively as ES modules (`type="module"`), allowing the browser to resolve imports directly.
   * **JSON** for the data layer.
   * **SVG** for graphics and monoline technical icons.
3. **Separation of Concerns:** 
   * **What renders (Content):** Sourced entirely from the `/data` directory as JSON files.
   * **How it renders (Behavior):** Handled by JavaScript modules in `/js`.
   * **How it looks (Appearance):** Controlled by CSS stylesheets in `/css`.

---

## 📁 Directory Structure

```
/
├── index.html                  # Semantic structural shell and skip-link container
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── manifest.json               # PWA/browser web manifest metadata
├── robots.txt                  # Search engine crawler permissions
├── sitemap.xml                 # XML sitemap configuration
├── favicon.ico                 # Browser tab favicon
├── README.md                   # Setup instructions and documentation
│
├── /assets                     # Static assets
│   ├── /images
│   │   ├── /projects           # Project screenshots in optimized WebP format
│   │   │   ├── /filefusion
│   │   │   ├── /shorker
│   │   │   └── /salatapp
│   │   └── /site               # Global site illustrations, icons, og-image
│   ├── /icons                  # Monoline SVG sprite sheet
│   ├── /fonts                  # Self-hosted, subsetted web fonts (.woff2)
│   └── /documents              # PDF downloads (resume-en.pdf, resume-ar.pdf, etc.)
│
├── /data                       # Content JSON Files
│   ├── site.json               # Global metadata, SEO defaults, focus statement
│   ├── /i18n                   # UI interface localization files
│   │   ├── en.json
│   │   └── ar.json
│   ├── /projects               # Project data files
│   │   ├── index.json          # Featured flags and slugs ordering
│   │   ├── filefusion.json     # Details for FileFusion application
│   │   ├── shorker.json        # Details for ShorKer application
│   │   └── salatapp.json       # Details for SalatApp application
│   ├── achievements.json       # List of achievements and awards
│   ├── skills.json             # Skill categories and tags mapping
│   └── documents.json          # Downloader files and metadata
│
├── /css                        # Modular Stylesheets
│   ├── main.css                # CSS import manifest file
│   ├── /base                   # Reset, design tokens, typography
│   ├── /layout                 # Grids, header, footer, spacing rhythm
│   ├── /components             # Component styles (cards, tags, buttons)
│   ├── /utilities              # Helper classes
│   ├── /animations             # Keyframes and easing properties
│   └── rtl.css                 # Overrides for RTL display alignment
│
└── /js                         # Modular Behavior (ES Modules)
    ├── /core
    │   ├── app.js              # Application bootstrap & 5-step init sequence
    │   └── state.js            # In-memory application state
    ├── /modules
    │   ├── nav.js              # Navigation, scrollspy, and focus traps
    │   ├── language.js         # Language selection and localization engine
    │   ├── projects.js         # Cards layout and hash-based project routing
    │   ├── gallery.js          # Lightbox/gallery popup actions
    │   ├── animations.js       # Scroll reveal observers and reduced motion checks
    │   └── theme.js            # Accent themes or dark mode hooks
    └── /utils
        ├── dom.js              # Shorthand DOM helper utilities
        ├── fetchJSON.js        # Cached JSON fetcher utility
        └── i18n.js             # Localized string resolver
```

---

## 🛠️ Local Development

Since this site relies on native ES modules, opening `index.html` directly from your hard drive (`file://` protocol) will trigger browser CORS security blocks on AJAX fetch calls.

To run the site locally, serve the directory using a simple static web server:

### Option 1: Python (Built-in)
Run the following command from the repository root:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: Node.js (npx serve)
If you have Node.js installed, run:
```bash
npx serve
```
Then open the URL shown in your terminal.

---

## 🌐 Deployment & Cache-Busting

1. **GitHub Pages Ready:** The presence of `.nojekyll` at the root ensures that files and folders starting with underscores or containing custom static setups are loaded without processing.
2. **Version Control / Cache-Busting:** Since browser caching can prevent returning visitors from receiving the latest content revisions, you should append a query string parameter (`?v=1.0.0`) to CSS and JS script URLs in `index.html` when deploying updates.
