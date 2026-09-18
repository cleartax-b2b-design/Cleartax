// Cleartax Font Swap — SCOPED variant (Inter Tight / Google Sans)
//
// Identical mapping logic to ../Intertight-googlesans/code.js, with ONE
// difference: it only ever touches the CURRENT SELECTION, never the whole
// file. Run it with your new page frame selected.
//
// WHY THIS EXISTS
// The unscoped version walks every page via figma.root.children. That is
// safe in a single-asset brochure file, but destructive in a large shared
// file. Measured on "Cleartax | Oro" (2026-09-17), an unscoped run would
// have rewritten 88 existing text ranges across 13 pages through the
// heading-demotion rule (Inter Tight Bold -> SemiBold), including:
//
//   Typography (the type specimen itself) ...... 17
//   Website for Development (production refs) .. 17
//   Website Mockup (existing work) ............. 17
//   Iconography / Colors / Logo ................ 22
//   Layout Grids, Shadows, Spacing, A11y ....... 11
//   "In-file components (Do not edit)" .........  2
//
// Use the unscoped version for standalone asset files. Use this one for
// anything that shares a file with work you must not disturb.

function norm(s) {
  return s.toLowerCase().replace(/[\s-]/g, '');
}

// Shared: heading placeholders -> Inter Tight (both schemes)
const COMMON_MAPPING = [
  [['Poppins', 'Bold'], ['Inter Tight', 'Bold']],
  [['Poppins', 'SemiBold'], ['Inter Tight', 'SemiBold']],
  [['Poppins', 'Medium'], ['Inter Tight', 'Medium']],
  [['Poppins', 'Regular'], ['Inter Tight', 'Regular']],
  [['Poppins', 'ExtraBold'], ['Inter Tight', 'ExtraBold']],
  [['Space Grotesk', 'Bold'], ['Inter Tight', 'Bold']],
  [['Space Grotesk', 'Medium'], ['Inter Tight', 'Medium']],
  [['Space Grotesk', 'Regular'], ['Inter Tight', 'Regular']],
  [['Space Grotesk', 'Light'], ['Inter Tight', 'Light']],
];

// LEGACY scheme: Inter was the body placeholder -> Google Sans
const LEGACY_MAPPING = COMMON_MAPPING.concat([
  [['Inter', 'Regular'], ['Google Sans', 'Regular']],
  [['Inter', 'Medium'], ['Google Sans', 'Medium']],
  [['Inter', 'Semi Bold'], ['Google Sans', 'SemiBold']],
  [['Inter', 'Bold'], ['Google Sans', 'Bold']],
  [['Inter', 'Extra Bold'], ['Google Sans', 'ExtraBold']],
  [['Inter', 'Medium Italic'], ['Google Sans', 'Medium Italic']],
]);

// MODERN scheme: Inter was the heading placeholder -> Inter Tight,
// Google Sans Flex was the body placeholder -> Google Sans
const MODERN_MAPPING = COMMON_MAPPING.concat([
  [['Inter', 'Regular'], ['Inter Tight', 'Regular']],
  [['Inter', 'Medium'], ['Inter Tight', 'Medium']],
  [['Inter', 'Semi Bold'], ['Inter Tight', 'SemiBold']],
  [['Inter', 'Bold'], ['Inter Tight', 'Bold']],
  [['Inter', 'Extra Bold'], ['Inter Tight', 'ExtraBold']],
  [['Inter', 'Black'], ['Inter Tight', 'Black']],
  [['Inter', 'Light'], ['Inter Tight', 'Light']],
  [['Inter', 'Italic'], ['Inter Tight', 'Italic']],
  [['Inter', 'Bold Italic'], ['Inter Tight', 'Bold Italic']],
  [['Google Sans Flex', 'Regular'], ['Google Sans', 'Regular']],
  [['Google Sans Flex', 'Medium'], ['Google Sans', 'Medium']],
  [['Google Sans Flex', 'SemiBold'], ['Google Sans', 'SemiBold']],
  [['Google Sans Flex', 'Bold'], ['Google Sans', 'Bold']],
  [['Google Sans Flex', 'ExtraBold'], ['Google Sans', 'ExtraBold']],
  [['Google Sans Flex', 'Light'], ['Google Sans', 'Light']],
  [['Google Sans Flex', 'Black'], ['Google Sans', 'Black']],
  [['Google Sans Flex', 'Italic'], ['Google Sans', 'Italic']],
  [['Google Sans Flex', 'Medium Italic'], ['Google Sans', 'Medium Italic']],
]);

function findMapping(mapping, family, style) {
  return mapping.find(([[f, s]]) => f === family && norm(s) === norm(style));
}

// Heading-weight rule: bold HEADINGS should sit at SemiBold, while short
// value lockups (stat numbers like "€1.2M", "100%", years) stay Bold for
// contrast. A "heading" is any Inter Tight Bold text that reads as a
// sentence: 12+ characters containing lowercase letters. Runs on documents
// that were already swapped to Inter Tight, so re-running this plugin
// demotes heading weights without touching numbers.
function headingWeightTarget(fonts, curFamily, curStyle, nodeText) {
  if (curFamily !== 'Inter Tight') return null;
  if (norm(curStyle) !== 'bold') return null;
  if (nodeText.length < 12 || !/[a-z]/.test(nodeText)) return null;
  return findRealFont(fonts, 'Inter Tight', 'SemiBold');
}

