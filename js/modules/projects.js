// modules/projects.js
import { state, subscribe } from '../core/state.js';
import { t } from '../utils/i18n.js';
import { $, createElement, createFocusTrap } from '../utils/dom.js';
import { fetchJSON } from '../utils/fetchJSON.js';
import { icon } from '../utils/icons.js';
import { open as openLightbox } from './gallery.js';

let projectsContainer = null;
let projectsDetails = [];

// Drawer overlay elements
let drawerBackdrop = null;
let detailDrawer = null;
let activeFocusTrap = null;
let triggerElement = null;

/**
 * Initializes the Projects module — the visual centerpiece of the site.
 */
export async function init() {
  console.log('[Projects Module] Initializing projects showcase...');
  projectsContainer = $('#projects');

  if (!projectsContainer) {
    console.warn('[Projects Module] Target container "#projects" not found in DOM.');
    return;
  }

  projectsContainer.className = 'projects-section';

  const index = state.projectsIndex;
  if (!index || index.length === 0) {
    console.warn('[Projects Module] No projects found in index state.');
    return;
  }

  try {
    console.log('[Projects Module] Fetching individual project schemas...');
    const detailPromises = index.map(p => fetchJSON(`./data/projects/${p.slug}.json`));
    projectsDetails = await Promise.all(detailPromises);

    // Create modal + backdrop shells once and append to body
    drawerBackdrop = createElement('div', { className: 'modal-backdrop' });
    detailDrawer = createElement('div', {
      className: 'project-modal',
      id: 'project-detail-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-hidden': 'true'
    });
    drawerBackdrop.appendChild(detailDrawer);
    document.body.appendChild(drawerBackdrop);

    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerBackdrop.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    subscribe('translations', () => {
      renderShowcase();
      if (drawerBackdrop.classList.contains('is-active')) {
        const openSlug = detailDrawer.dataset.activeSlug;
        if (openSlug) renderCaseStudy(openSlug);
      }
    });

    renderShowcase();
  } catch (error) {
    console.error('[Projects Module] Failed to load projects:', error);
  }
}

/**
 * Renders the section header and the project card grid.
 */
function renderShowcase() {
  if (!projectsContainer) return;
  projectsContainer.innerHTML = '';

  const eyebrowText = t('projects.eyebrow');
  const titleText = t('section.projects.title');

  const header = createElement('div', { className: 'section-header', 'data-reveal': '' }, [
    createElement('span', { className: 'eyebrow' }, eyebrowText),
    createElement('h2', { className: 'projects-title', id: 'projects-title' }, titleText)
  ]);

  const stage = createElement('div', { className: 'orbit-stage', id: 'orbit-stage', 'data-reveal': '' });
  const parallax = createElement('div', { className: 'orbit-parallax' });
  const tilt = createElement('div', { className: 'orbit-tilt' });
  const ring = createElement('div', { className: 'orbit-ring', id: 'orbit-ring' });

  projectsDetails.forEach((project, idx) => ring.appendChild(buildOrbitPanel(project, idx)));

  tilt.appendChild(ring);
  parallax.appendChild(tilt);
  stage.appendChild(parallax);

  const hintText = t('projects.orbit_hint') || (state.lang === 'ar' ? 'اسحب للتدوير — اضغط لعرض التفاصيل' : 'Drag to rotate — click a project to view details');
  const hint = createElement('p', { className: 'orbit-hint', 'data-reveal': '' }, hintText);

  projectsContainer.appendChild(header);
  projectsContainer.appendChild(stage);
  projectsContainer.appendChild(hint);

  initOrbitInteraction(stage, ring);
}

/**
 * Builds a single orbital panel for a project (adapted from the tooplate
 * "orbital ring" concept: panels arranged in a circle in 3D space).
 */
