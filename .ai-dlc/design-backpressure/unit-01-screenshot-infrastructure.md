---
status: pending
last_updated: ""
depends_on: []
branch: ai-dlc/design-backpressure/01-screenshot-infrastructure
discipline: backend
pass: ""
workflow: ""
ticket: ""
---

# unit-01-screenshot-infrastructure

## Description
Set up Playwright-based screenshot capture infrastructure as a foundation for the visual fidelity backpressure gate. This unit installs Playwright, creates a reusable screenshot capture utility, and establishes the storage conventions that all other units depend on.

## Discipline
backend - This unit will be executed by backend-focused agents.

## Domain Entities
- **Screenshot** — This unit defines the capture mechanism and storage format for screenshots. Establishes the file naming convention (`{breakpoint}-built.png`), directory structure (`.ai-dlc/{intent-slug}/screenshots/{unit-slug}/`), and viewport configurations (mobile 375px, tablet 768px, desktop 1280px).

## Data Sources
- **Dev server** — The capture utility must connect to a running dev server (configurable URL, default `http://localhost:3000`) or open static HTML files directly in Playwright.
- **Unit frontmatter** (filesystem) — Reads `wireframe:` field to locate wireframe HTML files when capturing reference screenshots of wireframes.

## Technical Specification

### 1. Playwright Installation
Add Playwright as a dev dependency to the plugin. Create a minimal Playwright configuration that:
- Installs Chromium only (not Firefox/WebKit — keeps install size small)
- Configures default viewport sizes for the three breakpoints
- Sets screenshot format to PNG

### 2. Screenshot Capture Utility
Create a shell script at `plugin/lib/capture-screenshots.sh` that:
- Accepts arguments: `--url <base-url>` (default: `http://localhost:3000`), `--routes <comma-separated-paths>` (pages to capture), `--output-dir <path>` (where to save screenshots), `--static <html-file>` (alternative: open a local HTML file instead of a URL)
- For each route, captures screenshots at three breakpoints:
  - `mobile-{route-slug}.png` (375px width)
  - `tablet-{route-slug}.png` (768px width)
  - `desktop-{route-slug}.png` (1280px width)
- Waits for network idle before capturing (handles async-loaded content)
- Returns non-zero exit code if any capture fails
- Outputs captured file paths to stdout for downstream consumption

### 3. Storage Convention
Define the screenshot storage directory structure:
```
.ai-dlc/{intent-slug}/screenshots/{unit-slug}/
  ├── mobile-{route}.png        # Built output at 375px
  ├── tablet-{route}.png        # Built output at 768px
  ├── desktop-{route}.png       # Built output at 1280px
  ├── ref-mobile-{route}.png    # Design reference at 375px (if rendered)
  ├── ref-tablet-{route}.png    # Design reference at 768px (if rendered)
  └── ref-desktop-{route}.png   # Design reference at 1280px (if rendered)
```

### 4. Reference Screenshot Capture
The same utility should be able to capture screenshots of design references:
- For wireframe HTML files: open them directly in Playwright (`--static` mode) and capture at the same breakpoints
- For external design files (images): copy them to the screenshots directory as `ref-{breakpoint}-{route}.png`
- Output reference file paths alongside built output paths

## Success Criteria
- [ ] Playwright is installed as a dev dependency with Chromium browser
- [ ] `plugin/lib/capture-screenshots.sh` exists and captures screenshots at 3 breakpoints (375px, 768px, 1280px)
- [ ] Utility works with both URL mode (`--url`) and static HTML mode (`--static`)
- [ ] Screenshots are saved to the correct directory structure with correct naming convention
- [ ] Utility returns non-zero exit code on capture failure
- [ ] Wireframe HTML files from `.ai-dlc/{intent}/mockups/` can be captured as reference screenshots

## Risks
- **Playwright install size**: Chromium download is ~150MB. Mitigation: install Chromium only, not all browsers. Document the dependency clearly.
- **Headless environment compatibility**: CI/CD or remote environments may not support Playwright. Mitigation: use `--headless` mode (Playwright default), document system requirements.
- **Dev server startup**: Capturing from a dev server requires it to be running. Mitigation: the utility does not manage the dev server — callers are responsible for starting it. Document this requirement.

## Boundaries
This unit does NOT handle:
- Design reference resolution logic (unit-02 owns that)
- AI vision comparison (unit-03 owns that)
- Reviewer hat integration (unit-03 owns that)
- Documentation (unit-04 owns that)

This unit ONLY provides the raw screenshot capture capability and storage conventions.

## Notes
- The website uses Next.js 15 with `output: "export"` — for static export builds, pages can be served with any static server or opened directly
- Playwright's `page.screenshot()` API with `fullPage: true` captures the entire scrollable content
- Consider adding `--wait-for <selector>` option for pages with lazy-loaded content
- The capture script should be idempotent — running it twice with the same args produces the same screenshots
