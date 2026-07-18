# Portfolio Website — Design Document v2.0
**Prepared for:** Anas &nbsp;·&nbsp; **Supersedes:** v1.0 &nbsp;·&nbsp; **Scope:** Design direction only — no code

The identity established in v1.0, **"Quiet Confidence,"** is unchanged and remains the foundation everything below builds on. This is a refinement, not a reset — the palette, typography logic, spacing system, and component language from v1.0 all carry forward. What follows extends that foundation to cover the new decisions: bilingual support, a deeper project-viewing experience, a more distinct rhythm section-to-section, and three new sections (Language & Localization, Project Detail View, Current Focus).

### Summary of changes since v1.0

- **Bilingual (AR/EN):** browser-language auto-detection, RTL/LTR switching, in-nav toggle, no reload.
- **No modal for projects.** Replaced with a dedicated in-site Project Detail view reached by a smooth transition — see new §8.
- **Ten-part project content template** (Overview → Image Gallery) — see new §8.
- **Photo-optional Hero/About** — the design is now specified to look intentionally complete with zero photos.
- **Visual rhythm:** each major section now has a distinct layout personality (rationale in §1 and the Rhythm Map).
- **Skills** reframed from tag rows to a **Skill Matrix** (§10).
- **New "Current Focus" section** (§11).
- **Footer redesigned** away from generic copyright text (§14).
- Section numbering has shifted throughout to accommodate the above — this document is a complete standalone v2.0, not a diff.

---

## 1. Overall Design Concept

"Quiet Confidence" still means: the site behaves like a well-edited technical reference that happens to look beautiful, aimed at evaluators who are scanning for signal, not being sold to. Two refinements sharpen that in v2.0.

**A rhythm, not a repeat.** The brief now asks explicitly that sections not resemble each other. This is the right instinct — the v1.0 layout leaned on "card grid" as a default for almost everything, which risked the exact templated sameness the project set out to avoid. In v2.0, every major section is assigned a distinct layout *personality*, while all of them stay disciplined to the same palette, type, spacing, and component primitives underneath. Think of it as one voice speaking in different registers, not several different voices:

| Section | Layout personality |
|---|---|
| Hero | Editorial numbers row |
| About | Quiet, unbroken text block |
| Projects Gallery | Asymmetric, image-led (one featured + grid) |
| Project Detail | Long-form article with a wayfinding rail |
| Achievements | Structured index / list, text-led |
| Skills | Matrix — category rows × tag columns |
| Current Focus | Single-line banner, no card |
| Documents | Equal-weight button trio |
| Contact | Minimal text, no form |
| Footer | Personal sign-off, not a copyright bar |

**A second script, same character.** Arabic isn't treated as a translation layered on top of the English design — it's a first-class version of the same identity. The one deliberate "warm" typographic moment from v1.0 (a refined serif reserved for the H1) needs a genuine Arabic counterpart, not a fallback. Recommendation: pair a clean, modern Arabic sans (e.g. IBM Plex Sans Arabic or Cairo) for UI/body — the Arabic equivalent of the Latin humanist sans — with a refined Naskh-style face (e.g. Markazi Text or Aref Ruqaa) reserved *only* for the Arabic H1, mirroring the Latin serif's role exactly: one warm accent, everything else stays technical.

---

## 2. Website Structure

Updated page order:

1. **Hero**
2. **About**
3. **Projects Gallery** *(with Project Detail as a reachable sub-view, not a new page — see §8)*
4. **Achievements**
5. **Skills**
6. **Current Focus** *(new)*
7. **Documents**
8. **Contact**
9. **Footer**

**On keeping Projects ahead of Achievements despite the audience shift:** the brief now weights academic evaluators as the primary audience and wants achievements "immediately discoverable." That's already satisfied without reordering — the academic stat (GPA) sits first in the Hero's stats row, visible before any scrolling at all. Promoting Achievements above Projects would come at the cost of the brief's own standing rule that Projects is the heaviest, most important section; the two instructions would conflict if both were taken to their extreme. Keeping the order but reinforcing academic proof at the very top of the page (§5) resolves this without weakening either goal.

