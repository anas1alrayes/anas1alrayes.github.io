# Project Design Language — "Technical Editorial"
**Document Status:** Approved & Finalized · **Role:** Project Visual Identity and UI System Core

---

## 1. Visual Philosophy: The Technical Editorial
The visual identity of Anas's Portfolio Website is built upon the concept of **"Technical Editorial."** It represents a deliberate departure from the saturated, hyper-animated, rounded SaaS templates that dominate the modern web. Instead, it seeks inspiration from classical printing, typographic monograph journals, and technical ledgers.

The core philosophy is **Restrained Precision**. We treat the browser window not as a marketing canvas, but as a high-grade paper page that contains a structured record. Visual quality is achieved not through decorative elements, but through:
- **Typographic Authority:** Allowing letterforms and layout grids to carry the design.
- **Structural Integrity:** Using crisp hairline boundaries that act as the structural borders of information.
- **Asymmetric Balance:** Aligning content to structured grids with generous white margins, allowing the eye to navigate naturally.
- **Tactile Contrast:** Balancing the cold utility of technical grids with the organic warmth of a refined serif header and a single, human-made accent color.

---

## 2. Design Personality
Keywords define the boundary of what belongs to the project and what must be rejected.

| Characteristic | What it is | What it is NOT |
|---|---|---|
| **Handcrafted** | Visual details feel designed by a human eye for this specific content. | Template-like, generic, or AI-generated look. |
| **Technical** | Aligned, precise, and documented. | Cyberpunk, neon-lit, or sci-fi. |
| **Scholastic** | Clean, serious, focused on academic and developmental achievements. | SaaS landing page, conversion-funnel optimization. |
| **Elegant** | Restrained, quiet, and balanced. | Saturated, loud, or over-decorated. |
| **Confident** | Silent, letting proof and work do the talking. | Self-promotional, boasting, or sales-oriented. |

---

## 3. Emotional Tone
The website must evoke a sense of **Quiet Competence** and **Academic Trust**.
When an evaluator (admission committee, scholarship board, or engineering lead) lands on the page, the immediate impression should feel like opening a well-typeset dissertation, an architectural blueprint, or a museum archive. The atmosphere is calm, clean, and highly structured. There is no feeling of being "sold" a product; instead, there is the quiet satisfaction of discovering verified competence.

---

## 4. Typography Principles
Typography is the primary visual carrier of the website. We do not use typography as a wrapper for layout; typography *is* the layout.

### Font Pairing System
We establish a bilingual, dual-class typographic system that mirrors the roles of warmth and precision in both English (LTR) and Arabic (RTL).

*   **Latin LTR:**
    *   *Display / Headers:* A warm, elegant serif (e.g., **Lora** or **Merriweather**).
    *   *UI / Body:* A clean, highly legible humanist sans-serif (e.g., **Inter** or **IBM Plex Sans**).
*   **Arabic RTL:**
    *   *Display / Headers:* A refined, classical Naskh-style face (e.g., **Markazi Text** or **Aref Ruqaa**).
    *   *UI / Body:* A clean, modern sans-serif (e.g., **IBM Plex Sans Arabic** or **Cairo**).

### Typographic Hierarchy & Settings

| Token | Desktop Size | Mobile Size | Weight | Line Height | Tracking | Role / Context |
|---|---|---|---|---|---|---|
| `display-h1` | 44px | 28px | 500 (Serif) | 1.15 | -0.01em | English Serif H1 / Arabic Naskh H1 |
| `display-h2` | 32px | 22px | 600 (Sans) | 1.20 | -0.015em | Major Section Titles (Sans) |
| `heading-lg` | 20px | 18px | 600 (Sans) | 1.30 | -0.01em | Card Titles, Project Matrix headers |
| `body-lead` | 17px | 16px | 400 (Sans) | 1.60 | 0 | Lead prose, About section paragraphs |
| `body-regular` | 15px | 14px | 400 (Sans) | 1.55 | 0 | Default body text, description blocks |
| `tabular-data` | 14px | 13px | 400 (Sans) | 1.50 | -0.02em | Numerics, GPA, Hours, Dates (uses `tnum`) |
| `interface-meta` | 12px | 11px | 500 (Sans) | 1.20 | 0.05em | Nav links, Tags, Buttons, Eyebrows |

