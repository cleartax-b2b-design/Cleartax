// Cleartax Font Swap (Nohemi / Gilroy variant) — run this from Figma's desktop
// app (Plugins > Development) with the target file open. Swaps placeholder
// Poppins/Space Grotesk (heading) and Inter (body) text — used as stand-ins
// because the real fonts aren't loadable through the remote use_figma MCP
// session — back to the real Nohemi (heading) and Gilroy (body) fonts, which
// ARE loadable here because this plugin runs in your local Figma desktop
// session where the fonts are installed and synced.
//
// See code.js next to this file for the current PP Neue Montreal Variable
// target — this file is the earlier Nohemi/Gilroy mapping, kept as a separate
// version in case an asset still needs to swap onto those fonts instead.

// Nohemi's non-Regular/Bold weight files each use their own legacy family name
// (e.g. "Nohemi SemBd") instead of family="Nohemi" + style="SemiBold" — this
// map is exact, taken directly from each file's name table.
const NOHEMI_LEGACY_FAMILY = {
  Thin: 'Nohemi Thin',
  ExtraLight: 'Nohemi ExtLt',
  Light: 'Nohemi Light',
  Regular: 'Nohemi',
  Medium: 'Nohemi Med',
  SemiBold: 'Nohemi SemBd',
  Bold: 'Nohemi',
  ExtraBold: 'Nohemi ExtBd',
  Black: 'Nohemi Black',
};
const NOHEMI_LEGACY_STYLE = {
  Thin: 'Regular', ExtraLight: 'Regular', Light: 'Regular', Regular: 'Regular',
  Medium: 'Regular', SemiBold: 'Regular', Bold: 'Bold', ExtraBold: 'Regular', Black: 'Regular',
};

function norm(s) {
  return s.toLowerCase().replace(/[\s-]/g, '');
}

// Placeholder (family, style) -> target (family, weightKeyword)
const MAPPING = [
  [['Poppins', 'Bold'], ['Nohemi', 'Bold']],
  [['Poppins', 'SemiBold'], ['Nohemi', 'SemiBold']],
  [['Poppins', 'Medium'], ['Nohemi', 'Medium']],
  [['Poppins', 'Regular'], ['Nohemi', 'Regular']],
  [['Poppins', 'ExtraBold'], ['Nohemi', 'ExtraBold']],
  [['Space Grotesk', 'Bold'], ['Nohemi', 'Bold']],
  [['Space Grotesk', 'Medium'], ['Nohemi', 'Medium']],
  [['Space Grotesk', 'Regular'], ['Nohemi', 'Regular']],
  [['Space Grotesk', 'Light'], ['Nohemi', 'Light']],
  [['Inter', 'Regular'], ['Gilroy', 'Regular']],
  [['Inter', 'Medium'], ['Gilroy', 'Medium']],
  [['Inter', 'Semi Bold'], ['Gilroy', 'SemiBold']],
  [['Inter', 'Bold'], ['Gilroy', 'Bold']],
  [['Inter', 'Extra Bold'], ['Gilroy', 'ExtraBold']],
  [['Inter', 'Medium Italic'], ['Gilroy', 'Medium Italic']],
];

function findMapping(family, style) {
  return MAPPING.find(([[f, s]]) => f === family && norm(s) === norm(style));
}

function findRealFont(fonts, targetFamily, weightKeyword) {
  if (targetFamily === 'Nohemi') {
    const fam = NOHEMI_LEGACY_FAMILY[weightKeyword];
    const style = NOHEMI_LEGACY_STYLE[weightKeyword];
    if (fam) {
      const hit = fonts.find(f => f.fontName.family === fam && f.fontName.style === style);
      if (hit) return hit.fontName;
    }
  }
  // Generic path (covers Gilroy, and Nohemi as a fallback if the map above misses)
  const want = norm(weightKeyword);
  const exact = fonts.find(f => norm(f.fontName.family) === norm(targetFamily) && norm(f.fontName.style) === want);
  if (exact) return exact.fontName;
  // Loose fallback: family starts with target and style fuzzy-contains the weight
  const loose = fonts.find(f => norm(f.fontName.family).startsWith(norm(targetFamily)) && norm(f.fontName.style).includes(want));
  if (loose) return loose.fontName;
  return null;
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

  for (const page of figma.root.children) {
    await figma.setCurrentPageAsync(page);
    const textNodes = page.findAllWithCriteria({ types: ['TEXT'] });
    for (const node of textNodes) {
      let segments;
      try {
        segments = node.getStyledTextSegments(['fontName']);
      } catch (e) {
        continue;
      }
      for (const seg of segments) {
        const cur = seg.fontName;
        const mapping = findMapping(cur.family, cur.style);
        if (!mapping) { skipped++; continue; }
        const [, [targetFamily, weightKeyword]] = mapping;
        const targetFont = findRealFont(fonts, targetFamily, weightKeyword);
        if (!targetFont) {
          missing.add(targetFamily + ' ' + weightKeyword);
          skipped++;
          continue;
        }
        await ensureLoaded(cur);
        await ensureLoaded(targetFont);
        node.setRangeFontName(seg.start, seg.end, targetFont);
        changed++;
      }
    }
  }

  const parts = [`Font swap done: ${changed} text ranges updated`];
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
