Changelog — branch v4-test
(branched from main @ 2c8bd2f "Update .DS_Store")

V1 — 2026-07-13
- Expanded Design system/Background: new Dark/Light gradient sets (01-20) and Stars space-photo backgrounds (1-10)
- Added cover-mockup exploration sets (Dark Gradient, Gradient 15, New Gradients, Stars) for asset cover design tests
- Added UI gradient swatches (Ice Blue, Lavender, Pale Peach, Soft Mint)
- Added ClearTax Global "Beyond e-Invoicing" 3-slide summary PDF + working HTML build

V2 — 2026-07-13
- Built the Landmark Group ZATCA Phase 2 case study: PDF, editable SVG, and PDF-slide exports, with a Python build pipeline (build.py, components.py, fontembed.py, wrap.py)
- Added an anonymised version of the case study ("Leading Saudi Retail Group")
- Added the figma-font-swap-plugin (code.js/manifest.json) and check-figma-setup.sh script
- Started tracking QA screenshots under Asset/Bug

V2-P — 2026-07-15
- Built the UAE e-invoicing ad set: 3 static ads plus "mandate" variants across multiple aspect ratios (SVG+PNG)
- Added the website-skill (SKILL.md + screenshot.py) for building Cleartax websites
- Added ClearTax Security & Trust Kit, Philippines E-Invoicing Readiness Playbook, SmartFile test deck, and automation-tools deck content
- Added figma-setup-hook-gate.sh

V3 — 2026-07-24
- Built out Website output folders 7, 9, 10, 11, 12 (full HTML/CSS/JS builds with Gilroy/Nohemi fonts and a three.js hero)
- Added a 50-file SVG pattern library under Design system/Background/Pattern
- Added the Typography Style Guide PDF
- Added Automation Tools for ClearTax visual-edition decks and the Spain E-Invoicing Flow deck (SVG/PPTX)
- Added .gitattributes for LF normalization (caused a whitespace-only line-ending diff across most tracked files, no content changes)

2026-07-26 — Added Inter Medium Italic → Gilroy Medium Italic mapping to the figma-font-swap-plugin

V3.1 — 2026-07-26
- Housekeeping only (.DS_Store refresh), no content changes

V3.2 — 2026-07-27
- Added content docs: ViDA EU CFO Playbook, Data Lake, France switchers & delivery (English + French)
- Added an anonymised TOUCH 'n Go case study

V4 — 2026-07-28
- Renamed the branch changelog file: Active-v3.txt → Active-v4-test.txt
- Added PP Neue Montreal Variable fonts under Design system/Fonts/Neue Montreal
- Superseded the old Nohemi-Gilroy Typography Style Guide PDF with a new one (old copy kept, suffixed "superseded 2026-07-28")
- Repointed the figma-font-swap-plugin at the PP Neue Montreal Variable fonts