**Current Focus placement:** directly after Skills, before Documents. Read in sequence, the page now says: here's what I've built, here's proof I'm distinguished, here's what I know, here's what I'm working on *right now*, here's my formal paperwork, here's how to reach me. It's the one section that makes the site feel present-tense rather than a static record.

---

## 3. Language & Localization *(new)*

- **Detection:** on first load, the site reads the browser's language setting. Arabic-language browsers get the Arabic/RTL version by default; everything else gets English/LTR. This is a one-time default, not a lock — see toggle below.
- **Toggle:** a persistent, always-visible control in the navigation bar, showing the *other* language's label (e.g. a visitor on the English site sees "العربية"; a visitor on the Arabic site sees "English") so the control itself never requires translation to be understood.
- **Position:** the toggle stays in a fixed visual corner (top-right) regardless of language — it's a meta-control, not content, so it doesn't mirror with the rest of the layout. This matches the convention visitors already know from sites like Wikipedia and keeps the control findable by muscle memory in either language.
- **No reload:** switching language swaps text content and flips layout direction in place, with a brief 200ms cross-fade on the text so the change reads as a state change, not a page reload. Scroll position within the page is preserved.
- **Numerals:** stats and figures (GPA, hours, counts) stay in Western Arabic numerals (0–9) in both language versions — this is standard in professional/technical Arabic contexts and keeps the Hero's numbers instantly legible to any reviewer regardless of language.
- **`lang`/`dir` attributes** update with the toggle, which matters both for accessibility (screen readers announce the correct language) and for browser-native behaviors like spell-check and find-in-page.

---

## 4. Navigation

Unchanged in behavior from v1.0 (sticky, transparent-to-solid on scroll, scrollspy underline in the accent color, hamburger + full-screen overlay on mobile) with two additions:

- The **language toggle** sits at the far end of the nav, opposite the wordmark, in both language states (see §3).
- **RTL mirroring:** in Arabic, the wordmark moves to the right edge and the section links to the left, so the nav still reads start-to-end in the correct direction — everything mirrors *except* the language toggle, which stays anchored top-right as noted above. Any directional icon (the mobile menu's close arrow, a project page's back-chevron) flips horizontally in RTL so it still points toward "back" in the reading direction.

---

## 5. Hero Section

Structure, order, and the "no boxed stat cards, use an editorial numbers row" treatment all carry forward unchanged from v1.0. Two refinements:

- **Photo-free by design, not by omission.** The Hero was already photo-free in v1.0; v2.0 makes that a permanent, intentional design decision rather than a placeholder gap. The single-column, left-aligned text block is sized and spaced as a complete composition on its own — there is no empty frame or awkward gap waiting to be filled. If a photo is introduced later, it belongs in About (§6), not here — the Hero stays evidence-first permanently.
- **Academic primacy.** The GPA stat keeps its position as the first (leftmost, or first-in-reading-order in RTL) item in the four-stat row. Given the primary audience is now explicitly academic evaluators, the single most relevant fact to them is the first thing their eye lands on after the headline — no restructuring needed, just a confirmed ordering rule.

---

## 6. About Section & Photo Readiness *(new)*

150 words, no CV repetition, no grades or achievements — just learning philosophy, as specified in v1.0. Two design notes given the new photo requirement:

- **Layout without a photo:** a single centered or left-aligned text column, max-width ~640px, generous top/bottom padding, sitting on the off-white background — visually calm and complete on its own, matching the Hero's restraint rather than looking like a bio section missing its portrait.
- **Layout with a photo (future):** the column shifts to two zones — a modest, square-cropped photo (not a large hero-style portrait; kept small and quiet, consistent with "credibility before creativity") positioned beside or above the text block, with the text column keeping the same max-width and padding it already has. Because the text block's width and spacing never change, adding the photo is an additive layout change, not a redesign — exactly the requirement in the brief.

---

## 7. Projects Gallery

The gallery itself is unchanged from v1.0: FileFusion full-width and featured, ShorKer and SalatApp in a two-column grid beneath, same card structure (screenshot, title, short description, tech tags), same restrained hover (1.03 scale, deepened shadow, 200ms).

**What changes is where the button leads.** "View Details" (recommend renaming to **"Explore Project"**, since it now leads to a real destination rather than a popup) no longer opens a modal — it opens the Project Detail view described in §8, via a smooth in-site transition rather than a page reload.

