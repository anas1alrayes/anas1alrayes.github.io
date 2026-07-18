# Portfolio Website — Front-End Architecture Specification
**Prepared for:** Anas &nbsp;·&nbsp; **Version:** 1.0 &nbsp;·&nbsp; **Scope:** Architecture only — no source code

This document assumes the Design Specification (v2.0) is final and unchanged. Nothing here alters a UI or UX decision — it answers a different question entirely: *how is this built so that it stays clean, static, framework-free, and easy for one person to maintain for years?*

---

## 1. Architectural Principles & Constraints

- **Static, no backend, no build step.** Everything must run by opening `index.html` or serving the repo as-is via GitHub Pages. No compilation, no bundler, no package manager required to view the site.
- **Vanilla only:** HTML5, CSS3, ES6+ JavaScript (loaded as native ES modules — the browser resolves `import`s directly, which is what makes a bundler unnecessary), JSON for data, SVG for icons.
- **Content and logic are separate.** This is the single organizing principle behind everything below: JavaScript should describe *how* things render; JSON should describe *what* renders. Adding a project, fixing a typo, or replacing a screenshot should never require reading — let alone editing — a `.js` file.
- **Design intent, not implementation.** Everywhere the design doc specified a layout or behavior, this document explains how the code is *organized* to produce it — not the CSS or JS itself.

---

## 2. Content & Data Philosophy

Every content type the owner needs to update independently gets its own file or folder: projects, achievements, skills, documents, interface translations, and site-wide settings (like the Current Focus text). None of these live inside JavaScript. The JavaScript's only job is to fetch the right JSON, insert the right language's fields, and render it into the already-present HTML shell.

This gives a simple mental model for future-Anas: *"To change what the site says, edit a JSON file. To change how the site behaves, edit a JS module. To change how it looks, edit a CSS file."* Those three questions almost never overlap.

---

## 3. Folder Structure

```
/
├── index.html
├── .nojekyll                 (disables GitHub Pages' default Jekyll processing —
│                               this is a hand-built static site, not a Jekyll site)
├── manifest.json
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── README.md
│
├── /assets
│   ├── /images
│   │   ├── /projects
│   │   │   ├── /filefusion
│   │   │   │   ├── cover.webp
│   │   │   │   ├── cover@2x.webp
│   │   │   │   ├── thumb.webp
│   │   │   │   ├── gallery-01.webp
│   │   │   │   └── gallery-02.webp
│   │   │   ├── /shorker
│   │   │   └── /salatapp
│   │   └── /site               (favicons, og-image, any non-project imagery)
│   ├── /icons                  (single SVG sprite or individual line icons)
│   ├── /fonts                  (self-hosted, subsetted .woff2 — Latin + Arabic stacks)
│   └── /documents
│       ├── resume-en.pdf
│       ├── resume-ar.pdf
│       └── supporting-portfolio.pdf
│
├── /data
│   ├── site.json                (name, Current Focus text, contact links, SEO defaults)
│   ├── /i18n
│   │   ├── en.json               (flat UI/interface strings)
│   │   └── ar.json
│   ├── /projects
│   │   ├── index.json            (ordered slug list + featured flag)
│   │   ├── filefusion.json
│   │   ├── shorker.json
│   │   └── salatapp.json
│   ├── achievements.json
│   ├── skills.json
│   └── documents.json
│
├── /css
│   ├── main.css                  (a small, explicit list of <link> imports — see §9)
│   ├── /base                     (reset, design tokens, typography)
│   ├── /layout                   (grid, section rhythm, header, footer)
│   ├── /components               (buttons, tags, project cards, achievement rows,
│   │                               skill matrix, current-focus banner, documents)
│   ├── /utilities                (small single-purpose helper classes)
│   ├── /animations               (keyframes, transition/duration tokens)
│   └── rtl.css                   (the small set of rules logical properties can't cover)
│
└── /js
    ├── /core
    │   ├── app.js                 (init sequence — see §8)
    │   └── state.js               (tiny shared state: active language, active view)
    ├── /modules
    │   ├── nav.js
    │   ├── language.js
    │   ├── projects.js
    │   ├── gallery.js
    │   ├── animations.js
    │   └── theme.js               (empty hook today — see §9, dark mode)
    └── /utils
        ├── dom.js
        ├── fetchJSON.js
        └── i18n.js
```