Pending (uncommitted on this branch)
- Reorganizing Design system/Fonts: consolidating the PP Neue Montreal fonts and Typography Style Guide into a single Design system/Fonts/Typography/ folder
- Modified Design system/Logo/Logo-dark.svg
- New utm-link-helper skill for attaching UTM-tagged tracking links to PDF CTA buttons
- New content: EU Vida.pdf, Zomato Case Study (anonymised + non-anonymised), vendor discovery.pdf, "Global e-invoicing - 4 assets down edits.md"
- New output folders: Asset/Output/EU Vida/, Asset/Output/vendor discovery/
- New Design system/Bugs/ and Design system/Icons/ folders
- Rebrand.pdf and Cleartax Design System.html — built a full interactive design-system website from Rebrand.pdf and the Typography Style Guide (midnight blue/lime/indigo palette):
  - Restructured from one long scrolling page into a true multi-page site: persistent sticky nav, a cover "hub" page linking to each section, and GSAP-powered crossfade transitions between pages (with a setTimeout-driven fallback so the page swap never depends on the animation callback firing)
  - Real Cleartax logo (Logo.svg / Logo-dark.svg) in the nav and cover, replacing the typed "cleartax" wordmark; added a dedicated Logo page (light-card/dark-card pair) with a download button
  - Typography page embeds the complete Display/Heading/Paragraph/Label size ramp matching Typography Style Guide.pdf exactly, plus a download button bundling both font files and the PDF
  - Iconography page swapped again to the final 66-icon set pulled directly from Design system/Icons/SVG/ (the earlier 74-icon placeholder-derived set now lives in Design system/Icons/SVG - Deprecated/), with a download-all button
  - Applications page: Decks/Social/Assets/Merchandise are clickable cards that open a lightbox slideshow of the real cropped visuals, re-cropped at 2x resolution (440dpi) after the originals looked blurry at lightbox display size, plus a download-all button that zips all four sets into applications/Decks, applications/Social,print and web, applications/Sales asset, applications/Merchandise (reuses the lightbox's already-embedded image data instead of duplicating it, keeping file size flat)
  - Color usage chart redrawn as nested rounded rectangles (was nested circles), matching the reference in Design system/Bugs/, with its 50% box legend adjusted for spacing
  - Downloads use the claude.ai artifact's `window.claude.downloads` capability, falling back to a hand-written ZIP bundler (incl. a UTF-8-filename fix for non-ASCII icon names) when the page is opened standalone
  - Shapes, Components, and Illustration pages are built but currently hidden from nav/routing
  - Published as a Claude artifact and also hosted publicly at https://shaf-cleartax.github.io/cleartax-design-system-website/ (separate `cleartax-design-system-website` GitHub repo, not part of this repo)

V4.1 — 2026-08-04
- Swapped the Iconography icon set again: moved the ~75 tax-deduction-category icons (80D Medical Insurance, Capital Gains, business income, various deductions, etc.) into Design system/Icons/SVG - Deprecated/, replaced with a new 66-icon expense/transaction-category set under Design system/Icons/SVG/
- Split the figma-font-swap-plugin into two selectable variants — pp-neue-montreal/ and nohemi-gilroy/ — each with its own code.js + manifest.json
- Modified Design system/Cleartax Design System.html
- Added new content docs: PIL+PACOIL Case Study, and a Philippines BIR e-invoicing consumer/lifestyle-retail asset
- Added Consumer/Personal Loan.svg
- Added report-skill.md documenting the Figma-native report build workflow
- Added Report reference material: UAE Report.pdf, July 2026 Oman e-Invoicing Survey Report content, Report-typography-system.md, deck reference images, and QA bug screenshots
- Added the "Cleartax 2026 Design System V1.3 (Showcase Deck).pptx" plus supporting Deck bug screenshots

Since V4.1 — 2026-08-05 → 2026-08-14 (current working-directory state)
- Figma design tokens re-exported with a new font system: Primitives.json, Semantics.json and Typography.json under Design system/Variables/ were regenerated on 2026-08-10, and Typography.json now references Google Sans and Inter Tight instead of the Nohemi/Gilroy/PP Neue Montreal families
- Added the matching font files under Design system/Fonts/: Google_Sans/ and Google_Sans_Flex/ and Inter_Tight/ (variable + static cuts), plus an empty "Design Token/" placeholder folder and a 21MB Fonts/Archive.zip bundle
- Note: Cleartax Design System.html (edited 2026-08-07) still renders in PP Neue Montreal — the Google Sans / Inter Tight switch currently exists only in the Figma token export, not in the design-system website
- Added Design system/Favicon/ — four favicon SVG variants plus Favicon.zip
- New content docs under Asset/Content: Adidas Belgium Case Study (Named + Anonymized), Meesho Case Study, Hotelkey Case Study (+ anonymised), "Own Audits with Transactional Intelligence", a combined "France switchers and delivery.md" alongside the existing English/French splits, and "Philippines e-Invoicing — CAS Registered Is Not EIS Ready" (Asset 6)
- Shipped per-channel UTM-tagged PDF variants via the utm-link-helper skill, each set also zipped under Asset/Output/:
  - ClearTax Phillipines-retail asset — 6 versions (Email, LinkedIn Organic Carousel, LinkedIn Paid, Newsletter, Webinar, Website)
  - Vendor Discovery (13 Aug FR) — 5 versions (LinkedIn Paid, Newsletter, Webinar, Social Media, Email)
  - Delivery (13 Aug) — 5 versions (Newsletter, Email, Social Media, Webinar, LinkedIn Paid)
  - CAS — 6 versions (Email, LN Doc Ad, SM Organic, Website, Webinar, Newsletter)
