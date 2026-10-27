// Cleartax Font Swap (Inter Tight / Google Sans variant) — run this from
// Figma's desktop app (Plugins > Development) with the target file open.
// Swaps placeholder Poppins/Space Grotesk (heading) and Inter (body) text —
// used as stand-ins because the real fonts aren't loadable through the
// remote use_figma MCP session — to Inter Tight (heading) and Google Sans
// (body), which ARE loadable here because this plugin runs in your local
// Figma desktop session where the fonts are installed and synced.
//
// See ../nohemi-gilroy/code.js and ../pp-neue-montreal/code.js for the
// other target-font mappings — this file is the Inter Tight/Google Sans
// version, kept as a separate variant in case an asset needs to swap onto
// those fonts instead.

function norm(s) {
  return s.toLowerCase().replace(/[\s-]/g, '');
}

// Placeholder (family, style) -> target (family, weightKeyword)
const MAPPING = [
  [['Poppins', 'Bold'], ['Inter Tight', 'Bold']],
  [['Poppins', 'SemiBold'], ['Inter Tight', 'SemiBold']],
  [['Poppins', 'Medium'], ['Inter Tight', 'Medium']],
  [['Poppins', 'Regular'], ['Inter Tight', 'Regular']],
  [['Poppins', 'ExtraBold'], ['Inter Tight', 'ExtraBold']],
  [['Space Grotesk', 'Bold'], ['Inter Tight', 'Bold']],
  [['Space Grotesk', 'Medium'], ['Inter Tight', 'Medium']],
  [['Space Grotesk', 'Regular'], ['Inter Tight', 'Regular']],
  [['Space Grotesk', 'Light'], ['Inter Tight', 'Light']],
  [['Inter', 'Regular'], ['Google Sans', 'Regular']],
  [['Inter', 'Medium'], ['Google Sans', 'Medium']],
  [['Inter', 'Semi Bold'], ['Google Sans', 'SemiBold']],
  [['Inter', 'Bold'], ['Google Sans', 'Bold']],
  [['Inter', 'Extra Bold'], ['Google Sans', 'ExtraBold']],
  [['Inter', 'Medium Italic'], ['Google Sans', 'Medium Italic']],
];

function findMapping(family, style) {
  return MAPPING.find(([[f, s]]) => f === family && norm(s) === norm(style));
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
