# Engineering progress

## 2026-10-20 — Asset detail hierarchy polish (identity header + two KPI cards)

- Starting state: `main` at `67ebc7b` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the "asset-detail polish" item from the prior run): the inline asset detail page now has a proper detail-page hierarchy instead of a flat grid. Identity header leads: coin mark, "SAMPLE LISTING · <category>" eyebrow, larger name (24px, tight tracking), symbol + listing tag badge on one subline — then a two-card KPI row (Sample price, Sample market cap) with hero-scale numerals (20px, tabular figures). The redundant Category and Listing stat cards were removed — they duplicated facts already owned by the header, so each fact now has exactly one source of truth. The About section keeps its heading and gains readable typography (1.7 line-height, 62ch measure); the illustrative-data disclaimer is demoted from a loud callout box to a quiet footnote (`detail-fineprint`); the back-link and "Back to catalog" affordances are unchanged.
- Research (mandatory per-component; UI_UX_RESEARCH.md §26–27, fetched directly this run): Uniswap Explore tokens page — identity header (logo+name+symbol) first, KPI metrics second, supporting sections last; badges next to the name, not in stat cards; live chart/volume rows not transferred (would be fabricated data). CoinMarketCap Coin Detail Page patterns — price/key-metrics-first order and the readability treatment of the about section; collapsible FAQ machinery not transferred (single short description doesn't need it); no new interactive controls, so no new keyboard contracts.
- Accessibility: heading focus management unchanged (`tabIndex={-1}` focus on open, Escape closes, focus restored to the trigger); KPI numerals use `font-variant-numeric: tabular-nums`; single centered column collapses to one KPI card column at ≤680px; no-scroll invariants unchanged (`.asset-detail-page` keeps its last-resort `overflow-y: auto`; page is shorter than before, so internal scroll engages even less).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 31/31 passed (16 app — 1 new: detail stats deduped to two KPI cards with header-owned identity — + 6 sort + 4 search + 5 no-scroll invariants).
- `npm run build`: passed (production bundle built to `dist/`).

Files changed: `src/App.tsx` (detail header markup, two-stat `<dl>`, fineprint), `src/styles.css` (single-column centered detail, 24px title, eyebrow, 20px KPI numerals, about line-height/measure, fineprint style; removed dead 900px detail rule and `.asset-detail .notice`), `src/App.test.tsx` (1 new test), `UI_UX_RESEARCH.md` (§26–27), `PROGRESS.md` (this entry).

### Next

- Verify CI on the promoted commit; next UX candidate: Wallet view polish (option-card hierarchy) or Launch intro-column typography review.

### Promotion

- Direct commit to `main` after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.

Implemented in this milestone:

- Replaced the static HTML entry point with a Vite module entry.
- Added React + TypeScript application structure and typed sample asset data.
- Migrated search, category filtering, sorting, asset details, wallet preview, and launch-draft interactions.
- Added modal Escape handling, focus cycling, focus restoration, accessible labels, and reduced-motion/focus styles.
- Added six unit tests covering initial rendering, search, category filtering, launch-draft review, supply limits, and wallet-preview safety messaging.
- Added GitHub Actions CI for type-checking, tests, and production build.

Verification status:

- A local npm install, type-check, test run, and production build were not run in this tool session because a local Node execution environment was unavailable.
- The CI workflow has been added, but its result must be confirmed in the repository Actions tab; it is not reported as passing here.
- No wallet connection, live transaction, token deployment, trading, API, or persistence behavior was enabled.
- No dependency lockfile was generated in this environment; add and commit one after running npm install in a Node-enabled environment.

Next milestones:

1. Confirm CI results and fix any build or test failures.
2. Generate and commit a dependency lockfile after a successful clean install.
3. Add linting and stronger component-level/accessibility tests.
4. Define API/data contracts before connecting any backend or chain indexer.
## 2026-10-18 — Launch supply validation hardening

- Enforced the launch form's documented maximum supply in application logic, not only through HTML input attributes. The form uses `noValidate`, so browser constraints alone were insufficient.
- Added a regression test for supplies above `1,000,000,000,000,000` and verified the error is exposed as an alert.
- The maximum-supply guard and its regression test are included in the React migration branch.

## 2026-10-18 — CI test selector correction

- GitHub Actions run for `7b7978fe78cb2465d490952fd656332bfc3ab6bd`: TypeScript type-check passed; 2 of 6 UI tests failed because launch-draft tests queried a button name that omitted its visible arrow glyph.
- Updated both selectors to match the rendered accessible name, `Create launch draft ↗`.
- Follow-up GitHub Actions run #4 on `bad55b15f0128ab092a5aee53ec14144d51bdae4` passed TypeScript type-checking, all 6 UI tests, and the production build. See [run #4](https://github.com/UsmanXTech/OPENORBIT/actions/runs/39082791815).
- Dependency installation reported 3 audit findings; review package-level details before selecting safe dependency updates.

## 2026-10-18 — CI verification

- Verified by GitHub Actions on Node.js 22: dependency install succeeded, `npm run typecheck` passed, `npm test` passed (6 tests), and `npm run build` passed.
- The passing run validates the React application source and supply-limit regression test. Documentation-only commits made afterward do not change application source; rerun CI on the final main commit after promotion.
- `npm install` reported 3 audit findings. Package-level details remain to be reviewed before making dependency upgrades; no forced or potentially breaking audit fix was applied.
- A dependency lockfile is still missing and remains a follow-up engineering task.


## 2026-10-20 — Premium visual refresh

### Research-first decisions

- Reviewed Uniswap Explore token discovery: https://app.uniswap.org/explore/tokens. Adopted clearer discovery hierarchy and structured information; did not copy branding or imply live market data.
- Reviewed Raydium LaunchLab creation flow: https://raydium.io/launchpad/create/. Kept token preparation separate from browsing and clearly framed it as a local draft.
- Consulted WCAG 2.2 and W3C focus guidance: https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html.
- Added detailed rationale and acceptance criteria to `UI_UX_RESEARCH.md`.

### Implemented directly on main

- Replaced the gradient-heavy prototype styling with a disciplined light workspace, ink-colored type, a single violet accent, refined card/data hierarchy, and a dark hero/creator panel.
- Standardized design tokens, borders, radii, controls, dialog styling, responsive breakpoints, keyboard focus, and reduced-motion behavior.
- Changed the header label to “Preview mode” and replaced invented launch-count/market-cap figures with transparent sample-catalog, filtered-result, draft-only, and network-status information.

### Verification status

- GitHub contents API accepted the documentation, stylesheet, and app changes on `main` in sequential commits.
- Build and test checks have not yet been independently confirmed for the resulting main commits. Inspect GitHub Actions and Vercel's automatically triggered status before declaring this milestone verified.


## 2026-10-20 — Launch-draft form feedback and keyboard recovery

- Reviewed W3C WAI's form-validation and user-notification guidance, the official Raydium LaunchLab creation walkthrough, and WCAG 2.2 before changing the launch-draft form. Research and transfer decisions are recorded in `UI_UX_RESEARCH.md`.
- Replaced the generic launch-draft validation message with field-specific name, symbol, and total-supply guidance.
- Added `aria-invalid` and `aria-describedby` associations, a concise submit summary, and focus placement on the first invalid field. Editing a field clears only its own stale error.
- Updated the visual treatment so invalid inputs and helper text are distinguishable while retaining the global high-contrast keyboard focus indicator.
- Added regression coverage for all-empty submission, first-invalid focus, linked supply-range feedback, and clearing a field error after correction.
- Safety boundary unchanged: drafts are local UI state; no wallet connection, contract generation, signature, deployment, or trade is enabled.
- Verification at branch preparation: CI has not yet completed for this change. Confirm type-check, Vitest, production build, and Vercel preview before merging. No manual deployment was invoked.


### Verification follow-up — 2026-10-20

- The first pull-request workflow run (#19) caught three test failures because inline error copy was nested inside wrapping labels and became part of the fields' accessible names.
- Moved field labels and inputs into separate, explicitly associated elements while retaining `aria-describedby` links to inline errors. Added a grid constraint to keep form controls within their columns.
- Follow-up GitHub Actions run #20 passed dependency installation, TypeScript type-check, all Vitest files, and the production build: https://github.com/UsmanXTech/OPENORBIT/actions/runs/39334369953
- Current PR head at verification: `cc6bc15e5d846cbdb9469955865be500e000cddb`. GitHub reports the PR mergeable and its merge state clean.
- Vercel has no deployment record for this current PR head. The latest production deployment for `main` (`13431027793183940b24367ee4efff22cad6f572`) is READY. No manual deployment was invoked.
- Promotion remains blocked: the GitHub connector's pull-request metadata update and merge actions were rejected by OpenAI safety checks. The PR remains open and `main` is unchanged; no branch protection or repository policy was bypassed.


## 2026-10-20 — Hourly autonomous run (06:41 PKT)

### Course correction mid-run

- Run started against `1343102`; while implementing, PR #3 "Automation/uiux preview catalog" was squash-merged to `main` (`2c5bef3`), shipping exactly the planned work: per-field launch-draft errors with first-invalid-field focus, `aria-invalid`/`aria-describedby` links, clear-on-edit, and an error summary.
- Per the no-duplication rule, the in-progress duplicate implementation was discarded (reverted) and local was reset to `2c5bef3`. No code was duplicated onto main.

### Delivered instead (highest remaining value)

- Generated and committed `package-lock.json` (npm install on Node 24, 161 packages; no dependency changes) — closes the long-standing "dependency lockfile missing" item in README/PROGRESS.
- Updated README.md: lockfile is no longer listed as outstanding; install/type-check/test/build are recorded as verified locally against the pinned set.
- Independently verified merged `main` (`2c5bef3`) with real local runs: `npm run typecheck` passed, `npm test` passed (10/10), `npm run build` passed. This closes the 2026-10-20 "build and test checks have not yet been independently confirmed" gap.

### Reference consulted

- W3C WAI technique ARIA21 (https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21): error text next to the field linked via `aria-describedby`, `aria-invalid` flag on failure, focus moved to the first error — pattern matches what PR #3 shipped. `aria-errormessage` deliberately not adopted (screen-reader support lags behind `aria-describedby`).

### Safety boundary

- No wallet connection, contract generation, deployment, trade, or chain action touched; no secrets added; nothing deployed to Vercel.


## 2026-10-20 — Hourly autonomous run (07:41 PKT)

- Starting state: `main` at `f128339` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs (PRs #1–#3 all merged; latest CI on main green).
- This hour's highest-value improvement: the asset-detail dialog ("View details") was rebuilt from a single bare paragraph into a structured detail view — identity header (coin icon, name, symbol, category, listing badge), a "Sample stats" definition list (Sample price, Sample market cap, Category, Listing), an "About this listing" section, the illustrative-data notice, and a "Back to catalog" close button. All market figures remain explicitly labeled as samples; no wallet, live-chain, or trade functionality is implied (safety boundary unchanged).
- Research (mandatory per-component; recorded in `UI_UX_RESEARCH.md` with all five decision points): (1) W3C WAI-ARIA APG Dialog (Modal) Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — fetched directly; validated keeping the existing focus trap/restoration/Escape and adding an explicit close button; (2) Uniswap "What is the Token Details page?" support doc (http://support.uniswap.org/hc/en-us/articles/9818052307341-What-is-the-Token-Details-page) — transferred the identity-header + stats-section + info-section structure with every figure sample-labeled; the live app page (app.uniswap.org/explore/tokens) is a JS bundle and timed out on text fetch, limitation recorded.
- Files changed: `src/App.tsx` (asset dialog markup), `src/styles.css` (asset-detail, detail-stats, detail-about styles), `src/App.test.tsx` (2 new regression tests), `UI_UX_RESEARCH.md` (research record), `PROGRESS.md` (this entry).
- Verification (real runs, Node 24, same pinned lockfile): `npm run typecheck` passed; `npm test` 12/12 passed (was 10/10 before this run); `npm run build` passed.
- Promotion: direct commit + push to `main` after a fresh `git fetch origin`; promotion status verified below (CI run on the new main head).
- Next run: consider keyboard/announcement feedback for sort changes in the catalog (screen-reader users currently get no announcement when the sort order changes), plus a responsive check of the new dialog on narrow viewports.

## 2026-10-20 — Inline launch-draft form (form-popup → inline page conversion)

### Research-first decisions (recorded in UI_UX_RESEARCH.md §10–11)

- Carbon Design System Form usage (https://www.carbondesignsystem.com/components/form/usage/): transferred header/body/footer form structure (title + description header, fields, full-width submit action), persistent visible labels, and "(optional)" marking for the description field; skipped Carbon's tooltip/fluid-input vocabulary.
- GOV.UK Design System Error summary (https://design-system.service.gov.uk/components/error-summary/): transferred the "There is a problem" summary with per-field anchor links (`#token-name`, `#token-symbol`, `#token-supply`) worded identically to the inline errors; kept OPENORBIT's first-invalid-field focus (existing behavior/tests) instead of GOV.UK's focus-the-summary convention.

### Implemented

- The launch-draft form was converted from a modal Dialog into a full inline page section, per the hard no-form-in-dialog design rule. The `#launch` section is now a two-column grid: sticky creator intro on the left, a light form card on the right containing the title "Create launch draft", preview-only notice, all four fields, error summary, submit action, and draft-review result.
- The dialog union is now `"wallet"|"asset"|null`; wallet and asset dialogs remain (informational views, not form-submission flows).
- The hero "Start a launch draft ↘" button now smooth-scrolls to `#launch` and moves focus to the first field (guarded for environments without `scrollIntoView`).
- Validation logic, first-invalid-field focus, `aria-invalid`/`aria-describedby` wiring, and draft-review result are unchanged; error summary is now a `role="alert"` box with a heading and field links.

### Verification (real runs, Node 24)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 14/14 passed (2 failures found and fixed during the run — one test-environment `scrollIntoView` guard, two assertions updated for errors now appearing both inline and in the summary links).
- `npm run build`: passed (production bundle built to `dist/`).

Files changed: `src/App.tsx`, `src/styles.css`, `src/App.test.tsx`, `README.md`, `UI_UX_RESEARCH.md`, `PROGRESS.md`.

## 2026-10-20 — Asset detail converted from dialog to inline page

- The asset-detail Dialog was removed and replaced with a full inline detail page rendered inside `#explore`, replacing the catalog grid while open (per the prefer-inline-over-dialogs rule; the wallet dialog remains as the sole informational interstitial). The dialog union is now `"wallet"|null`.
- The inline detail page opens with a descriptive "← Back to explore assets" back link (GOV.UK back-link pattern), followed by the identity header, sample-labeled stats grid, "About this listing" section, sample-data notice, and a "Back to catalog" button (Uniswap token-detail page pattern: identity → stats → info in page flow).
- Focus management: opening moves focus to the detail heading (`tabIndex={-1}`, scroll-guarded); Escape closes the view; closing restores focus to the triggering "View details" button and preserves catalog search/filter/sort state.
- New CSS: `.asset-detail-page` panel, `.back-link` accent back link with `focus-visible` ring, programmatic-focus handling on the detail heading; stats grid collapses to one column under 680px.

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 15/15 passed (2 new/rewritten: inline-detail rendering with heading focus + no-dialog assertion, Escape-close; focus-restore assertion on back-to-catalog).
- `npm run build`: passed (production bundle built to `dist/`).

Files changed: `src/App.tsx`, `src/styles.css`, `src/App.test.tsx`, `UI_UX_RESEARCH.md`, `PROGRESS.md`.

## 2026-10-20 — Wallet "Connect wallet" dialog → inline panel conversion

- The last remaining modal dialog (wallet options) was removed and replaced with a full inline panel section (`#wallet`) rendered in the normal page flow after the stats overview, per the hard no-popup design rule (prefer inline pages over dialogs when in doubt). The app now ships zero modals: launch draft = inline form section, asset detail = inline page view, wallet = inline panel.
- The header "Connect wallet" button reveals the panel: the page scrolls to it and programmatic focus moves to the panel heading ("Connect wallet", `tabIndex={-1}`, scroll-guarded). The panel shows explanatory copy, the MetaMask and WalletConnect option buttons (honest preview labels; selecting one only updates the status note), a `role="status"` live status notice, and a "Hide panel" button that collapses the panel and returns focus to the header "Connect wallet" button.
- The generic `Dialog` component (focus trap, Escape handler, backdrop-dismiss) and all modal CSS (`.modalback`, `.modal`, `.modalhead`, `.x`) were deleted; new CSS: `.wallet-panel` card, `.wallet-head` layout with focus-visible ring handling, responsive `.wallet-grid` (2 columns → 1 under 680px).
- Research recorded in UI_UX_RESEARCH.md §14–16: GOV.UK Design System (ships no modal component; canonical pattern is a full interruption page — confirmed via secondary docs quoting the GDS position), Carbon Design System dialog patterns ("disruptive... use them sparingly", don't put informational content in overlays), Fallingbrick modal best practices ("routine messages... better handled inline"; focus restored to the opener on close — preserved via the Hide-panel focus return).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 15/15 passed (wallet test rewritten for the inline panel: asserts no `dialog` role anywhere, heading receives focus on open, provider option updates the live notice, Hide panel removes the panel and returns focus to the trigger; fixed one async-focus timing with `waitFor`).
- `npm run build`: passed (production bundle built to `dist/`).

Files changed: `src/App.tsx`, `src/styles.css`, `src/App.test.tsx`, `UI_UX_RESEARCH.md`, `PROGRESS.md`.

## 2026-10-20 — Screen-fitted single-page app shell (Rule 2 conversion: tabbed views, zero page scroll)

- Starting state: `main` at `84d5e45` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement: the stacked scrolling page (hero → stats → explore → launch → how-it-works → footer) was converted into a **screen-fitted single-page app** per Hard Design Rule 2. The app is now a `100dvh` flex shell: compact top bar (brand + tab navigation + Preview badge + Connect wallet), one visible view at a time, and a slim one-line status strip (replacing the old footer). The page never scrolls; each view is a single screen.
- Views (tabs: Explore / Launch / Wallet / Guide, one-word labels per Carbon):
  - **Explore**: compact header + toolbar (category segmented filter, search, sort, reset) + dense token `<table>` (sticky headers; Token/Category/Sample price/Sample market cap/Listing/Actions columns; per-row "Details" and "Trade · demo" buttons) replacing the card grid; all 6 sample rows fit one screen. Asset detail opens inline replacing the table (back link, Escape, focus restore — preserved).
  - **Launch**: two-column single screen — compact intro (eyebrow, heading, short copy, pills) + the existing form card with unchanged validation/error-summary/first-invalid-field-focus logic.
  - **Wallet**: centered single-screen panel — heading, preview copy, MetaMask/WalletConnect options, `role="status"` live notice. The top-bar "Connect wallet" button now activates this tab.
  - **Guide**: the former "How it works" 4 steps as compact cards + safety notice (content preserved, no longer a stacked page section).
- Accessibility (W3C APG Tabs Pattern, fetched this run): `tablist`/`tab`/`tabpanel` roles, `aria-selected`, `aria-controls`, roving tabindex, Left/Right/Home/End arrow navigation with wrap and automatic activation; explicit activation (click/Enter) moves focus to the view heading; a visually-hidden `role="status"` live region announces view changes. No dialogs anywhere (zero overlays, unchanged from last run).
- Honest limitation: `.tablewrap`, the launch grid, and the asset-detail panel use internal `overflow-y:auto` as a last-resort fallback on very short viewports (<~620px); typical desktop and mobile-portrait heights render fully scroll-free. The Uniswap live app (JS bundle) could not be text-fetched; the support doc + prior Uniswap research stand as inspected references.
- Research (mandatory per-component; recorded in `UI_UX_RESEARCH.md` §17–19): (1) Uniswap "How to use the Explore page" support doc (https://support.uniswap.org/hc/en-us/articles/9818094509453-How-to-use-the-Uniswap-Explore-page) — dense tabbed token table; (2) W3C ARIA APG Tabs Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — full keyboard contract; (3) Carbon Design System Tabs usage (https://v10.carbondesignsystem.com/components/tabs/usage/) — concise labels, same-context navigation.
- Files changed: `src/App.tsx` (tab shell + 4 views; table catalog; removed hero/stats stacked sections, scrollIntoView logic), `src/styles.css` (100dvh shell, tablist, table, view layouts, responsive card reflow ≤680px), `src/App.test.tsx` (rewritten for tab navigation: 3 new/rewritten tests — single-view switching, arrow-key tabs contract, launch/wallet via tabs), `README.md` (feature list), `UI_UX_RESEARCH.md` (§17–19), `PROGRESS.md` (this entry).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 17/17 passed (15 app + 2 search).
- `npm run build`: passed (production bundle built to `dist/`).

### Promotion

- Direct commit + push to `main` after a fresh `git fetch origin`; promotion status verified below (CI run on the new main head).
- Next run: per-view height audit on short/narrow viewports (verify the no-scroll claim renders scroll-free at 360×640 and 1366×768), then continue the UI/UX redesign priority — e.g. richer Explore table affordances (column sort headers replacing the select) or Launch-view density polish.

## 2026-10-20 — No-scroll audit at 360×640 / 1366×768 + Guide-view clipping fix

### Research-first decisions (UI_UX_RESEARCH.md sessions 20–21)

- Observed the live Uniswap app https://app.uniswap.org/explore/tokens read-only: page-scroll model with fixed nav + sticky column header (~69px rows, ~13–14 visible per 1080px height). Adopted the sticky-header affordance inside OPENORBIT's internal table scroll region; kept the user-mandated 100dvh no-scroll shell (a deliberate divergence, documented honestly). 360px mobile behavior unobservable — reported as unknown, not inferred.
- Consulted W3C WCAG 2.2 Understanding SC 1.4.10 Reflow http://w3c.github.io/wcag/understanding/reflow: internal scrolling is the sanctioned pattern for data tables and toolbars-that-stay-in-view interfaces — which is exactly the Explore view. No 2D page scroll anywhere by construction.

### Audit findings (analytical — live pixel audit blocked, see below)

- Page scroll is structurally impossible (`body { overflow: hidden }` + 100dvh flex shell). At 1366×768 all four views + detail + empty state fit with zero scrolling.
- At 360×640, Explore table / Launch grid / asset detail engage their documented last-resort internal scroll regions — consistent with the rule.
- **Bug found:** the Guide view had NO scroll container: at 360×640 its content (~600px: header + 4 step cards + notice) exceeded the available ~504px and was clipped unreachable. Fixed: `.guide-view` now has `flex: 1; min-height: 0; overflow-y: auto` (same last-resort pattern as the other panels).
- Added a `@media (max-height: 700px)` density pass (tighter view padding/gaps, smaller section padding) so internal scroll regions engage as rarely as possible on short viewports.

### Verification

- New regression suite `src/noscroll.test.ts` (5 tests) reads `src/styles.css` and asserts the hard-rule invariants: body never scrolls, shell is exactly 100dvh, flex chain cannot collapse panels, every panel has `overflow-y: auto`, header tab strip cannot grow the header taller. `src/node-types.d.ts` provides minimal ambient types so the suite typechecks without adding @types/node to app dependencies.
- `npm run typecheck`: pass. `npm test`: 22/22 pass. `npm run build`: pass.
- Audit-method limitation: the browser agent cannot reach loopback URLs, execute in-page JS, or resize viewports, and no Playwright/Chromium exists in this sandbox — so no real-pixel measurements this run; geometry was verified analytically and the key invariants are now test-guarded.

### Files changed

- `src/styles.css` — Guide-view internal scroll container; short-viewport density media query.
- `src/noscroll.test.ts` (new), `src/node-types.d.ts` (new) — no-scroll invariant regression suite.
- `UI_UX_RESEARCH.md` — sessions 20–21 + honest-limitations update.

### Next

- Verify CI on the promoted commit; continue the honest no-scroll verification with real pixel measurements when a browser with viewport control is available (or a reachable staging URL); next UX increment candidate: Explore empty-state and toolbar density review.

## 2026-10-20 — Sortable column headers replace the sort select (Explore catalog)

- Starting state: `main` at `2d02a31` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement: the Explore catalog table now sorts via clickable column headers (Token name, Sample price, Sample market cap), replacing the toolbar sort select and freeing toolbar space. Tri-state cycle per column: first click sorts by domain-default direction (name A–Z; price and market cap highest-first, the crypto-explorer convention), second reverses, third restores the featured order. Reset search/filters also restores featured order; every sort change is announced in the existing `role="status"` live region.
- Accessibility (MDN `aria-sort` + Carbon data-table, see UI_UX_RESEARCH.md §22–23): button inside `<th>` (W3C APG pattern), `aria-sort` set on the active column only and moved when another column is sorted, arrow indicators `aria-hidden` and revealed on hover/focus or persistently when sorted, Tab + Space/Enter operable, numeric columns right-aligned with tabular numerals.
- Responsive: on ≤680px (card reflow) the `<thead>` no longer vanishes — sortable headers reflow into a compact pill sort bar above the cards so sorting stays touch-reachable on mobile.
- Data: added numeric `price` to the sample asset model (values match the displayed `$` labels; illustrative sample data, no live-data claims).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 28/28 passed (15 app + 6 new sort-header tests in `src/App.sort.test.tsx` + 2 search + 5 no-scroll invariants).
- `npm run build`: passed (production bundle built to `dist/`).
- Live no-scroll pixel audit: attempted via the browser agent against https://openorbit.vercel.app at 360×640 / 1366×768 / 1920×1080 — **blocked at the tooling level**: the browser environment exposes no viewport resize and no in-page JS execution, so `scrollHeight`/`clientHeight`/`scrollY` cannot be measured at any size. What WAS verified qualitatively: the site loads cleanly; Explore table, inline asset Details view, empty state (`zzzzno-match` → "No matching assets" + reset), Launch form, Wallet panel, and Guide cards all render fully at the default viewport with no clipping and no horizontal overflow; a full-page scroll attempt produced no visible change, consistent with the no-page-scroll design (qualitative only, not measured). Honest conclusion: the structural guarantee (`body { overflow: hidden }` + 100dvh shell, guarded by the `noscroll.test.ts` invariant suite) still stands; real pixel measurements remain unavailable in this environment — retry when viewport/JS tooling exists.

### Files changed

- `src/App.tsx` — `sortKey`/`sortDir` state, `cycleSort` tri-state handler, `renderSortTh` header helper, removed sort `<select>`, reset restores featured order, sort announcements.
- `src/styles.css` — `.sort-btn` header-button styles with hover/focus-revealed indicators; removed `.sort-select`; ≤680px mobile sort-bar reflow.
- `src/types.ts` — `Asset.price: number`, `AssetSort` gains `"price"`, new `AssetSortDir`.
- `src/data/assets.ts` — numeric `price` values matching displayed labels.
- `src/App.sort.test.tsx` (new) — 6 tests: name A–Z + announcement + `aria-sort`, tri-state toggle back to featured, price highest-first, market-cap sort, single-`aria-sort` move between columns, reset restores featured order.
- `UI_UX_RESEARCH.md` — sessions 22–23 (mandatory per-component research).
- `PROGRESS.md` — this entry.

### CI failure + fix (same run)

- First promotion `f70c534` failed CI: 1 test failed — "rejects a supply above the documented maximum". Root cause: a pre-existing flake, not the new code — the view-heading focus timer (60ms `setTimeout` in `activate()`) can steal focus mid-typing on slow CI runners, dropping keystrokes (symbol field ended up empty, so focus landed on it instead of the supply field). Locally it passed 4/4.
- Fix: the four launch-form tests that type into fields after a tab switch now `waitFor` the view heading to receive focus (the timer's job) before typing — synchronizing past the race. Verified 3× locally (28/28 each run); committed as `43a6033` and pushed. CI on `43a6033`: **success** (run 39380255992).

### Next

- Record the live audit result; fix any residual page scroll or clipping it finds.
- Continue the UI/UX redesign priority within the no-scroll shell — e.g. Explore toolbar density review or asset-detail polish.

## 2026-10-20 — Explore toolbar density pass: shared 40px baseline + filter keyboard contract

- Starting state: `main` at `3fb7c3c` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the "Explore toolbar density review" item from run #8): the Explore toolbar now shares one 40px control baseline — category switcher, search field, and reset control all align on a single row instead of the previous ragged heights (34px tabs / 38px field). Filter tabs are equal-width (`flex:1`, Carbon content-switcher pattern); on ≤680px the toolbar stacks cleanly: full-width filter row, then a full-width search row, preserving 40px touch targets.
- Keyboard contract for the category filter group (Carbon content-switcher): Tab into the group, Left/Right arrows move focus with wrap and auto-activate the focused tab, Home/End jump to the ends; roving tabindex keeps it to one Tab stop. Search gains Escape-to-clear (Carbon search pattern) alongside the existing × button.
- Research (mandatory per-component; UI_UX_RESEARCH.md §24–25, fetched directly this run): Carbon Content switcher usage — 32/40/48px size ladder, equal-width tabs, Left/Right arrow navigation with auto/manual activation, always-one-selected; Carbon Search usage — consistent component sizes for layout harmony, md 40px, Esc clears the field.

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 30/30 passed (15 app + 6 sort + 4 search — 2 new: Escape-clears-search, filter arrow-key navigation with auto-activation/wrap — + 5 no-scroll invariants).
- `npm run build`: passed (production bundle built to `dist/`).

Files changed: `src/App.tsx` (seg refs, `onFilterKeyDown`, roving tabindex, Escape handler), `src/styles.css` (40px baseline, equal tabs, stacked mobile toolbar), `src/App.search.test.tsx` (2 new tests), `UI_UX_RESEARCH.md` (§24–25), `PROGRESS.md` (this entry).

### Next

- Verify CI on the promoted commit; asset-detail polish (spacing/typography hierarchy in the inline detail page) remains the next UX candidate after the toolbar work lands.

### Promotion

- Direct commit `a6cb87d` pushed to `main` (`3fb7c3c..a6cb87d`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI run 39384595809 on `a6cb87d`: **success** (typecheck + all tests + build, 20s). Vercel: not touched (read-only; auto-deploys on Vercel's side).
