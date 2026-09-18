// ===========================================================================
// Cleartax Website Font Swap
// Run from Figma desktop (Plugins > Development) with the PAGE FRAME SELECTED.
// ===========================================================================
//
// WHAT THIS IS FOR
// Website mockups built through the remote use_figma MCP session. That session
// only resolves the Google Fonts catalogue, so it cannot load Inter Tight or
// Google Sans. Consequences, all verified:
//
//   * figma.loadFontAsync("Inter Tight" | "Google Sans")  -> fails
//   * node.textStyleId = id  AND  setTextStyleIdAsync(id) -> both fail
//     ("Cannot set style successfully: unloaded font ...")
//   * cloning / instantiating any text-bearing node       -> fails on append
//
// So the MCP build lays the page out with loadable PLACEHOLDER fonts at the
// exact metrics of the intended style, and tags each node with what it should
// become. This plugin runs locally, where the real fonts exist, and finishes
// the job.
//
// ORDER OF WORK
//   A. Bind the real TEXT STYLE to every tagged node   (preferred, exact)
//   B. Font-map any UNTAGGED text as a fallback        (placeholder -> real)
//   C. Swap in the real navbar / footer components
//
// Pass A both sets the font and links the node to the design system, so a
// fully tagged page needs nothing else.
//
// SCOPE — IMPORTANT
// This plugin only ever touches the current selection. It deliberately does
// NOT walk figma.root.children. Website mockups live in "Cleartax | Oro",
// a 20-page shared file; a whole-file sweep there was measured to rewrite 88
// existing text ranges across 13 pages, including the Typography specimen and
// a page named "In-file components (Do not edit)".
//
// RELATED
//   ../../../Asset/Script/figma-font-swap-plugin/  — the ASSET variants
//     (brochures, case studies). Those map fonts only and have no notion of
//     text styles. Use this plugin for websites, those for assets.
// ===========================================================================

const NS = 'cleartax_ws';

const norm = (s) => String(s).toLowerCase().replace(/[\s\-_/]/g, '');

// placeholder family -> real family (weight is carried across unchanged)
const FAMILY_MAP = [
  ['Inter', 'Inter Tight'],
  ['Google Sans Flex', 'Google Sans'],
  // legacy placeholders still found in older website files
  ['Poppins', 'Inter Tight'],
  ['Space Grotesk', 'Inter Tight'],
];

function realFamilyFor(family) {
  const hit = FAMILY_MAP.find(([from]) => norm(from) === norm(family));
  return hit ? hit[1] : null;
}

// "Semi Bold" <-> "SemiBold" etc. differ between families; match loosely.
function resolveFont(available, family, style) {
  const f = norm(family), s = norm(style);
  let hit = available.find((a) => norm(a.fontName.family) === f && norm(a.fontName.style) === s);
  if (hit) return hit.fontName;
  hit = available.find((a) => norm(a.fontName.family) === f && norm(a.fontName.style).indexOf(s) !== -1);
  if (hit) return hit.fontName;
  // last resort: same family, Regular
  hit = available.find((a) => norm(a.fontName.family) === f && norm(a.fontName.style) === 'regular');
  return hit ? hit.fontName : null;
}

async function ensureNodeFontsLoaded(node, loaded) {
  // Figma requires EVERY font already present in a text node to be loaded
  // before ANY write to that node, even a single-range one.
  try {
    for (const seg of node.getStyledTextSegments(['fontName'])) {
      const key = seg.fontName.family + '::' + seg.fontName.style;
      if (!loaded.has(key)) { await figma.loadFontAsync(seg.fontName); loaded.add(key); }
    }
    return true;
  } catch (e) { return false; }
}

function collectTexts(roots) {
  const out = [];
  for (const r of roots) {
    if (r.type === 'TEXT') { out.push(r); continue; }
    if (typeof r.findAllWithCriteria === 'function') {
      out.push(...r.findAllWithCriteria({ types: ['TEXT'] }));
    }
  }
  return out;
}