### Typographic Rules
- **Negative Tracking on Display:** Large Sans headlines (`display-h2`) must have slightly tightened tracking (`-0.015em`) to consolidate the letterforms on screen. Serif displays (`display-h1`) hold a minor `-0.01em` to keep their elegance.
- **Generous Body Leading:** Body paragraphs must carry a minimum of `1.55` leading for English and `1.65` for Arabic. Arabic characters require more vertical breathing room to prevent descenders and ascenders from crowding.
- **Tabular Figures (`tnum`):** All numeric data (GPA, Volunteer Hours, Project dates, Matrix alignment numbers) must utilize `font-feature-settings: "tnum"` to enforce equal-width numbers. This keeps structured lists and statistical rows perfectly aligned.

---

## 5. Spacing Philosophy
Our spacing system is based on **absolute margins**, drawing inspiration from page layouts in printed literature and physical drawing blocks.
- **Scale Base:** A strict 8px grid hierarchy: `8px` (micro), `16px` (spacing-sm), `24px` (spacing-md), `32px` (spacing-lg), `48px` (spacing-xl), `64px` (spacing-xxl), `96px` (section-padding).
- **Rhythm over Randomness:** Content block groups are separated by `24px` or `32px`. Sections are separated by exactly `96px` on desktop and `64px` on mobile. No arbitrary spacing values are permitted.
- **Uncompromised Margins:** Content is never allowed to run to the absolute edge of its container. A generous structural margin of at least `32px` on desktop and `20px` on mobile is maintained horizontally to frame the portfolio like a sheet of paper.

---

## 6. Layout Philosophy
The layout must feel like structured documentation rather than a fluid, random SaaS dashboard.

- **Asymmetric Grid:** Rather than centering every item in a rigid column, layout elements stack with intentional asymmetry. Left-aligned text blocks (LTR) and right-aligned text blocks (RTL) balance against spacious empty areas on the opposite side.
- **Rhythm Map:** Alternating layout densities prevent visual fatigue. A dense numbers row is followed by a quiet, single-column text block, which is followed by an image-rich asymmetric grid, and then a clean, line-divided list (Achievements).

---

## 7. Card Philosophy
We reject the standard SaaS "floating card" (heavy drop shadows, large borders, highly rounded corners). Our cards are **Technical Index Panels**:
- **Geometry:** Corner rounding is kept minimal (`2px` to `4px` maximum) or completely sharp (`0px`) where elements align with layout dividers. This represents clean, technical drawing cards rather than bubbly interface modules.
- **Elevation:** Cards do not float. They are completely flat (`box-shadow: none`).
- **Boundaries:** Cards are defined by thin `1px` hairline rules using the system's soft grey divider, or a solid, flat background color shift (`surface-offset`).
- **Interactions:** On hover, a card does not lift or grow a massive shadow. It undergoes a subtle, restrained transform (e.g., a quiet 200ms background tint shift or a hairline border color transition to a slightly deeper shade).

---

## 8. Navigation Philosophy
The navigation bar is a **low-profile wayfinding utility**, not an ornamental banner.
- **Behavior:** Pinned to the top of the viewport. Transparent on load, shifting to a solid, thin background upon scroll with a clean `1px` hairline boundary at the bottom.
- **Links:** Navigation links use small, uppercase sans-serif type (`interface-meta`) with generous letter-spacing.
- **RTL Handled Correctly:** When toggling from English to Arabic, the layout mirrors completely: the wordmark moves to the right, and links move to the left. The only exception is the **Language Toggle**, which stays fixed in the top-right visual corner in both modes, ensuring it remains an easily discoverable meta-control.

---