Every folder maps to exactly one of the three questions from §2 — content in `/data`, appearance in `/css`, behavior in `/js`. Nothing is organized "by feature" (e.g. no `/projects-page` folder mixing HTML/CSS/JS together), because at this scale a content-type split is easier to keep tidy than a feature split, and it mirrors how Anas will actually think about updates ("I need to add a project" → `/data/projects`, full stop).

---

## 4. Project Data Schema

**Decision: one JSON file per project, with translatable fields nested per-language inside that single file** — not separate `filefusion.en.json` / `filefusion.ar.json` files.

**Why:** the alternative (a file per project per language) doubles the file count and risks the two language versions drifting apart structurally over time, since nothing forces them to stay in sync. Keeping both languages side-by-side in one file means whoever edits a project (almost certainly just Anas) sees both versions at once, which is the strongest practical safeguard against the Arabic and English content quietly falling out of sync — a real risk on a solo-maintained bilingual site. Non-text fields (dates, links, image paths, tags) are stored once rather than duplicated, since they don't need translation at all.

**Illustrative shape** (fields, not final content):

```json
{
  "slug": "filefusion",
  "status": "active",
  "category": "desktop-application",
  "tags": ["python", "automation", "desktop"],
  "dates": { "started": "2024-01", "completed": "2024-06" },
  "cover": "assets/images/projects/filefusion/cover.webp",
  "gallery": [
    "assets/images/projects/filefusion/gallery-01.webp",
    "assets/images/projects/filefusion/gallery-02.webp"
  ],
  "links": { "github": "https://github.com/...", "demo": null },
  "technologies": ["Python", "SQLite"],

  "title":               { "en": "...", "ar": "..." },
  "description":         { "en": "...", "ar": "..." },
  "overview":            { "en": "...", "ar": "..." },
  "problem":             { "en": "...", "ar": "..." },
  "solution":            { "en": "...", "ar": "..." },
  "features":            { "en": ["...", "..."], "ar": ["...", "..."] },
  "architecture":        { "en": "...", "ar": "..." },
  "challenges":          { "en": "...", "ar": "..." },
  "lessonsLearned":      { "en": "...", "ar": "..." },
  "futureImprovements":  { "en": "...", "ar": "..." }
}
```

Note that `tags`, `technologies`, `dates`, `links`, `cover`, and `gallery` are *not* wrapped in `{en, ar}` — only genuinely narrative fields are. This keeps the file no larger than it needs to be.

**Graceful omission, at the data layer:** if a field like `futureImprovements` is `null` or absent, `projects.js` simply skips rendering that section of the Project Detail view — this is where the design doc's "no empty placeholders" rule actually gets implemented: as a single `if (field)` check per section, not a special case per project.

**`index.json`** is the one file that controls gallery order and which project is featured:

```json
[
  { "slug": "filefusion", "featured": true },
  { "slug": "shorker", "featured": false },
  { "slug": "salatapp", "featured": false }
]
```

Reordering the array or flipping `featured` changes the entire gallery's presentation without touching any project file or any JavaScript.

---

## 5. Localization Architecture

Two different translation strategies, deliberately, because UI strings and content narratives have different shapes:

- **Interface/chrome strings** (nav labels, button text, section headings) live in **flat per-locale files**: `/data/i18n/en.json`, `/data/i18n/ar.json` — a simple key → string map (e.g. `"nav.projects": "Projects"`). This is the standard i18n pattern, and it fits because these strings are short, numerous, and never need side-by-side authoring.
- **Content narratives** (projects, achievements, skills, Current Focus) use the **nested-per-field** approach from §4 — one file per entity, both languages inside it.