function findTagged(roots, key, value) {
  let hit = null;
  const walk = (n) => {
    if (hit) return;
    if (n.getSharedPluginData && n.getSharedPluginData(NS, key) === value) { hit = n; return; }
    if (n.children) n.children.forEach(walk);
  };
  roots.forEach(walk);
  return hit;
}

async function findByName(name, types) {
  for (const page of figma.root.children) {
    await page.loadAsync();
    let hit = null;
    const walk = (n, d) => {
      if (hit || d > 4) return;
      if (n.name === name && (!types || types.indexOf(n.type) !== -1)) { hit = n; return; }
      if (n.children) n.children.forEach((c) => walk(c, d + 1));
    };
    page.children.forEach((c) => walk(c, 0));
    if (hit) return hit;
  }
  return null;
}

// Replace a tagged placeholder button with the real Design System component.
// Tags (namespace cleartax_ws):
//   replaceWith    = "button"
//   buttonSet      = component-set key
//   buttonVariant  = "Size=Large, Type=Primary, State=Default, Destructive=No"
//   buttonLabel    = the label text to write into the instance
// Write a label into a freshly created instance. Component TEXT properties are
// preferred over editing the text node, and any "Show Icon" booleans are turned
// off so a text-only badge/button doesn't render stray icons.
function firstTextIn(node) {
  if (node.type === 'TEXT') return node;
  if (!node.children) return null;
  for (const c of node.children) { const t = firstTextIn(c); if (t) return t; }
  return null;
}

