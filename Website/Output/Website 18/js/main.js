/* ClearTax Design System — docs shell.
   Local-only deps: self-hosted GSAP for transitions. Routing, the "On this
   page" rail, nav accordion, filters, token downloads, and the gallery
   lightbox are all hand-rolled so the page works from a plain file:// open. */

const ROUTES = [
  'overview', 'brand-overview', 'logo', 'color', 'typography', 'spacing', 'shadows', 'layout', 'icons', 'illustrations', 'pattern', 'components',
  'motion', 'accessibility',
  'tokens', 'tokens-primitives', 'tokens-semantics', 'tokens-typography',
  'tokens-spacing', 'tokens-border', 'tokens-layout',
  'applications', 'usage',
];

const HAS_GSAP = () => typeof window.gsap !== 'undefined';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================================
   Routing — each section is its own view, switched on the hash.
=================================================================== */
function animateView(view) {
  if (!HAS_GSAP() || REDUCED) return;
  const blocks = view.querySelectorAll('.doc-block');
  gsap.killTweensOf([view, ...blocks]);
  gsap.fromTo(view, { opacity: 0, y: 6 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' });
  if (blocks.length && blocks.length <= 12) {
    gsap.fromTo(blocks, { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out',
        delay: 0.04, clearProps: 'all' });
  }
}

function showView(slug) {
  ROUTES.forEach((r) => {
    const v = document.getElementById('view-' + r);
    if (v) v.hidden = (r !== slug);
  });
  document.querySelectorAll('[data-route]').forEach((a) => {
    a.classList.toggle('is-active', a.dataset.route === slug);
  });
  revealActiveSection(slug);
  buildToc(slug);
  window.scrollTo(0, 0);
  const view = document.getElementById('view-' + slug);
  if (view) animateView(view);
  if (slug === 'typography') {
    const on = document.querySelector('.seg-btn.is-on');
    applyDevice(on ? on.dataset.device : 'desktop');
  }
  if (slug === 'motion') safe(initEaseDemos, 'initEaseDemos');
}

function currentRoute() {
  const raw = location.hash.replace(/^#/, '');
  return ROUTES.includes(raw) ? raw : 'overview';
}

function initRouter() {
  window.addEventListener('hashchange', () => showView(currentRoute()));
  showView(currentRoute());
}

/* ===================================================================
   Sidebar accordion — collapsible groups, remembered across visits.
=================================================================== */
const NAV_STORE = 'ct-ds-collapsed';

function readCollapsed() {
  try { return new Set(JSON.parse(localStorage.getItem(NAV_STORE) || '[]')); }
  catch (e) { return new Set(); }
}

function writeCollapsed(set) {
  try { localStorage.setItem(NAV_STORE, JSON.stringify([...set])); } catch (e) { /* ignore */ }
}

function setSection(sec, open, animate) {
  const items = sec.querySelector('.nav-items');
  const btn = sec.querySelector('.nav-group');
  if (!items || !btn) return;
  btn.setAttribute('aria-expanded', String(open));
  sec.classList.toggle('is-collapsed', !open);

  if (!animate || !HAS_GSAP() || REDUCED) {
    items.style.height = open ? 'auto' : '0px';
    items.style.overflow = open ? '' : 'hidden';
    return;
  }
  gsap.killTweensOf(items);
  if (open) {
    items.style.overflow = 'hidden';
    items.style.height = 'auto';
    const target = items.offsetHeight;
    gsap.fromTo(items, { height: 0 }, {
      height: target, duration: 0.3, ease: 'power2.out',
      onComplete: () => { items.style.height = 'auto'; items.style.overflow = ''; },
    });
  } else {
    items.style.overflow = 'hidden';
    gsap.to(items, { height: 0, duration: 0.26, ease: 'power2.inOut' });
  }
}

function initNavAccordion() {
  const collapsed = readCollapsed();
  document.querySelectorAll('.nav-sec').forEach((sec) => {
    const id = sec.querySelector('.nav-items').id;
    setSection(sec, !collapsed.has(id), false);
    sec.querySelector('.nav-group').addEventListener('click', () => {
      const open = sec.classList.contains('is-collapsed');
      setSection(sec, open, true);
      const store = readCollapsed();
      open ? store.delete(id) : store.add(id);
      writeCollapsed(store);
    });
  });
}

/* Make sure the group owning the active route is open. */
function revealActiveSection(slug) {
  document.querySelectorAll('.nav-sec').forEach((sec) => {
    const routes = (sec.dataset.routes || '').split(/\s+/);
    if (routes.includes(slug) && sec.classList.contains('is-collapsed')) {
      setSection(sec, true, true);
      const store = readCollapsed();
      store.delete(sec.querySelector('.nav-items').id);
      writeCollapsed(store);
    }
  });
}

/* ===================================================================
   "On this page" — position-based so the last section still activates
   when the page bottoms out (an IntersectionObserver band never gets
   there, which is why Overlay used to stay unhighlighted).
=================================================================== */
let tocBlocks = [];
let tocLinks = [];
let tocQueued = false;

function updateTocActive() {
  if (!tocBlocks.length) return;
  const doc = document.documentElement;
  const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 4;
  let idx = 0;
  if (atBottom) {
    idx = tocBlocks.length - 1;
  } else {
    const line = window.scrollY + 140;
    tocBlocks.forEach((b, i) => {
      if (b.getBoundingClientRect().top + window.scrollY <= line) idx = i;
    });
  }
  tocLinks.forEach((l, n) => l.classList.toggle('is-current', n === idx));
}

function queueTocUpdate() {
  if (tocQueued) return;
  tocQueued = true;
  requestAnimationFrame(() => { tocQueued = false; updateTocActive(); });
}

function buildToc(slug) {
  const toc = document.getElementById('toc');
  const list = document.getElementById('tocLinks');
  const view = document.getElementById('view-' + slug);
  if (!toc || !list || !view) return;

  list.innerHTML = '';
  tocBlocks = Array.from(view.querySelectorAll('.doc-block[id]'))
    .filter((b) => b.querySelector('h2'));

  // A single-heading page doesn't need a table of contents.
  if (tocBlocks.length < 2) { toc.hidden = true; tocLinks = []; return; }
  toc.hidden = false;

  tocBlocks.forEach((b) => {
    const a = document.createElement('a');
    a.href = '#' + b.id;
    a.textContent = b.querySelector('h2').textContent;
    a.addEventListener('click', (e) => {
      e.preventDefault();               // the hash drives view routing
      b.scrollIntoView({ block: 'start' });
    });
    list.appendChild(a);
  });
  tocLinks = Array.from(list.children);
  updateTocActive();
}

function initToc() {
  window.addEventListener('scroll', queueTocUpdate, { passive: true });
  window.addEventListener('resize', queueTocUpdate);
}

/* ===================================================================
   Sidebar filter — narrows the nav, hides sections that empty out, and
   force-opens any section holding a match.
=================================================================== */
function initNavSearch() {
  const input = document.getElementById('navSearch');
  const nav = document.getElementById('sidebarNav');
  const empty = document.getElementById('navEmpty');
  if (!input || !nav) return;

  /* Extra terms per route so a search matches what a page is about, not only
     its label. "colour", "font", "contrast", "ramp", "merch" all used to miss. */
  const ALIAS = {
    overview: 'home start index',
    'brand-overview': 'purpose mission vision promise positioning audience values personality attributes tone voice',
    logo: 'wordmark isotype mark lockup clearspace favicon merch',
    color: 'colour palette ramp hex contrast swatch pairing',
    typography: 'type font families inter tight google sans scale heading paragraph label',
    spacing: 'space gap padding margin rhythm 4px',
    layout: 'grid columns gutter margin breakpoint responsive',
    shadows: 'shadow blur elevation depth backdrop effect',
    motion: 'animation easing duration transition curve',
    accessibility: 'a11y contrast wcag focus alt text ratio',
    components: 'button badge breadcrumb field alert card input',
    icons: 'iconography symbol glyph stroke pictogram',
    illustrations: 'illustration isometric drawing style',
    pattern: 'patterns dots grid background texture',
    tokens: 'token variables css scss json export',
    'tokens-primitives': 'primitive ramp raw palette hex',
    'tokens-semantics': 'semantic alias role surface content border',
    'tokens-typography': 'type token font size weight line height',
    'tokens-spacing': 'space token scale',
    'tokens-border': 'border radius corner stroke width',
    'tokens-layout': 'layout token container breakpoint',
    applications: 'deck social sales merch merchandise print web output collateral',
    usage: 'prototype website live rebrand',
  };
  const ALIAS_SOON = {
    'photography': 'photo image imagery treatment crop grade',
    'expression': 'expressions art direction range look feel composition mood',
  };

  /* The label without any status pill, plus its aliases. */
  function haystack(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.wip, .soon').forEach((n) => n.remove());
    const label = clone.textContent.trim().toLowerCase();
    const route = el.dataset.route;
    const extra = route ? ALIAS[route] : ALIAS_SOON[label];
    return label + ' ' + (extra || '');
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;

    nav.querySelectorAll('.nav-sec').forEach((sec) => {
      let visible = 0;
      /* both real links and the non-interactive Upcoming entries */
      sec.querySelectorAll('a, .nav-soon').forEach((el) => {
        const hit = !q || haystack(el).includes(q);
        el.hidden = !hit;
        if (hit) visible++;
      });
      sec.hidden = visible === 0;
      shown += visible;
      if (q && visible) setSection(sec, true, false);
    });

    if (!q) {                             // restore remembered state
      const collapsed = readCollapsed();
      nav.querySelectorAll('.nav-sec').forEach((sec) => {
        setSection(sec, !collapsed.has(sec.querySelector('.nav-items').id), false);
      });
    }
    if (empty) empty.hidden = shown !== 0;
  });
}

/* ===================================================================
   Icon filter
=================================================================== */
function initIconSearch() {
  const input = document.getElementById('iconSearch');
  const grid = document.getElementById('iconGrid');
  const empty = document.getElementById('iconEmpty');
  if (!input || !grid) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    grid.querySelectorAll('.icon-tile').forEach((t) => {
      const hit = !q || (t.dataset.name || '').includes(q);
      t.hidden = !hit;
      if (hit) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  });
}

/* ===================================================================
   Mobile drawer
=================================================================== */
function initNavToggle() {
  const btn = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    sidebar.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }));
}