**Transition:** the clicked card's screenshot expands and repositions to become the Project Detail page's header image, while the rest of the gallery fades out around it — a shared-element transition, ~400ms ease-out. This single piece of motion is what makes "navigating deeper into the website while preserving the same visual identity" actually *feel* true, rather than just being a structural claim.

---

## 8. Project Detail View *(new)*

This is the biggest structural addition in v2.0. Each project now has its own in-site view (not a URL-less popup, not a separate page look-and-feel) built from a fixed, ten-part template:

Overview → Problem → Solution → Key Features → Architecture → Technologies Used → Development Challenges → Lessons Learned → Future Improvements → Image Gallery

**Layout logic:**

- **Header:** the shared-element screenshot from the gallery card, now large, plus the project title, tech tag row, and any outbound links (GitHub, live demo) directly beneath — all visible without scrolling.
- **Body:** a long-form article layout — text sections constrained to a readable ~680px column (matching About's width, for consistency), while Architecture, Technologies Used, and Image Gallery are allowed to break out to full container width, since diagrams and screenshots need more room than prose. This "text stays narrow, visuals go wide" split is a standard editorial technique and keeps a nine-section page from feeling like a wall of text.
- **Wayfinding:** a slim sticky sub-navigation rail (desktop) listing the section names, letting an evaluator jump straight to, say, "Lessons Learned" or "Architecture" without scrolling past everything else — this is what keeps a long page compliant with "never make the visitor search." On mobile, this collapses to a small "Jump to section" dropdown beneath the header.
- **Graceful omission:** not every project will have meaningful content for all ten parts (a smaller project may not need "Future Improvements," for instance). Empty sections are simply not rendered — no "Coming soon," no empty headers. The wayfinding rail only lists sections that actually exist for that project.
- **Exit:** a persistent "← Back to Projects" control at the top of the view (the chevron flips for RTL), and a lightweight prev/next pattern at the very bottom ("← Previous Project · All Projects · Next Project →") so an interested evaluator can keep browsing without hunting for the way back. Returning to the gallery restores the visitor's prior scroll position.
- **Image Gallery section:** this is the one place on the whole site where a true image grid belongs — unlike Documents (explicitly kept gallery-free in v1.0), a project's supporting screenshots are exactly the kind of evidence this page exists to show. Simple grid, click to enlarge, no auto-advancing carousel.

---

## 9. Achievements Section

Redesigned away from the v1.0 card grid — which, under the new "distinct rhythm" rule, sat too close to the Projects grid's visual language.

**New layout: a structured index, not cards.** A single-column list of rows, each divided by a thin hairline (the same divider motif used in the Hero's stats row, tying the two sections together quietly): year on the left in the secondary gray, achievement name and organization in the middle in primary text weight, and a one-line description on the right (or beneath, on mobile). No borders, no shadows, no icons — the format itself, spare and text-led, is what signals "this is a record, not a decoration," and it reads unmistakably differently from the image-led Projects section sitting right above it.

---

## 10. Skills Section

Reframed from tag rows to a genuine **Skill Matrix**, per the brief — still no progress bars, percentages, stars, or circular indicators.

**Structure:** category as a fixed-width label column on the left (Programming Languages · Development Focus · Tools), with that category's tags laid out to the right in an aligned grid — even column widths, consistent row heights — rather than the organically wrapping tag rows from v1.0. The alignment into visible rows and columns is what earns the word "matrix": it reads as structured data, not a loose cloud of keywords.

- **Programming Languages:** Python · C# · JavaScript
- **Development Focus:** Desktop Development · Automation · APIs · Computer Vision · AI-Assisted Development
- **Tools:** Adobe Suite

**Mobile:** the grid alignment relaxes — categories stack as labeled blocks with their tags wrapping normally beneath. The row/column precision is a desktop-space luxury; on mobile, legibility wins over the matrix effect.

---

## 11. Current Focus *(new)*

A small, single-line banner — deliberately the lightest-weight section on the page, distinct from every card- or list-based section around it. A full-width strip with a very subtle background tint (barely off the page's off-white, just enough to read as its own band), a small static accent-colored dot (not animated — no pulsing, per the "nothing jumps" rule) functioning as a quiet "live" marker, and one or two sentences describing what's currently being learned or built.

This section exists purely to make the site feel present-tense. It should be the fastest section to update — no images, no structure to maintain — since its entire value is staying current.

---

## 12. Documents Section

Unchanged from v1.0: three equal-weight buttons (Resume Arabic, Resume English, Supporting Portfolio), no gallery, no previews. In the Arabic layout, the three buttons reorder right-to-left but keep identical sizing and spacing — this section was already one of the most RTL-neutral in the whole design, since it has no directional content beyond text alignment.

---

## 13. Contact Section

Unchanged from v1.0: Email as the prominent primary element, GitHub as secondary, no form, structured so a LinkedIn icon can be added later without a redesign. RTL flips the reading order of the icon row but changes nothing structurally.

---

## 14. Footer *(redesigned)*

v1.0 specified "one simple line" without much shape; the brief now explicitly asks for something more intentional than generic copyright text. New structure:

- **A single closing line**, in Anas's own voice rather than boilerplate — something that closes the page the way a well-written last paragraph closes an article, not a legal notice. (Exact wording to be written with Anas directly, but the register should match the Hero's: declarative and specific, not "Thanks for visiting!")
- Beneath that line, a **compact utility row**: Email and GitHub icons (repeated from Contact, for anyone who scrolled straight to the bottom), the language toggle, and a small "Anas · [current year]" mark — quieter and smaller than a legal copyright bar, but present.
- No "All rights reserved," no multi-column link farm, no social icon wall. The footer should feel like the site is ending on a considered sentence, not trailing off into template boilerplate.

---

## 15. Responsive Design

Carries forward the v1.0 mobile-redesign principles (each section gets its own mobile treatment, not a shrunk desktop copy), with additions for what's new:

- **Project Detail view:** the sticky wayfinding rail becomes a "Jump to section" dropdown directly beneath the header; the text-narrow/visuals-wide split collapses to a single full-width column; the prev/next footer stays but stacks vertically.
- **Achievements index:** each row's three zones (year / name+org / description) stack vertically within the row rather than sitting side by side, still separated by the hairline divider.
- **Skill Matrix:** relaxes from aligned grid to stacked labeled blocks, as noted in §10.
- **Current Focus:** the banner keeps its full-width strip treatment at every breakpoint — it's already simple enough not to need a mobile-specific version.
- **Language toggle:** stays visible in the mobile nav bar itself (not tucked inside the hamburger menu) — since it's a meta-control a visitor may want *before* deciding to explore the menu at all.

---

## 16. Animation Plan

Carries forward the full v1.0 table (scroll-reveal fades, card hovers, button transitions, nav solidify, mobile menu stagger — all unchanged) with three additions:

| Element | Animation | Duration | Trigger |
|---|---|---|---|
| Project card → Detail view | Shared-element expand: screenshot grows and repositions into the detail header; rest of gallery fades | ~400ms ease-out | Click "Explore Project" |
| Detail view → Gallery (back) | Reverse of the above; scroll position restored | ~350ms ease-out | Back control / back navigation |
| Language switch | Text cross-fade; layout direction flips instantly (no animated mirroring — a sliding flip would be disorienting, not smooth) | 200ms ease | Language toggle |

All motion — new and carried-over — continues to respect `prefers-reduced-motion`; for the shared-element transition specifically, reduced-motion visitors get an instant cut rather than the expand animation, with no loss of function.

---

## 17. Accessibility

Carries forward v1.0's contrast, focus-state, semantic-structure, modal-focus-trap (now applies to the mobile menu instead, since projects no longer use a modal), and alt-text requirements. Additions for v2.0:

- **`lang` and `dir` attributes** update immediately on language switch, so screen readers announce the correct language and browsers apply correct text-direction behavior automatically.
- **Project Detail navigation** is treated as a real navigation event for assistive tech: on entering a project's view, focus moves to that page's H1 (the project title), exactly as it would on a true page load — even though no reload occurs. On returning to the gallery, focus returns to the card that was activated.
- **Wayfinding rail / "Jump to section" control** is a real list of links, keyboard-navigable and screen-reader-labeled, not a decorative sidebar.

---

## 18. Performance Considerations

Carries forward v1.0's image optimization, lean-JS, and no-third-party-bloat principles. Additions for bilingual support and the new project architecture:

- **Fonts:** two separate font stacks (Latin + Arabic) are never loaded simultaneously — only the active language's fonts load, keeping the payload equivalent to a monolingual site rather than doubling it.
- **Project Detail views:** images (especially the Image Gallery section) lazy-load within each project view; the *next* likely project's header image can be preloaded on hover/focus of its gallery card for a snappier shared-element transition, without blocking the initial page load.
- **Client-side view changes** (gallery ↔ project detail) stay lightweight enough to preserve the 95+ Lighthouse target — this is a state change within one page, not a route requiring a fresh document load, so the performance cost should be closer to "open a menu" than "load a page."

---

## 19. Design Rationale

New and revised decisions from this version:

| Decision | Why |
|---|---|
| Language toggle stays fixed top-right even in RTL | It's a meta-control, not content — mirroring it would make it harder to find by habit, the opposite of the goal. |
| Numerals stay Western-Arabic (0–9) in both languages | Keeps the Hero's proof-points instantly legible to any reviewer, regardless of language — the numbers *are* the argument. |
| Project detail replaces modal with a shared-element in-site view | Satisfies "no popups, no new pages, feels like navigating deeper" all at once — a modal can't hold nine content sections gracefully; a full reload breaks the single-page promise. |
| Achievements moved from cards to an index/list | Under the new "distinct rhythm" rule, cards-next-to-cards (Projects, then Achievements) read as repetition; a text-led index is also a more honest format for pure historical facts. |
| Skills becomes a matrix, not wrapped tag rows | Grid alignment reads as structured data — closer to how a technical evaluator actually scans a competency list — while still avoiding the explicitly excluded bars/stars/percentages. |
| Current Focus kept intentionally light (no card, no image) | Its entire value is staying current; the less structure it has, the easier it is for Anas to actually keep it updated. |
| Footer rewritten as a closing line, not a copyright bar | Matches "the visitor should feel this was built by a person" — a legal-style footer is the last thing on the page and the last impression it leaves. |
| Photo-free Hero and About remain intentional, not provisional | Prevents the layout from ever looking like it's "waiting" for a photo — and keeps a clear, low-cost path to add one later. |

---

## 20. Self-Critique — Art Director Pass (v2.0)

- **Risk — nine content sections per project is a lot to ask Anas to write, consistently, for three projects.** A beautifully designed template with three inconsistently-filled pages would undercut the "handcrafted" impression faster than a simpler template would. *Mitigation:* the graceful-omission rule in §8 isn't just a UI nicety — it's what makes the template survivable. FileFusion, as the flagship, can carry the full ten parts; ShorKer and SalatApp can reasonably use a shorter subset (Overview, Problem, Solution, Key Features, Technologies, Gallery) without looking incomplete, since missing sections are invisible rather than shown as gaps.

- **Risk — the shared-element transition is the single most technically ambitious piece of this design**, and if it's ever implemented poorly (janky, misaligned, or slow on lower-end phones) it will actively work against "Quiet Confidence" rather than reinforcing it. *Mitigation worth flagging now, before implementation:* this interaction should be treated as optional polish, not a launch blocker — a simple cross-fade between gallery and detail view is a completely acceptable fallback that preserves every other decision in this document (no popups, no reload, same identity) if the full shared-element version proves too costly to build well.

- **Risk — bilingual support roughly doubles the content-writing burden** (every headline, description, achievement, and project section needs an Arabic and English version), which is a real project-management risk more than a design risk, but it will surface as a design problem if one language ends up polished and the other thin. *Mitigation:* nothing in this document requires both languages to launch simultaneously — the architecture supports adding Arabic content section-by-section after an English launch, or vice versa, without any layout change, since RTL/LTR switching is a structural capability independent of how much content exists in either language yet.

- **Risk — an index-style Achievements list, without any card treatment at all, might read as *less* important than the visually rich Projects section**, at exactly the moment the brief wants achievements to feel immediately discoverable. *Mitigation:* the index format is deliberately text-led rather than visually shrunk — using the full page width, a clear year column, and generous row height keeps it feeling substantial rather than like an afterthought; the distinction from Projects should read as "a different kind of evidence," not "a lesser one."