async function applyLabel(inst, label) {
  const notes = [];
  let props = null;
  try { props = inst.componentProperties; } catch (e) { props = null; }

  if (props) {
    const update = {};
    for (const [key, def] of Object.entries(props)) {
      if (/^Label#/.test(key) && def.type === 'TEXT' && label) update[key] = label;
      if (/^Show Icon/.test(key) && def.type === 'BOOLEAN') update[key] = false;
    }
    if (Object.keys(update).length) {
      try {
        const t0 = firstTextIn(inst);
        if (t0) for (const seg of t0.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName);
        inst.setProperties(update);
        return notes;
      } catch (e) { notes.push('setProperties: ' + String(e.message || e).slice(0, 50)); }
    }
  }

  if (!label) return notes;
  const t = firstTextIn(inst);
  if (!t) { notes.push('instance had no text node'); return notes; }
  for (const seg of t.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName);
  t.characters = label;
  return notes;
}

// Replace tagged placeholders with the real Design System component.
// kind = "button" | "badge"; tags are <kind>Set / <kind>Variant / <kind>Label.
const SET_NAME = { button: 'Button', badge: 'Badge', accordion: 'Accordion' };

async function swapComponents(roots, kind) {
  const slots = [];
  const walk = (n) => {
    if (n.getSharedPluginData && n.getSharedPluginData(NS, 'replaceWith') === kind) slots.push(n);
    if (n.children) n.children.forEach(walk);
  };
  roots.forEach(walk);
  if (!slots.length) return { swapped: 0, failed: 0, notes: [] };

  async function localSet(name) {
    for (const page of figma.root.children) {
      await page.loadAsync();
      let hit = null;
      const w = (n, d) => {
        if (hit || d > 3) return;
        if (n.type === 'COMPONENT_SET' && n.name === name && n.children.length > 4) { hit = n; return; }
        if (n.children) n.children.forEach((c) => w(c, d + 1));
      };
      page.children.forEach((c) => w(c, 0));
      if (hit) return hit;
    }
    return null;
  }

  let swapped = 0, failed = 0;
  const notes = [];

  for (const slot of slots) {
    const key = slot.getSharedPluginData(NS, kind + 'Set');
    const variant = slot.getSharedPluginData(NS, kind + 'Variant');
    const label = slot.getSharedPluginData(NS, kind + 'Label');
    const tag = label || slot.name;
    let inst = null;

    try {
      // Import per slot — a cached set node can go stale between instantiations.
      let set = null;
      if (key) {
        try { set = await figma.importComponentSetByKeyAsync(key); }
        catch (e) { try { set = await figma.importComponentByKeyAsync(key); } catch (e2) { set = null; } }
      }
      if (!set) set = await localSet(SET_NAME[kind] || 'Button');
      if (!set) { failed++; notes.push(tag + ': no ' + kind + ' component set'); continue; }

      let main = null;
      if (set.type === 'COMPONENT_SET') {
        main = set.children.find((c) => c.name === variant)
            || set.children.find((c) => norm(c.name) === norm(variant))
            || set.defaultVariant
            || set.children[0];
      } else main = set;
      if (!main) { failed++; notes.push(tag + ': variant not found'); continue; }

      inst = main.createInstance();
      const parent = slot.parent;
      const at = parent.children.indexOf(slot);
      parent.insertChild(at < 0 ? parent.children.length : at, inst);

      if (slot.layoutPositioning === 'ABSOLUTE') {
        inst.layoutPositioning = 'ABSOLUTE'; inst.x = slot.x; inst.y = slot.y;
      }

      (await applyLabel(inst, label)).forEach((n) => notes.push(tag + ': ' + n));

      slot.remove();
      inst = null;
      swapped++;
    } catch (e) {
      failed++;
      notes.push(tag + ': ' + String(e.message || e).slice(0, 70));
      if (inst) { try { inst.remove(); } catch (e2) { /* already detached */ } }
    }
  }
  return { swapped, failed, notes };
}

// Smooth the rag on fixed-width body copy: aim for even line lengths by setting
// the box to roughly (natural single-line width / line count).
async function balanceRag(roots) {
  const targets = [];
  const walk = (n) => {
    if (n.type === 'TEXT') {
      const tag = n.getSharedPluginData(NS, 'targetTextStyle');
      const parent = n.parent ? n.parent.name : '';
      if (/^Paragraph\//.test(tag) && n.layoutSizingHorizontal === 'FIXED'
          && /Section head|Text|Container/.test(parent)) targets.push(n);
    }
    if (n.children) n.children.forEach(walk);
  };
  roots.forEach(walk);

  let adjusted = 0;
  for (const n of targets) {
    try {
      const lh = n.lineHeight && n.lineHeight.unit === 'PIXELS' ? n.lineHeight.value : null;
      if (!lh) continue;
      for (const seg of n.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName);

      const startW = Math.round(n.width);
      const lines = Math.round(n.height / lh);
      if (lines < 2) continue;

      n.textAutoResize = 'WIDTH_AND_HEIGHT';
      const natural = n.width;
      n.textAutoResize = 'HEIGHT';

      let target = Math.ceil(natural / lines) + 12;
      n.resize(Math.min(target, startW), n.height);
      let guard = 0;
      while (Math.round(n.height / lh) > lines && guard < 24 && n.width < startW) {
        target += 10; n.resize(Math.min(target, startW), n.height); guard++;
      }
      if (Math.round(n.width) !== startW) adjusted++;
    } catch (e) { /* leave this paragraph as-is */ }
  }
  return adjusted;
}

// Figma marks "Fixed position when scrolling" by counting fixed children from
// the END of the children array (the top of the layer stack). Every reference
// page keeps ".current Navbar" as the LAST child of the page frame with
// numberOfFixedChildren >= 1. Enforce that, since a swap can insert the
// instance wherever the placeholder happened to sit.
function pinNavbarFixed(root) {
  if (!root || !root.children) return null;
  let nav = null;
  const walk = (n) => {
    if (nav) return;
    if (/^\.current Navbar/i.test(n.name)) { nav = n; return; }
    if (n.children) n.children.forEach(walk);
  };
  root.children.forEach(walk);
  if (!nav) return null;

  try {
    // must be a direct child of the page frame, and last in the array
    if (nav.parent !== root || root.children.indexOf(nav) !== root.children.length - 1) {
      root.appendChild(nav);
    }
    nav.layoutPositioning = 'ABSOLUTE';
    nav.x = 80; nav.y = 48;
    try { nav.constraints = { horizontal: 'CENTER', vertical: 'MIN' }; } catch (e) { /* not supported */ }
    if (!root.numberOfFixedChildren || root.numberOfFixedChildren < 1) {
      root.numberOfFixedChildren = 1;
    }
    return 'navbar pinned fixed (last child, ' + root.numberOfFixedChildren + ' fixed)';
  } catch (e) {
    return 'navbar pin failed: ' + String(e.message || e).slice(0, 60);
  }
}

async function run() {
  const sel = figma.currentPage.selection;
  if (!sel || sel.length === 0) {
    figma.notify('Select the page frame first — this plugin never touches the whole file.',
      { error: true, timeout: 8000 });
    figma.closePlugin();
    return;
  }

  const available = await figma.listAvailableFontsAsync();
  const loaded = new Set();
  const parts = [];
  let sizingIssues = 0;

  // sanity: are the real fonts actually here?
  const fams = new Set(available.map((f) => f.fontName.family));
  const missingFams = ['Inter Tight', 'Google Sans'].filter((f) => !fams.has(f));
  if (missingFams.length) {
    figma.notify('Missing font families: ' + missingFams.join(', ') +
      ' — run this from Figma desktop where they are installed.',
      { error: true, timeout: 10000 });
    figma.closePlugin();
    return;
  }

  // ---------- 0. real Button + Badge components (before styling, so
  //             removed placeholders are not styled needlessly) ----------
  for (const kind of ['button', 'badge', 'accordion']) {
    const r = await swapComponents(sel, kind);
    if (r.swapped) parts.push(r.swapped + ' ' + kind + 's replaced');
    if (r.failed) parts.push(r.failed + ' ' + kind + ' swaps failed');
    r.notes.forEach((n) => parts.push(n));
  }

  const texts = collectTexts(sel);

  // ---------- A. bind real text styles to tagged nodes ----------
  const localStyles = await figma.getLocalTextStylesAsync();
  const byExact = new Map(localStyles.map((s) => [s.name, s]));
  const byNorm = new Map(localStyles.map((s) => [norm(s.name), s]));

  let bound = 0, boundFail = 0;
  const missingStyles = new Set();
  const untagged = [];

  for (const n of texts) {
    const want = n.getSharedPluginData(NS, 'targetTextStyle');
    if (!want) { untagged.push(n); continue; }
    const style = byExact.get(want) || byNorm.get(norm(want));
    if (!style) { missingStyles.add(want); boundFail++; continue; }
    try {
      const key = style.fontName.family + '::' + style.fontName.style;
      if (!loaded.has(key)) { await figma.loadFontAsync(style.fontName); loaded.add(key); }
      if (!(await ensureNodeFontsLoaded(n, loaded))) { boundFail++; continue; }
      await n.setTextStyleIdAsync(style.id);
      bound++;
    } catch (e) { boundFail++; }
  }
  if (bound) parts.push(bound + ' text styles bound');
  if (boundFail) parts.push(boundFail + ' style bindings failed');
  if (missingStyles.size) parts.push('styles not in file: ' + [...missingStyles].join(', '));

  // ---------- B. font fallback for untagged text ----------
  let swapped = 0;
  const unmapped = new Set();
  for (const n of untagged) {
    let segs;
    try { segs = n.getStyledTextSegments(['fontName']); } catch (e) { continue; }
    let touched = false;
    for (const seg of segs) {
      const realFam = realFamilyFor(seg.fontName.family);
      if (!realFam) { unmapped.add(seg.fontName.family); continue; }
      const targetFont = resolveFont(available, realFam, seg.fontName.style);
      if (!targetFont) { unmapped.add(realFam + ' ' + seg.fontName.style); continue; }
      if (!(await ensureNodeFontsLoaded(n, loaded))) break;
      const key = targetFont.family + '::' + targetFont.style;
      if (!loaded.has(key)) { await figma.loadFontAsync(targetFont); loaded.add(key); }
      n.setRangeFontName(seg.start, seg.end, targetFont);
      touched = true;
    }
    if (touched) swapped++;
  }
  if (swapped) parts.push(swapped + ' untagged text nodes font-swapped');
  if (unmapped.size) parts.push('no mapping for: ' + [...unmapped].join(', '));

  // ---------- B.5 smooth text rag (after styles, so metrics are final) ----------
  const ragged = await balanceRag(sel);
  if (ragged) parts.push(ragged + ' paragraphs re-ragged');

  // ---------- C. real navbar / footer ----------
  const navSlot = findTagged(sel, 'replaceWith', 'currentNavbar');
  if (navSlot) {
    const src = await findByName('.current Navbar', ['INSTANCE', 'COMPONENT']);
    if (src) {
      const copy = src.type === 'COMPONENT' ? src.createInstance() : src.clone();
      const parent = navSlot.parent;
      parent.insertChild(parent.children.indexOf(navSlot), copy);
      copy.name = '.current Navbar';
      try {
        if (navSlot.layoutPositioning === 'ABSOLUTE') {
          copy.layoutPositioning = 'ABSOLUTE'; copy.x = navSlot.x; copy.y = navSlot.y;
        } else if (parent.layoutMode && parent.layoutMode !== 'NONE') {
          copy.layoutSizingHorizontal = 'FIXED';
          copy.resize(Math.min(1280, parent.width - parent.paddingLeft - parent.paddingRight),
            copy.height);
        }
      } catch (e) { sizingIssues++; /* layout sizing is best-effort */ }
      navSlot.remove();
      parts.push('navbar replaced');
    } else parts.push('navbar source (.current Navbar) not found');
  }

  const footerHost = findTagged(sel, 'appendFooter', 'currentFooter');
  if (footerHost) {
    const already = footerHost.children &&
      footerHost.children.some((c) => c.name === '.current Footer');
    if (already) parts.push('footer already present — skipped');
    else {
      const src = await findByName('.current Footer', ['COMPONENT_SET', 'COMPONENT', 'INSTANCE']);
      if (src) {
        let inst;
        if (src.type === 'COMPONENT_SET') inst = src.defaultVariant.createInstance();
        else if (src.type === 'COMPONENT') inst = src.createInstance();
        else inst = src.clone();
        footerHost.appendChild(inst);
        inst.name = '.current Footer';
        try {
          if (footerHost.layoutMode && footerHost.layoutMode !== 'NONE') {
            inst.layoutSizingHorizontal = 'FILL';
          }
        } catch (e) { sizingIssues++; /* layout sizing is best-effort */ }
        parts.push('footer appended');
      } else parts.push('footer source (.current Footer) not found');
    }
  }

  if (sizingIssues) parts.push(sizingIssues + ' layout-sizing fallbacks');

  // ---------- D. navbar must stay Fixed ----------
  for (const root of sel) {
    if (root.type !== 'FRAME') continue;
    const r = pinNavbarFixed(root);
    if (r) parts.push(r);
  }

  const msg = parts.length
    ? 'Website font swap — ' + parts.join(' · ')
    : 'Website font swap — nothing to do (no tags, no mappable fonts) on ' +
      sel.length + ' selected node(s)';
  console.log(msg);
  figma.notify(msg, { timeout: 10000 });
  figma.closePlugin();
}

run().catch((e) => {
  console.error(e);
  figma.notify('Website font swap failed: ' + e.message, { error: true, timeout: 9000 });
  figma.closePlugin();
});