function findRealFont(fonts, targetFamily, weightKeyword) {
  // Generic path: Inter Tight and Google Sans both follow the standard
  // family="X" + style="Weight" naming (no per-weight legacy family names
  // like Nohemi's "Nohemi SemBd" quirk), so an exact match should normally
  // hit first try. The loose fallback below covers cases where a specific
  // weight (e.g. Google Sans SemiBold/ExtraBold) isn't installed locally —
  // Google Sans historically ships a narrower weight range than Inter Tight.
  const want = norm(weightKeyword);
  const exact = fonts.find(f => norm(f.fontName.family) === norm(targetFamily) && norm(f.fontName.style) === want);
  if (exact) return exact.fontName;
  // Loose fallback: family starts with target and style fuzzy-contains the weight
  const loose = fonts.find(f => norm(f.fontName.family).startsWith(norm(targetFamily)) && norm(f.fontName.style).includes(want));
  if (loose) return loose.fontName;
  return null;
}

async function collectTextNodes() {
  // SCOPED: only the current selection, and only text inside it.
  const sel = figma.currentPage.selection;
  if (!sel || sel.length === 0) return null;
  const all = [];
  for (const node of sel) {
    if (node.type === 'TEXT') { all.push(node); continue; }
    if (typeof node.findAllWithCriteria === 'function') {
      all.push(...node.findAllWithCriteria({ types: ['TEXT'] }));
    }
  }
  return all;
}

async function run() {
  const fonts = await figma.listAvailableFontsAsync();
  let changed = 0;
  let skipped = 0;
  const missing = new Set();
  const loadedCache = new Set();

  async function ensureLoaded(fontName) {
    const key = fontName.family + '::' + fontName.style;
    if (loadedCache.has(key)) return;
    await figma.loadFontAsync(fontName);
    loadedCache.add(key);
  }

  // Figma requires EVERY font present anywhere in a text node to be loaded
  // before ANY write to that node (even a single-range setRangeFontName).
  // Load them all; if one can't load (e.g. missing locally), skip the node
  // rather than crash the whole run.
  async function ensureNodeFontsLoaded(node) {
    const segs = node.getStyledTextSegments(['fontName']);
    for (const seg of segs) {
      try {
        await ensureLoaded(seg.fontName);
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  const textNodes = await collectTextNodes();
  if (textNodes === null) {
    figma.notify('Select the frame to swap first — this scoped version never touches the whole file.',
      { error: true, timeout: 8000 });
    figma.closePlugin();
    return;
  }

  // Detect scheme: Google Sans Flex means the MODERN placeholder set. A file
  // that already contains real Google Sans or Inter Tight was ALREADY swapped
  // once — treat that as modern too, so a re-run maps any remaining/new Inter
  // placeholders to Inter Tight instead of (legacy) Google Sans.
  let modern = false;
  const nodeSegments = [];
  for (const node of textNodes) {
    let segments;
    try {
      segments = node.getStyledTextSegments(['fontName']);
    } catch (e) {
      continue;
    }
    nodeSegments.push([node, segments]);
    if (!modern && segments.some(seg =>
      seg.fontName.family === 'Google Sans Flex' ||
      seg.fontName.family === 'Google Sans' ||
      seg.fontName.family === 'Inter Tight'
    )) {
      modern = true;
    }
  }
  const mapping = modern ? MODERN_MAPPING : LEGACY_MAPPING;
  const schemeName = modern
    ? 'modern (Inter→Inter Tight, Google Sans Flex→Google Sans)'
    : 'legacy (Poppins/Space Grotesk→Inter Tight, Inter→Google Sans)';

  let demoted = 0;
  for (const [node, segments] of nodeSegments) {
    for (const seg of segments) {
      const cur = seg.fontName;
      // heading-weight pass: Inter Tight Bold headings -> SemiBold
      const headingFont = headingWeightTarget(fonts, cur.family, cur.style, node.characters);
      if (headingFont) {
        if (!(await ensureNodeFontsLoaded(node))) { skipped++; continue; }
        await ensureLoaded(headingFont);
        node.setRangeFontName(seg.start, seg.end, headingFont);
        demoted++;
        continue;
      }
      const found = findMapping(mapping, cur.family, cur.style);
      if (!found) { skipped++; continue; }
      const [, [targetFamily, weightKeyword]] = found;
      const targetFont = findRealFont(fonts, targetFamily, weightKeyword);
      if (!targetFont) {
        missing.add(targetFamily + ' ' + weightKeyword);
        skipped++;
        continue;
      }
      if (!(await ensureNodeFontsLoaded(node))) { skipped++; continue; }
      await ensureLoaded(targetFont);
      node.setRangeFontName(seg.start, seg.end, targetFont);
      changed++;
    }
  }

  const parts = [`Scoped font swap done (${schemeName}) on ${figma.currentPage.selection.length} selected node(s): ${changed} text ranges updated`];
  if (demoted) parts.push(`${demoted} bold headings -> SemiBold`);
  if (skipped) parts.push(`${skipped} skipped`);
  if (missing.size) parts.push(`missing target fonts: ${[...missing].join(', ')}`);
  const msg = parts.join(' — ');
  console.log(msg);
  figma.notify(msg, { timeout: 8000 });
  figma.closePlugin();
}

run().catch((e) => {
  console.error(e);
  figma.notify('Font swap failed: ' + e.message, { error: true, timeout: 8000 });
  figma.closePlugin();
});