**Adding a third language later** touches nothing structural: add `fr.json` under `/data/i18n`, add an `"fr"` key next to `"en"`/`"ar"` in each content field, and add one entry to the language module's config array (§8). No existing file changes shape, and no component needs new logic.

**Detection and persistence:** browser language sets the default on first visit; an explicit toggle choice is remembered via `localStorage` (a completely standard, appropriate choice for a real deployed static site — this is unrelated to any sandboxed-preview restriction) so a returning visitor's manual choice sticks across sessions.

---

## 6. Images & Assets

- **Per-project subfolders** (`/assets/images/projects/<slug>/`) keep each project's screenshots self-contained — deleting a project later is a matter of deleting one folder and one JSON file.
- **Naming convention:** `cover.webp` (gallery card image), `cover@2x.webp` (high-DPI variant), `thumb.webp` (used only if a smaller crop is ever needed, e.g. Open Graph), `gallery-01.webp`, `gallery-02.webp`, … for the Project Detail image gallery. Predictable names mean `projects.js` never needs a manifest of filenames per project — it can be told the count via the project's JSON `gallery` array instead of guessing.
- **Format:** WebP (or AVIF where supported) as the primary format, exported at the actual display size needed rather than resized at runtime — this is a manual export discipline, a direct consequence of the no-build-step constraint (see §17).
- **Icons:** a single SVG sprite sheet referenced via `<use>`, so the icon set is one small cacheable file rather than dozens of tiny requests.
- **Fonts:** self-hosted and subsetted per script (Latin subset for the sans/serif pair, Arabic subset for the Arabic sans/Naskh pair) — never pulled from a third-party CDN, which avoids an external render-blocking dependency and keeps the whole site's network requests self-contained.

---

## 7. Documents (PDFs)

All PDFs live flat in `/assets/documents/`, referenced by `/data/documents.json` rather than hardcoded in HTML:

```json
[
  { "id": "resume-en", "label": { "en": "Resume (English)", "ar": "..." }, "file": "assets/documents/resume-en.pdf" },
  { "id": "resume-ar", "label": { "en": "Resume (Arabic)",  "ar": "..." }, "file": "assets/documents/resume-ar.pdf" },
  { "id": "portfolio", "label": { "en": "Supporting Portfolio", "ar": "..." }, "file": "assets/documents/supporting-portfolio.pdf" }
]
```

Future additions the brief flagged (recommendation letters, certificates) slot into this same array with a new `id` — the Documents section's three-button layout naturally extends to a fourth or fifth button, or, if the list grows meaningfully, this is the point where the design would need a follow-up decision (not an architecture blocker, just worth flagging that the current "three big buttons" layout was designed for three items).

---

## 8. JavaScript Architecture

**Loading strategy:** native ES modules via `<script type="module" src="js/core/app.js">` in `index.html` — the browser handles dependency resolution between modules directly, so there is deliberately no `script.js` monolith and no bundler standing between the code and the browser.