## 9. Motion Philosophy
Animations are slow, mechanical, and inertial. They simulate physical drafting or print-making rather than digital software.
- **Duration:** All transitions sit between `200ms` (hover states, language toggles) and `400ms` (major section reveals, project view shifts).
- **Easing:** We use a strict cubic-bezier easing `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutExpo) which provides a swift initial movement followed by a long, smooth deceleration. This gives the interface a premium, mechanical inertia.
- **Shared-Element Transition:** When navigating from the Projects gallery to a Project Detail view, the screenshot from the card grows and shifts in place to become the header of the detail view. The surrounding cards fade out. If the user has `prefers-reduced-motion` enabled, this transition instantly falls back to a clean, instant cross-fade.

---

## 10. Image Philosophy
Images (screenshots, project diagrams) are treated as **engravings or high-resolution technical diagrams**.
- **Frame:** All images are locked inside a `1px` hairline border. There are no loose, unframed images.
- **Treatment:** We avoid glowing overlays or neon borders on images. Screenshots should represent the actual software product in clean, neutral frames.
- **Layout:** Prose text stays narrow (`680px` max-width), but complex images, database architectures, and engineering flowcharts are permitted to break out to the full container width (`1200px`) to ensure technical detail is fully legible.

---

## 11. Icon Philosophy
Icons are treated as **technical annotations**, similar to symbols on a blueprint.
- **Geometry:** Icons are strictly monoline, geometric, and drawn on a consistent pixel grid (typically `16x16px` or `20x20px`).
- **Weight:** The line weight of the icon must match the stroke weight of the surrounding typography to ensure visual unity.
- **Usage:** Icons are never used as decorative illustrations. They only exist to clarify action (e.g., a small arrow indicating an external link, a document symbol for downloads, or an envelope for contact).

---

## 12. Color Usage Philosophy
Our color palette is restricted, focusing on high-contrast ink and paper tones. We establish a single accent color that represents human touch and handcrafted precision.

*   **Canvas (`#FAF9F6`):** A warm, premium off-white that resembles high-grade paper, reducing screen glare and providing a tactile foundation.
*   **Text (`#1A1A1C`):** A deep carbon ink. We avoid pure `#000000` (black) for body copy to keep text readable and natural, reserving true black for extreme display emphasis.
*   **Dividers (`#E6E4E0`):** A soft lead grey used for hairline dividers, card borders, and grid alignments.
*   **Accent: Seal Crimson (`#A63A2B`):** A deep, warm, mineral crimson reminiscent of classical seal wax, terracotta clay, or red ink annotations in academic texts. It is used sparingly (no more than 5% of any viewport) for scrollspy indicators, active navigation states, primary button backgrounds, and interactive text links.
*   **Dark Mode / Charcoal Fallback:** For dark canvases (such as the Project Detail view background adjustments or dark mode toggles), the canvas flips to a deep charcoal (`#121314` or `#161718`) and text turns to off-white (`#F8F9FA`). Saturated neon colors are strictly forbidden.

---

## 13. Accessibility Principles
Accessibility is a structural requirement of the design system, not a post-launch optimization.
- **Contrast Ratios:** Text on the warm canvas must meet or exceed WCAG AA requirements (minimum `4.5:1` for body text, `3:1` for displays). The Seal Crimson accent on off-white must maintain at least `4.8:1`.
- **Keyboard Navigation:** Every interactive element must carry a visible, high-contrast focus state (using a clean `2px` solid Seal Crimson outline or underline). Tab order must follow the visual layout (top-to-bottom, LTR or RTL depending on active language).
- **Semantic Structure:** The document tree must follow a strict single `<h1>` hierarchy per view state. Screen readers must be announced of view changes (such as entering a project detail view) by programmatically moving focus to the new section's H1.
- **Immediate Lang/Dir Updates:** Toggling language must update the `lang` (e.g., `ar` or `en`) and `dir` (e.g., `rtl` or `ltr`) attributes on the `<html>` tag instantly, enabling browser-native translation and screen-reader engines to adapt.

---

## 14. Mobile Design Principles
Mobile is not a scaled-down desktop screen. It is an independent, portrait-first layout.
- **Touch Targets:** All interactive elements must maintain a minimum target size of `44x44px` (buttons, nav links, tags).
- **Grid Simplification:** The asymmetric grids of the Projects section and the Skill Matrix relax into clean, stacked vertical blocks on mobile. Legibility and scroll speed take precedence over grid alignment.
- **Sticky Meta-Controls:** The Language Toggle remains in the visible header at all times, never hidden inside a hamburger menu. Toggling language on a phone must be achievable in a single tap.
- **RTL Mirroring:** Swipe directions, back chevrons, close menu icons, and reading sequences mirror perfectly in Arabic.

---

## 15. Desktop Design Principles
The desktop experience utilizes the wide horizontal canvas to showcase structural alignments.
- **Max Width Constraint:** Content container width is capped at `1200px`. On wider displays (such as 1440px or ultrawide monitors), the extra width is absorbed by outer margins, keeping the centered reading column stable.
- **Tabular Lists:** Achievements and skills align into visible, multi-column matrix formats, taking advantage of the horizontal width to present structured data cleanly.
- **Sticky Wayfinding Rail:** The Project Detail view utilizes a slim, sticky sub-navigation rail on the left (or right in RTL) allowing users to jump between the ten project sections without scrolling.

---