function buildOrbitPanel(project, idx) {
  const activeLang = state.lang;

  const panel = createElement('div', {
    className: 'orbit-panel',
    tabindex: '0',
    role: 'button',
    'aria-label': `${t('project.btn.study')}: ${project.title[activeLang]}`
  }, [
    createElement('img', {
      src: project.cover,
      alt: project.title[activeLang],
      className: 'orbit-panel-img',
      loading: idx === 0 ? 'eager' : 'lazy'
    }),
    createElement('div', { className: 'orbit-panel-body' }, [
      createElement('h3', { className: 'orbit-panel-title' }, project.title[activeLang]),
      createElement('p', { className: 'orbit-panel-desc' }, project.description[activeLang])
    ])
  ]);

  panel.addEventListener('click', () => {
    triggerElement = panel;
    openDrawer(project.slug);
  });
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerElement = panel;
      openDrawer(project.slug);
    }
  });

  return panel;
}

/**
 * Wires up drag-to-rotate + gentle auto-drift + mouse-parallax tilt for the
 * orbital ring, and positions each panel evenly around the circle.
 */
function initOrbitInteraction(stage, ring) {
  const panels = ring.querySelectorAll('.orbit-panel');
  const count = panels.length;
  if (!count) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Computes a swing radius that keeps every panel's worst-case horizontal
   * extent (center offset + half panel width, ignoring perspective
   * foreshortening as a conservative upper bound) inside the stage's own
   * width, so the ring never pushes the page into horizontal scroll and
   * cards never leave the viewport on narrow phones.
   */
  function computeRadius() {
    const stageWidth = stage.clientWidth || window.innerWidth;
    const firstPanel = panels[0];
    const panelWidth = firstPanel ? firstPanel.getBoundingClientRect().width : 240;
    const idealRadius = window.innerWidth < 480 ? 190 : (window.innerWidth < 720 ? 260 : 420);
    const maxSafeRadius = Math.max(80, stageWidth / 2 - panelWidth / 2 - 8);
    return Math.min(idealRadius, maxSafeRadius);
  }

  let radius = computeRadius();

  function positionPanels() {
    panels.forEach((panel, i) => {
      const angle = (360 / count) * i;
      panel.style.setProperty('--ry', angle + 'deg');
      panel.style.setProperty('--tz', radius + 'px');
    });
  }
  positionPanels();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      radius = computeRadius();
      positionPanels();
    }, 150);
  });
  window.addEventListener('orientationchange', () => {
    radius = computeRadius();
    positionPanels();
  });

  let rotation = 0;
  let velocity = 0;
  const baseDrift = reduceMotion ? 0 : 0.08;
  const friction = 0.94;
  let dragging = false;
  let lastX = 0;
  let startX = 0;
  let startY = 0;
  let dragDistance = 0;

  function tick() {
    if (!dragging) {
      velocity *= friction;
      rotation += velocity + baseDrift;
    }
    ring.style.transform = `rotateY(${rotation}deg)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // NOTE: we deliberately avoid setPointerCapture here — capturing on the
  // stage retargets the resulting "click" event to the stage itself,
  // which silently swallows clicks on individual panels. Instead we track
  // total pointer travel and only treat it as a drag past a small threshold,
  // letting genuine clicks pass through to each panel's own listener.
  stage.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    startX = e.clientX;
    startY = e.clientY;
    dragDistance = 0;
    stage.classList.add('dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    rotation += dx * 0.32;
    velocity = dx * 0.32;
    dragDistance += Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY);
  });
  window.addEventListener('pointerup', () => {
    dragging = false;
    stage.classList.remove('dragging');
  });
  window.addEventListener('pointercancel', () => {
    dragging = false;
    stage.classList.remove('dragging');
  });

  // Suppress the click that follows a real drag (distance-based threshold),
  // but let true taps/clicks on a panel open its case study normally.
  stage.addEventListener('click', (e) => {
    if (dragDistance > 8) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  if (!reduceMotion) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      stage.querySelector('.orbit-tilt').style.transform = `rotateX(${-mx * 6 - 16}deg)`;
    });
  }
}

/**
 * Opens the case-study drawer for a given project slug.
 */
function openDrawer(slug) {
  if (!detailDrawer || !drawerBackdrop) return;

  renderCaseStudy(slug);
  detailDrawer.dataset.activeSlug = slug;

  drawerBackdrop.classList.add('is-active');
  detailDrawer.setAttribute('aria-hidden', 'false');

  document.body.style.overflow = 'hidden';
  activeFocusTrap = createFocusTrap(detailDrawer);

  const closeBtn = detailDrawer.querySelector('.drawer-close-btn');
  if (closeBtn) closeBtn.focus();
}

/**
 * Closes the case-study modal.
 */
function closeDrawer() {
  if (!detailDrawer || !drawerBackdrop) return;

  drawerBackdrop.classList.remove('is-active');
  detailDrawer.setAttribute('aria-hidden', 'true');

  document.body.style.overflow = '';

  if (activeFocusTrap) {
    activeFocusTrap();
    activeFocusTrap = null;
  }

  if (triggerElement) {
    triggerElement.focus();
    triggerElement = null;
  }
}

/**
 * Renders the full case-study content inside the drawer: a sticky header
 * with a scroll-progress indicator, a hero screenshot, a compact meta
 * grid, then a flow of short, scannable sections (no table of contents,
 * no "publication" framing).
 */
function renderCaseStudy(slug) {
  if (!detailDrawer) return;

  const activeLang = state.lang;
  const project = projectsDetails.find(p => p.slug === slug);

  if (!project) {
    console.warn(`[Projects Module] Project details for "${slug}" not found.`);
    return;
  }

  const closeBtn = createElement('button', {
    className: 'btn-icon drawer-close-btn modal-close-btn',
    type: 'button',
    'aria-label': t('project.btn.close') || 'Close'
  }, [icon('close')]);
  closeBtn.addEventListener('click', closeDrawer);

  const heroFrame = createElement('div', { className: 'drawer-hero modal-hero-wrap' }, [
    createElement('img', {
      src: project.cover,
      alt: `${project.title[activeLang]} cover`,
      className: 'modal-hero-img'
    })
  ]);

  const statusPill = createElement('span', {
    className: 'status-pill',
    dataset: { status: project.status }
  }, t(`status.${project.status}`));

  const titleBlock = createElement('div', { className: 'drawer-title-block' }, [
    statusPill,
    createElement('h1', { className: 'drawer-title' }, project.title[activeLang]),
    createElement('p', { className: 'drawer-tagline' }, project.description[activeLang])
  ]);

  const actionLinks = [];

  if (project.links.demo) {
    actionLinks.push(createElement('a', {
      href: project.links.demo,
      className: 'btn-primary',
      target: '_blank',
      rel: 'noopener noreferrer'
    }, [t('project.btn.demo'), icon('arrowUpRight', 'icon icon-sm')]));
  }
  const actionsRow = actionLinks.length ? createElement('div', { className: 'drawer-actions' }, actionLinks) : null;

  const titleRow = createElement('div', { className: 'drawer-title-row' },
    [titleBlock, actionsRow].filter(Boolean));

  const yearCompleted = project.dates.completed
    ? project.dates.completed.split('-')[0]
    : project.dates.started.split('-')[0];

  const metaGrid = createElement('div', { className: 'drawer-meta-grid' }, [
    createMetaCell(t('project.fact.language'), t(`project.lang.${project.slug}`)),
    createMetaCell(t('project.fact.platform'), t(`project.category.${project.slug}`)),
    createMetaCell(t('project.fact.architecture'), t(`project.arch.${project.slug}`)),
    createMetaCell(t('project.fact.year'), yearCompleted)
  ]);

  const blocks = [];

  // Overview
  blocks.push(createBlock(t('project.sec.overview'), [
    createElement('p', { className: 'cs-text' }, project.overview[activeLang])
  ]));

  // Key features (previously-unused structured data, rendered as a scannable checklist)
  if (project.features && project.features[activeLang] && project.features[activeLang].length) {
    const list = createElement('ul', { className: 'cs-feature-list' },
      project.features[activeLang].map(feature => createElement('li', { className: 'cs-feature-item' }, [
        icon('check', 'icon icon-sm cs-feature-icon'),
        createElement('span', {}, feature)
      ]))
    );
    blocks.push(createBlock(t('project.sec.features') || (activeLang === 'ar' ? 'أبرز الميزات' : 'Key features'), [list]));
  }

  // Problem / Solution
  blocks.push(createBlock(null, [
    createElement('div', { className: 'cs-split' }, [
      createElement('div', { className: 'cs-split-item' }, [
        createElement('span', { className: 'cs-split-label' }, t('project.sec.problem')),
        createElement('p', { className: 'cs-text' }, project.problem[activeLang])
      ]),
      createElement('div', { className: 'cs-split-item' }, [
        createElement('span', { className: 'cs-split-label' }, t('project.sec.solution')),
        createElement('p', { className: 'cs-text' }, project.solution[activeLang])
      ])
    ])
  ], 'cs-block--split'));

  // Architecture & challenges
  if (project.architecture || project.challenges) {
    const children = [];
    if (project.architecture) {
      children.push(createElement('span', { className: 'cs-split-label' }, t('project.sec.architecture')));
      children.push(createElement('p', { className: 'cs-text' }, project.architecture[activeLang]));
    }
    if (project.challenges) {
      children.push(createElement('span', { className: 'cs-split-label', style: 'margin-top: var(--space-md);' }, t('project.sec.challenges')));
      children.push(createElement('p', { className: 'cs-text' }, project.challenges[activeLang]));
    }
    blocks.push(createBlock(t('project.sec.decisions'), children));
  }

  // Gallery
  if (project.gallery && project.gallery.length > 0) {
    const galleryGrid = createElement('div', { className: 'cs-gallery-grid' });
    project.gallery.forEach(imgUrl => {
      const frame = createElement('button', {
        className: 'cs-gallery-frame',
        type: 'button',
        'aria-label': `${activeLang === 'ar' ? 'تكبير الصورة' : 'Expand image'}: ${project.title[activeLang]}`
      }, [
        createElement('img', {
          src: imgUrl,
          alt: `${project.title[activeLang]} gallery`,
          className: 'cs-gallery-img',
          loading: 'lazy'
        })
      ]);
      frame.addEventListener('click', () => openLightbox(imgUrl, project.title[activeLang], frame));
      galleryGrid.appendChild(frame);
    });
    blocks.push(createBlock(t('project.sec.gallery'), [galleryGrid]));
  }

  // Technologies
  const techTags = createElement('div', { className: 'tag-row' },
    project.technologies.map(tech => createElement('span', { className: 'tag' }, tech))
  );
  blocks.push(createBlock(t('project.sec.technologies'), [techTags]));

  // Outcome
  if (project.lessonsLearned || project.futureImprovements) {
    const children = [];
    if (project.lessonsLearned) {
      children.push(createElement('span', { className: 'cs-split-label' }, t('project.sec.lessons')));
      children.push(createElement('p', { className: 'cs-text' }, project.lessonsLearned[activeLang]));
    }
    if (project.futureImprovements) {
      children.push(createElement('span', { className: 'cs-split-label', style: 'margin-top: var(--space-md);' }, t('project.sec.future')));
      children.push(createElement('p', { className: 'cs-text' }, project.futureImprovements[activeLang]));
    }
    blocks.push(createBlock(t('project.sec.outcome'), children));
  }

  const content = createElement('div', { className: 'drawer-content modal-body' }, [
    titleRow, metaGrid, ...blocks
  ]);

  detailDrawer.innerHTML = '';
  detailDrawer.appendChild(closeBtn);
  detailDrawer.appendChild(heroFrame);
  detailDrawer.appendChild(content);
  detailDrawer.scrollTop = 0;
}

/**
 * Builds a labeled content block/section used throughout the case study.
 */
function createBlock(title, children, extraClass = '') {
  const nodes = title ? [createElement('h3', { className: 'cs-block-title' }, title), ...children] : children;
  return createElement('section', { className: `cs-block${extraClass ? ' ' + extraClass : ''}` }, nodes);
}

/**
 * Builds a single compact meta grid cell (language, platform, etc).
 */
function createMetaCell(label, value) {
  return createElement('div', { className: 'meta-cell' }, [
    createElement('span', { className: 'meta-cell-label' }, label),
    createElement('span', { className: 'meta-cell-value' }, value)
  ]);
}

export default { init };