**Init sequence (`core/app.js`):**
1. Detect language (`localStorage` choice → else browser language → else English default).
2. Fetch `site.json`, the active `i18n` file, and `/data/projects/index.json` in parallel.
3. Render the static shell's text (nav, hero, section headers) from the i18n + site data.
4. Render the Projects gallery from `index.json` (fetching each project's full JSON is deferred — see §13).
5. Bind global listeners (nav scroll state, language toggle, `popstate` for the project-detail route).

**Module responsibilities:**

| Module | Responsibility |
|---|---|
| `nav.js` | Sticky/solidify-on-scroll behavior, scrollspy, mobile menu open/close + focus trap |
| `language.js` | Detection, toggle handling, `lang`/`dir` attribute updates, re-rendering active text, persisting choice |
| `projects.js` | Renders gallery cards; on click, fetches that project's full JSON, renders the Project Detail view, manages the shared-element transition and the hash route |
| `gallery.js` | Lightbox/enlarge behavior for the Project Detail image gallery |
| `animations.js` | IntersectionObserver-driven scroll reveals; respects `prefers-reduced-motion` globally |
| `theme.js` | Currently an empty hook — exists so dark mode (§9) is an additive module later, not a retrofit |
| `utils/i18n.js` | Given a data object and the active language, returns the correct string; also resolves flat i18n-key lookups |
| `utils/fetchJSON.js` | Thin `fetch` wrapper with error handling and a simple in-memory cache (so revisiting a project doesn't re-fetch its JSON) |
| `utils/dom.js` | Small, repeated DOM helpers shared across modules |

**Routing:** project detail views use **hash-based routing** — `index.html#/project/filefusion` — updated via the History API so the back/forward buttons and direct links both work correctly. Hash routing is the deliberate choice *specifically because* GitHub Pages serves static files with no server-side rewrite rules by default; a path-based route like `/project/filefusion` would 404 on a hard refresh unless additional GitHub Pages configuration (a 404.html redirect trick) is introduced — hash routing avoids that complexity entirely while keeping the "single HTML document" property intact.

---

## 9. CSS Architecture

A small, layered structure (a lightweight take on ITCSS), loaded via **explicit `<link>` tags in a fixed order** rather than native `@import` chaining — native `@import` is render-blocking and resolves serially, which would cost real performance for no organizational benefit; a handful of ordered `<link>` tags gives the same modularity without that cost.

| Layer | Contains |
|---|---|
| `base/` | Reset, design tokens (color, spacing, type scale as CSS custom properties), base typography |
| `layout/` | Grid, section rhythm/spacing, header, footer |
| `components/` | One file per component family — buttons, tags, project cards, the achievements index rows, the skill matrix, the current-focus banner, document buttons — matching the design doc's "distinct rhythm per section" directly at the file level |
| `utilities/` | Small, single-purpose helper classes |
| `animations/` | Keyframes and duration/easing tokens, referenced by component files rather than redefined per component |
| `rtl.css` | Only what logical properties can't cover |

**RTL strategy:** CSS logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`, etc.) are the primary mechanism — used throughout `layout/` and `components/` — so most of the site requires zero RTL-specific overrides at all. `rtl.css`, scoped under a `[dir="rtl"]` selector, only needs to handle the handful of cases logical properties genuinely can't (icon mirroring, the Arabic type-pair swap). This avoids the much heavier, higher-maintenance alternative of hand-mirroring an entire duplicate stylesheet.

**Dark mode (future):** because all color is expressed through the token layer in `base/`, dark mode later means adding one `[data-theme="dark"]` block that redefines those same token names — no component file needs to change. This is the single highest-leverage decision for that future feature, made now at effectively no cost.

---

## 10. Responsive Strategy

- **Breakpoints:** two functional breakpoints (roughly ~640px and ~960px) rather than a dense breakpoint list — matching the design doc's three real targets (mobile, tablet, desktop) without over-engineering intermediate states that were never designed for.
- **Fluid spacing/typography:** section rhythm and heading sizes use `clamp()` where practical, so the layout breathes smoothly between breakpoints instead of visibly jumping at exact pixel values.
- **Flexible grids:** CSS Grid/Flexbox with content-driven sizing (e.g. the Projects secondary grid, the Skill Matrix columns) rather than fixed pixel widths, so these components tolerate future content of slightly different lengths without breaking.

---

## 11. SEO Architecture

- **Static shell content:** the Hero, About, and Projects-gallery card summaries live directly in `index.html`'s markup (populated by JS on load, but structurally present), not injected from nowhere — this keeps the landing page's core content crawlable even by crawlers with limited JS execution.
- **Meta tags, Open Graph, Twitter Cards:** hand-maintained in `index.html`'s `<head>` at the site level (title, description, `og:image`, etc.) — this content changes rarely, so hand-maintenance is a reasonable, low-cost trade-off.
- **Structured data:** a single `Person` + `WebSite` JSON-LD block in `index.html`, hand-maintained alongside the meta tags.
- **`sitemap.xml` / `robots.txt` / canonical URL:** since this is architecturally a single HTML document (hash-based routing), the sitemap realistically lists one URL — this is expected and correct for this architecture, not a gap.
- **Honest limitation, flagged directly:** because project detail views render client-side and are reached via hash routes, a direct share of `index.html#/project/filefusion` will open correctly for a human visitor, but the *link-preview card* generated by messaging apps or social platforms will show the site-level Open Graph image/description, not a project-specific one — most crawlers that generate those previews don't execute JavaScript. For a personal portfolio at this scale, where the primary sharing pattern is the homepage as a whole, this is an acceptable trade-off rather than a flaw to solve immediately. If project-level preview cards become genuinely important later, that is specifically the point where introducing a minimal, optional pre-rendering step would earn its cost — not before.

---

## 12. Accessibility Architecture

- **Landmarks live in the static HTML shell** (`nav`, `main`, `section`, `footer`), not JS-injected — present even in the unlikely event JavaScript fails to load.
- **Skip link** is a static element at the very top of `index.html`, functional without JS.
- **Focus management** is centralized: `projects.js` moves focus to the Project Detail view's `h1` on entry and returns it to the originating card on exit; `nav.js` traps focus inside the open mobile menu. Both are small, explicit functions rather than incidental side effects scattered through render code.
- **`lang`/`dir` updates** happen in exactly one place (`language.js`), so screen readers and browser-native behaviors (spell-check, find-in-page) are never out of sync with the visible language.
- **ARIA** is used sparingly and only where semantic HTML genuinely can't express the relationship (e.g. the mobile menu's expanded/collapsed state) — semantic HTML is treated as the default, ARIA as the exception.

---

## 13. Performance Architecture

- **Critical rendering path:** kept simple rather than aggressively optimized — a small, explicit set of `<link>` stylesheets (§9) and one module-loaded JS entry point is already lightweight enough at this project's scale that inlining critical CSS is unnecessary complexity; worth revisiting only if real Lighthouse numbers ever demand it.
- **Preloading:** `<link rel="preload">` for the body-text font weights of both language scripts (small enough, once subsetted, that loading both costs little), while the sparingly-used display fonts (the Latin serif / Arabic Naskh pair, used only for H1s) load normally rather than being preloaded, since they're not needed for first paint.
- **Lazy loading:** images below the fold use native `loading="lazy"`. More importantly, **project JSON itself is fetched on demand** — a project's full detail data (problem/solution/architecture/gallery, etc.) loads only when its card is clicked, not upfront for all projects on page load. This is the single biggest performance lever as the project count grows toward the 20-project scenario in §14.
- **Caching/versioning:** GitHub Pages applies standard HTTP caching automatically. Because this site's content (Current Focus, project data) is meant to be updated often, returning visitors risk seeing stale cached JSON. The mitigation, given no build step, is manual: append a version query string (e.g. `?v=2026-07-16`) to data/CSS/JS URLs when publishing an update. This manual discipline is the one place in this architecture where a tiny, *optional* version-stamping script would pay for itself later — see §17.

---

## 14. Scalability Plan

Walking through the brief's three-year scenario (20 projects, 50 certificates, 15 achievements, 3 languages) against this architecture:

- **20 projects:** 20 files in `/data/projects/`, no file larger than one project's own content — `index.json` stays a short ordered list. Adding project #21 is one new JSON file plus one line in `index.json`; zero JavaScript changes.
- **50 certificates / 15 achievements:** a single `achievements.json` array is comfortable well past 15 entries. If certificate volume eventually makes one flat file unwieldy to hand-edit, the natural split is by year (`/data/achievements/2026.json`, `2027.json`, …) — which conveniently matches how the Achievements index is already displayed chronologically. This is a "cross that bridge" note, not a structure to build prematurely for today's numbers.
- **3 languages:** purely additive under the §5 strategy — a new locale file, a new key on each content field, one new entry in the language module's config. No existing content or component restructures.
- **Images:** the per-project-subfolder convention scales linearly regardless of project count and never requires a naming scheme rethink.

---

## 15. Future Feature Readiness

| Future feature | What the architecture already provides |
|---|---|
| Search | All content already lives in structured JSON — a new `modules/search.js` indexes what already exists; no data remodeling. |
| Project filtering / categories | The `category` and `tags` fields are already in the project schema (§4) specifically so a filter UI has something to key off later. |
| Blog | Would follow the exact same pattern as Projects — a `/data/blog/` folder + one new render module — the pattern is designed to be reused for new content types. |
| Timeline | Achievements already carry `year`/date fields, so a timeline view (if ever wanted, despite being explicitly excluded from the current design) wouldn't require new data. |
| Testimonials | Same data-driven pattern as above: new JSON file, new small module. |
| Dark mode | Already addressed structurally in §9 — a token swap, not a rewrite. |
| Analytics | A single, optional, async-loaded script tag; the architecture deliberately doesn't need to accommodate this specially. |
| GitHub integration (e.g. live repo stats) | A `modules/github.js` fetching the public GitHub API at runtime and merging into existing project data at render time — no backend required, though client-side API rate limits are a real constraint worth flagging if this is pursued. |

---

## 16. Architecture Decision Log

| Decision | Why |
|---|---|
| One JSON file per project, languages nested per field | Keeps both language versions of a project physically together, the strongest practical safeguard against drift for a solo maintainer. |
| Flat locale files for UI strings, nested fields for content | Different content shapes warrant different i18n strategies — UI chrome is short and numerous; narratives need side-by-side authoring. |
| Hash-based routing for project detail | GitHub Pages has no server-side rewrite rules by default; hash routes never hit the server, so they can't 404 on refresh. |
| `<link>` tags over native `@import` for CSS | Avoids `@import`'s serial, render-blocking resolution while keeping the same modular file structure. |
| Logical properties as the primary RTL mechanism | Means most of the CSS needs zero RTL-specific overrides, versus hand-mirroring an entire duplicate stylesheet. |
| Color expressed entirely through tokens | Makes future dark mode a token swap instead of a rewrite — the cheapest possible future-proofing. |
| Project JSON fetched on demand, not upfront | The single biggest lever for staying fast as the project count grows toward 20+. |
| Hand-maintained, site-level SEO metadata (not per-project) | An honest, scoped trade-off for a static, build-step-free architecture — revisited only if per-project sharing becomes a real need. |

---

## 17. Self-Review — Senior Architect Pass

- **Weakness — project-level social preview cards don't work without JS execution by the sharing platform.** Already flagged in §11 as an accepted trade-off, but worth restating plainly here as the single biggest architectural compromise in this document. *Mitigation, if it ever matters:* this is specifically where a minimal, optional pre-render script would be worth introducing — it wouldn't violate "no build step *required*," since the site would still work perfectly with zero tooling; the script would only exist to additionally generate static per-project meta tags for anyone who chooses to run it before deploying.

- **Weakness — manual cache-busting is a discipline, not a guarantee.** Relying on Anas to remember to bump a version query string every time he updates content is a real risk of stale-content bugs (a visitor seeing an old Current Focus line, for instance). *Mitigation:* same answer as above — a tiny, genuinely optional version-stamping script is the lowest-cost fix, deferred rather than mandatory, so the "open index.html and it just works" property is never compromised.

- **Weakness — the nested-per-field bilingual JSON makes each project file fairly long,** since every narrative field carries two full copies of its content. At today's scale (3 projects) this is a non-issue; it's worth naming now so it isn't mistaken for an oversight later. *Mitigation:* already accepted as the right trade-off in §4 — the alternative (split files) solves file length at the cost of a worse drift risk, and drift risk is the more damaging failure mode for a solo-maintained site.

- **Weakness — ten possible small JS modules is, itself, a form of sprawl if it ever grows unchecked.** The module count in §8 was deliberately capped rather than left open-ended; any future addition (search, blog, GitHub integration) should extend that same table rather than spawning ad hoc files outside the established `/core` · `/modules` · `/utils` structure, or the "clean, modular" property this whole document is built around starts to erode.