## 16. Performance-Oriented Design Decisions
Performance is an aesthetic. A fast, responsive page establishes trust immediately.
- **Typographic Payload:** We load only the active language's web fonts. When the English site is active, Arabic web fonts are not requested; when the language is toggled, the fonts are fetched dynamically. This keeps the initial page payload exceptionally light.
- **Media Optimization:** All screenshots utilize modern `srcset` parameters and are compressed to WebP format. Images below the fold are lazy-loaded by default.
- **CSS-Driven Effects:** We avoid heavy Javascript libraries for shadows, blurs, or parallax scrolls. All layout structures, sticky bars, and transitions are handled natively by CSS, keeping the main thread free.

---

## 17. Component Consistency Rules
To maintain the visual identity across the single-page application, every component must adhere to these rules:

1. **Rule of the Single Accent:** A component may only contain the Seal Crimson accent color if it is interactive (button, active link, form input focus). Static decorative components must remain monochrome (Carbon, White, Lead Grey).
2. **Rule of Hairline Boundaries:** Component borders must never exceed `1px` in thickness. Heavy borders or borders with large drop shadows are prohibited.
3. **Rule of Aligned Radii:** Radii must fall strictly into the following category buckets:
   - `0px` (sharp) for full-bleed bands, section headers, and grid divider ends.
   - `2px` to `4px` for small index cards, tech tags, and matrix items.
   - `9999px` (pill) for primary buttons, input fields, and search bars.
4. **Rule of Bilingual Parity:** Every component must have a documented RTL mirror state. If a component contains a direction indicator (arrow, chevron, bullet list), that indicator must mirror orientation in the Arabic layout.

---

## 18. Visual Hierarchy Rules
Visual importance is communicated through scale and typographic weight, never through loud decorations.
- **First Level (Hero Name / Project Title):** Large Serif H1 (`display-h1`), Carbon Ink color.
- **Second Level (Section Titles / Featured Card Header):** Medium Sans H2 (`display-h2`), Carbon Ink color, uppercase meta eyebrow in secondary grey above.
- **Third Level (Primary Action / Stat Value):** Sans bold (`heading-lg`), or tabular figures (`tabular-data`) in Seal Crimson or Carbon Ink.
- **Fourth Level (Body Prose / Description):** Sans regular (`body-regular` or `body-lead`), Carbon Ink, comfortable line height.
- **Fifth Level (Metadata / Tags / Secondary Action):** Small Sans grey (`interface-meta`), Lead Grey or subdued ink color.

---

## 19. Common Mistakes to Avoid
- **Color Overload:** Do not introduce secondary or tertiary brand accent colors (such as electric blue, neon green, or purple). The only accent is Seal Crimson.
- **Card Floating:** Do not add drop shadows to card containers to make them "pop." Keep cards flat and boundary-defined.
- **Typographic Inconsistency:** Do not use the Serif typeface for UI labels, buttons, or metadata. The Serif is reserved *strictly* for the H1 title in both English and Arabic.
- **Arbitrary Radii:** Do not use `8px` or `12px` border-radius values on cards. They look like SaaS landing page components and break the "Technical Editorial" identity. Keep cards at `2px` to `4px` or sharp `0px`.

---

## 20. AI Design Patterns to Avoid
AI-generated website designs often reuse standard templates that look modern but lack handcrafted identity. We explicitly ban the following:
- **Gradient Blobs:** Large, blurred, floating colorful circles behind text.
- **Floating Glass Cards:** Semitranslucent cards with heavy backdrops and borders floating over gradient backgrounds.
- **Bouncing / Pulsing Elements:** Live indicator dots that pulse, bounce animations on scroll, or rotating icons.
- **Generic Progress Bars:** Circular percentages or bars representing skill levels (e.g., "Python 90%"). Use the Skill Matrix tag columns instead.
- **Sales CTAs:** Giant "Join Now" or "Get Started" buttons that feel like subscription products rather than an academic portfolio.

---

## 21. Future Scalability Principles
The design language is designed to scale with Anas's career growth.
- **Photo-Optional Hero:** The Hero layout is balanced to look complete with typography and statistics alone. If a portrait photo is introduced in the future, it fits cleanly in the About section as a modest, square-cropped frame, shifting the text column beside it without requiring a layout redesign.
- **Graceful Omission in Projects:** The 10-part Project Detail template handles missing data gracefully. If a project does not have "Future Improvements" or "Development Challenges," those sections are omitted from the DOM, and the left wayfinding rail adjusts its links dynamically without leaving empty gaps in the layout.
- **Accordion Indexing:** If the Achievements list grows from 5 to 50 items over the years, the structured index row format scales vertically without breaking the visual balance, whereas a card grid would quickly look cluttered.
- **Modular Sections:** New sections (e.g., certificates, publications, languages) can be added as new line-divided list components, maintaining the rhythmic structure of the page.