/* ===================================================================
   Copy + download. Token data is inlined on window.TOKEN_JSON because
   fetch()/XHR are blocked for file:// origins — so we build the file
   client-side and hand the browser a Blob, which also stops Chrome
   from just rendering the JSON in a new tab.
=================================================================== */
function flashToast(text) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add('is-up');
  clearTimeout(flashToast._t);
  flashToast._t = setTimeout(() => el.classList.remove('is-up'), 1500);
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand && document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(ta);
  return ok ? Promise.resolve() : Promise.reject(new Error('copy unsupported'));
}

function copyText(text) {
  // The async clipboard API rejects when the document isn't focused, so always
  // fall through to the legacy path rather than reporting failure.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
  }
  return legacyCopy(text);
}

function initTokenCopy() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-copy]');
    if (!el) return;
    const value = el.dataset.copy;
    copyText(value)
      .then(() => flashToast(`Copied ${value}`))
      .catch(() => flashToast(`Copy failed: ${value}`));
  });
}

function initTokenDownload() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-download]');
    if (!el) return;
    const cat = el.dataset.download;
    const data = window.TOKEN_JSON && window.TOKEN_JSON[cat];
    if (!data) return;                       // fall back to the plain href
    e.preventDefault();
    const name = el.dataset.filename || `${cat}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)],
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashToast(`Downloaded ${name}`);
  });
}

/* ===================================================================
   Applications lightbox. window.GALLERIES is declared in index.html.
=================================================================== */
let currentGallery = null;
let currentIndex = 0;
let lastFocused = null;

function renderSlide() {
  const imgs = window.GALLERIES && window.GALLERIES[currentGallery];
  if (!imgs || !imgs.length) return;
  const img = document.getElementById('lightboxImg');
  img.src = imgs[currentIndex];
  document.getElementById('lightboxCounter').textContent =
    `${currentIndex + 1} / ${imgs.length}`;
  if (HAS_GSAP() && !REDUCED) {
    gsap.fromTo(img, { opacity: 0.4 }, { opacity: 1, duration: 0.22, ease: 'power1.out' });
  }
}

function openGallery(name) {
  if (!window.GALLERIES || !window.GALLERIES[name]) return;
  currentGallery = name;
  currentIndex = 0;
  lastFocused = document.activeElement;
  renderSlide();
  const lb = document.getElementById('lightbox');
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('lightboxClose').focus();
  if (HAS_GSAP() && !REDUCED) {
    gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
    gsap.fromTo('.lightbox-frame', { scale: 0.97 },
      { scale: 1, duration: 0.28, ease: 'power2.out', clearProps: 'transform' });
  }
}

function closeGallery() {
  const lb = document.getElementById('lightbox');
  const finish = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lb.style.opacity = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };
  if (HAS_GSAP() && !REDUCED) {
    gsap.to(lb, { opacity: 0, duration: 0.16, ease: 'power1.in', onComplete: finish });
  } else {
    finish();
  }
}

function step(delta) {
  const imgs = window.GALLERIES && window.GALLERIES[currentGallery];
  if (!imgs) return;
  currentIndex = (currentIndex + delta + imgs.length) % imgs.length;
  renderSlide();
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.getElementById('lightboxClose').addEventListener('click', closeGallery);
  document.getElementById('lightboxPrev').addEventListener('click', () => step(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeGallery(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}


/* ===================================================================
   Typography viewport tabs — Heading is the only group with separate
   desktop/mobile sizes, so only its rows carry data-device.
=================================================================== */
function applyDevice(device) {
  document.querySelectorAll('.type-row[data-device]').forEach((r) => {
    r.hidden = r.dataset.device !== device;
  });
  document.querySelectorAll('.seg-btn').forEach((b) => {
    const on = b.dataset.device === device;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-selected', String(on));
  });
}

function initTypeTabs() {
  const btns = document.querySelectorAll('.seg-btn');
  if (!btns.length) return;
  applyDevice('desktop');
  btns.forEach((b) => b.addEventListener('click', () => applyDevice(b.dataset.device)));
}

/* ===================================================================
   Icon download — SVG sources are inlined on window.ICON_SVG because
   fetch() is blocked for file:// origins.
=================================================================== */
function initIconDownload() {
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-icon]');
    if (!tile) return;
    const file = tile.dataset.icon;
    const src = window.ICON_SVG && window.ICON_SVG[file];
    if (!src) return;
    const blob = new Blob([src], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashToast(`Downloaded ${file}`);
  });
}

/* ===================================================================
   Custom cursor — a single indigo dot. Over a compact interactive target
   it magnetically snaps to that element and expands into a soft indigo
   wash, so the cursor doubles as the hover affordance. Skipped on touch
   and under prefers-reduced-motion.
=================================================================== */
const MAGNET = [
  '.icon-tile', '.shade', 'button.swatch-block', '.seg-btn', '.sidebar-nav a',
  '.nav-group', '.btn', '.topic-card', '.toc a', '.app-card', '.logo-dl',
  '.tok-chip', '.combo', '.ramp-chip',
].join(',');
const SOFT = 'a,button,[data-copy],[data-icon],summary,[role="tab"]';
const MAGNET_MAX = 340;   // don't swallow wide rows

function initCursor() {
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine || REDUCED || !HAS_GSAP()) return;

  const cur = document.createElement('div');
  cur.className = 'cur';
  document.body.appendChild(cur);
  document.documentElement.classList.add('has-cursor');

  const xTo = gsap.quickTo(cur, 'x', { duration: 0.12, ease: 'power3.out' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.12, ease: 'power3.out' });

  let ready = false;
  let snapped = null;          // element currently snapped to

  const setSize = (w, h, r) => gsap.to(cur, {
    width: w, height: h, margin: `${-h / 2}px 0 0 ${-w / 2}px`,
    borderRadius: r, duration: 0.3, ease: 'power3.out',
  });

  const rest = () => {
    snapped = null;
    cur.classList.remove('is-snap');
    setSize(11, 11, '50%');
  };

  const snapTo = (el) => {
    const r = el.getBoundingClientRect();
    snapped = el;
    cur.classList.add('is-snap');
    const radius = getComputedStyle(el).borderRadius;
    setSize(r.width + 10, r.height + 10, radius === '0px' ? '10px' : radius);
    xTo(r.left + r.width / 2);
    yTo(r.top + r.height / 2);
  };

  window.addEventListener('mousemove', (e) => {
    if (!ready) {
      ready = true;
      gsap.set(cur, { x: e.clientX, y: e.clientY });
      cur.classList.add('is-ready');
    }
    if (snapped) return;       // stay parked on the target
    xTo(e.clientX);
    yTo(e.clientY);
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    const text = t.closest('input,textarea,[contenteditable]');
    cur.classList.toggle('is-text', !!text);
    if (text) { rest(); return; }

    const mag = t.closest(MAGNET);
    if (mag) {
      const r = mag.getBoundingClientRect();
      if (r.width <= MAGNET_MAX && r.height <= MAGNET_MAX) { snapTo(mag); return; }
    }
    if (snapped && !snapped.contains(t)) rest();
    if (!snapped) {
      const soft = t.closest(SOFT);
      setSize(soft ? 22 : 11, soft ? 22 : 11, '50%');
    }
  });

  // leaving a snapped target, or the page scrolling under it, releases the snap
  document.addEventListener('mouseout', (e) => {
    if (snapped && !e.relatedTarget) rest();
    else if (snapped && e.relatedTarget && !snapped.contains(e.relatedTarget)) rest();
  });
  window.addEventListener('scroll', () => { if (snapped) rest(); }, { passive: true });
  window.addEventListener('mousedown', () => gsap.to(cur, { scale: 0.85, duration: 0.12 }));
  window.addEventListener('mouseup', () => gsap.to(cur, { scale: 1, duration: 0.18 }));
  document.addEventListener('mouseleave', () => { cur.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cur.style.opacity = ''; });
}

/* ===================================================================
   Logo download — sources inlined on window.LOGO_SVG (file:// again).
=================================================================== */
function initLogoDownload() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-logo]');
    if (!btn) return;
    const file = btn.dataset.logo;
    const src = window.LOGO_SVG && window.LOGO_SVG[file];
    if (!src) return;
    const blob = new Blob([src], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashToast(`Downloaded ${file}`);
  });
}

/* ===================================================================
   Easing demos (Motion page). Each card's curve IS the easing graph:
   the violet dot walks it with x driven by LINEAR time, so its height
   at any moment is the eased progress. The navy runner underneath
   travels with that same GSAP ease, so you see the mapping and feel
   the result side by side. Core GSAP only — MotionPathPlugin isn't in
   this build, so points come off the path with getPointAtLength and a
   short binary search on x.
=================================================================== */
function initEaseDemos() {
  if (REDUCED || !HAS_GSAP()) return;
  const cards = document.querySelectorAll('.ease-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const path = card.querySelector('.ease-path');
    const dot = card.querySelector('.ease-dot');
    const runner = card.querySelector('.ease-runner');
    const name = card.querySelector('.ease-name');
    if (!path || !dot || !runner || !name) return;
    if (card.dataset.easeReady) return;          // build once, on first view
    card.dataset.easeReady = '1';

    const ease = name.textContent.trim();          // e.g. "power2.out"
    const len = path.getTotalLength();
    const X0 = 4, X1 = 96;                          // track start/end in viewBox units

    // y on the curve for a given x — the curves are monotonic in x
    function pointAtX(x) {
      let lo = 0, hi = len;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid;
      }
      return path.getPointAtLength((lo + hi) / 2);
    }

    path.style.strokeDasharray = len;
    const state = { t: 0 };

    function render() {
      const t = state.t;
      const p = pointAtX(X0 + (X1 - X0) * t);       // x is linear time
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      path.style.strokeDashoffset = len * (1 - t);  // curve draws in behind it
    }
    render();

    gsap.timeline({ repeat: -1, repeatDelay: 0.9 })
      .fromTo(state, { t: 0 }, { t: 1, duration: 1.5, ease: 'none', onUpdate: render }, 0)
      .fromTo(runner, { attr: { cx: X0 } },
        { attr: { cx: X1 }, duration: 1.5, ease: ease }, 0);
  });
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
  safe(initNavAccordion, 'initNavAccordion');
  safe(initToc, 'initToc');
  safe(initRouter, 'initRouter');
  safe(initNavSearch, 'initNavSearch');
  safe(initIconSearch, 'initIconSearch');
  safe(initNavToggle, 'initNavToggle');
  safe(initLightbox, 'initLightbox');
  safe(initTokenCopy, 'initTokenCopy');
  safe(initTokenDownload, 'initTokenDownload');
  safe(initTypeTabs, 'initTypeTabs');
  safe(initIconDownload, 'initIconDownload');
  safe(initCursor, 'initCursor');
  safe(initLogoDownload, 'initLogoDownload');
});

/* Headings desktop/mobile tabs */
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.type-tab');
  if (!tab) return;
  const tabs = tab.parentElement.querySelectorAll('.type-tab');
  tabs.forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
  const section = tab.closest('.doc-block');
  section.querySelectorAll('.type-tabpane').forEach(p => { p.hidden = p.id !== tab.dataset.tab; });
});

/* Layout grid lines toggle */
document.addEventListener('click', (e) => {
  const t = e.target.closest('.lg-toggle');
  if (!t) return;
  const sec = t.closest('#grid-breakpoints');
  const on = sec.classList.toggle('grids-on');
  t.setAttribute('aria-pressed', on ? 'true' : 'false');
  t.classList.toggle('is-active', on);
});
