## 2026-10-20 — Launch draft-review card typography: key/value summary rows (run #18)

- Starting state: `main` at `88f52f3` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the queued "Launch-view draft-review card typography" item from run #17): the "Draft ready for review" card no longer renders the draft as a run-on sentence ("Open Orbit (ORBT) · Total supply: 1,000,000 · …") — it now uses a structured `<dl class="draft-summary">` with one key/value row per field (Token name / Symbol / Total supply / Description), hairline dividers between rows, PatternFly-style vertical stacking (term above description, the density-safe choice in a narrow card), a 12px/600/--muted label tier and a 13px/650/--text value tier (sentence-case, consistent with the run-#17 ladder). The Description row renders only when a description was entered. No behavior change: review flow, validation, aria-live="polite", Edit draft, notice copy, DOM order, and the no-scroll layout are untouched.
- Research (mandatory per-component; UI_UX_RESEARCH.md §42, both read directly this run): GOV.UK Design System Summary list (dl/dt/dd check-answers rows with dividers, for summarizing form responses — exactly this card's job) + PatternFly Description list (default term-above-description stacking; horizontal layout reserved for wide screens; label subordinate to value). Not transferred: per-row "Change" links (the single Edit draft button is the change action), horizontal/column layouts (no width in a no-scroll card), popovers, the summary-card variant.
- Accessibility fix inherited by design: labels use --muted (#696b75, ≈5.4:1 on white — AA pass at 12px, the same token run #17 fixed) with weight also carrying the key/value distinction; native dl association needs no aria wiring; long descriptions get overflow-wrap: anywhere.

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 45/45 passed (43 existing + 2 new: draft review renders a dl key/value summary with dt/dd pairs and the old run-on sentence format is gone; Description row appears only when a description was entered). One iteration of the first new test failed on my own expectation — the app uppercases the symbol on review (ORBT, existing behavior) — corrected, no app change.
- `npm run build`: passed (production bundle built to `dist/`).
- `npx vitest run src/noscroll.test.ts`: 5/5 passed (Hard Design Rule 2 CSS invariants hold; the card lives inside the launch grid's documented last-resort internal scroll region).

### Files changed

- `src/App.tsx` — the draft-result summary paragraph replaced with `dl.draft-summary` / `dt` / `dd` rows (name, symbol, supply; description conditional).
- `src/styles.css` — `.draft-summary` (divider-framed list), `.draft-row` (8px vertical padding, hairline dividers, term-above-value stack), `dt` 12px/600/--muted, `dd` 13px/650/--text with overflow-wrap: anywhere; the old `.draft-result p` rule removed.
- `src/App.test.tsx` — 2 new tests (summary structure contract; conditional Description row).
- `UI_UX_RESEARCH.md` — session 42 (mandatory per-component research) + honest-limitations note.
- `PROGRESS.md` — this entry.

### Next

- Verify CI on the promoted commit. Next UX candidates: Explore empty-state copy/density pass; then the no-scroll live-geometry audit follow-ups (both within the no-scroll shell).

### Promotion

- PENDING: direct commit to `main` after a fresh fetch; CI to be verified.

## 2026-10-20 — Wallet status-list density + Explore toolbar field-sizing consistency (run #16)

- Starting state: `main` at `7f0fb34` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the queued "Wallet status-list density alignment with the new guide task-list row rhythm; then Explore toolbar field-sizing consistency pass" item from run #15): (1) the Wallet status list now shares the Guide view's GOV.UK task-list row rhythm — row padding 10px 14px → 12px 14px, gutter 12px → 14px, name 13px → 14px/700, detail 11.5px/1.5 → 12px/1.5, list margin 14px → 16px — so the divider-separated status rows and the standalone guide cards read as one product (two views that shared a seam are re-synced; rows, honesty, and lozenges unchanged); (2) the Explore toolbar's shared 40px baseline is fixed for real — the segmented switcher rendered 42px tall (3px padding ×2 + 34px tabs + 2px border) against the 40px search field and 40px reset control, a 2px baseline break; tabs are now min-height 32px so the switcher's outer height is exactly 40px (3+32+3+2), and the search-field geometry is consolidated (dead overridden 10px 12px base padding removed; base `.field` chrome + one 40px search rule). No behavior change: filter keyboard contract, Escape-to-clear, wallet statuses, DOM order, and the no-scroll layout are untouched.
- Research (mandatory per-component; UI_UX_RESEARCH.md §39–40, read this run): Statuspage component-list pattern — GitHub Status page (opened directly; fetch returned incident-timeline text, not component markup — limitation recorded), OnlineOrNot status-page components docs (opened directly: per-component rows, name + text status + dividers, 5–10 components, fixed status vocabulary); public-status-page guide excerpts. Carbon Forms pattern page (opened directly: 40px default input height regardless of context, consistency of alignments and geometries is key); NNGroup form-usability Top 10 (excerpts — limitation recorded: match fields to input size, same layout across the site). Not transferred: real operational statuses/incident machinery (demo honesty), Carbon's 32px spacing (shell exception), field-width-as-affordance for the search field (flex fill is the deliberate primary-action override).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 43/43 passed (41 existing + 2 new: wallet status rows each carry name/detail/text-status-lozenge; toolbar keeps filter switcher, search field, and reset control in one `.toolbar` row — reset joins the row once a filter is active).
- `npm run build`: passed (production bundle built to `dist/`).

### Files changed

- `src/styles.css` — `.tab` min-height 34px → 32px (switcher outer height now exactly 40px); `.field` base padding 10px 12px → 0 12px (dead override removed) with the 40px search rule consolidated; `.status-row` padding 12px 14px, gap 14px; `.status-main strong` 14px/700; `.status-detail` 12px/1.5; `.status-list` margin 16px 0. Short-viewport density fallbacks unchanged.
- `src/App.test.tsx` — 2 new tests (wallet status-row structure contract; toolbar single-row control structure).
- `UI_UX_RESEARCH.md` — sessions 39–40 (mandatory per-component research) + honest-limitations notes for run #16.
- `PROGRESS.md` — this entry.

### Next

- Verify CI on the promoted commit. Next UX candidates: asset-detail typography hierarchy review; then the no-scroll live-geometry audit follow-ups (both within the no-scroll shell).

### Promotion

- Direct commit `7a911ed` pushed to `main` (`7f0fb34..7a911ed`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI on `7a911ed` (feature): first attempt **failed** with the known pre-existing slow-runner flake ("moves keyboard focus to the field when a summary link is activated" — 42/43 passed, both new tests green; the view-heading 60ms focus timer steals focus mid-typing on loaded CI runners, same race as runs #8/#14/#15, and this run's changes touch none of that code — CSS + 2 new tests only); workflow rerun: **success**. Final CI on main green; no code changed by the rerun.
- Vercel: not touched (read-only; auto-deploys on Vercel's side).

# Engineering progress

## 2026-10-20 — Launch-view density polish (proportional form columns, card header, button geometry in CSS)

- Starting state: `main` at `cfec9e7` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the queued "Launch-view density polish" item from run #14): the Launch form card now has a proper header — an `h3` "Draft settings" title above the preview-only note, establishing the title 14px > field-label 12px > input-text 12px hierarchy — and the name/symbol row uses proportional columns (2fr/1fr) instead of equal 1fr/1fr, so the short symbol field (max 10 chars) no longer looks unfinished next to the 40-char name field; grid gap tightened 12px→10px and grid margin 14px→12px to remove dead space inside the no-scroll shell. All three inline `style={width:"100%"}` occurrences (Review draft, Edit draft) moved into CSS as a `.btn-block` class — button geometry now lives in the stylesheet. No behavior change: validation, error summary, focus-to-field, aria wiring, DOM order, and the no-scroll layout are untouched.
- Research (mandatory per-component; UI_UX_RESEARCH.md §37–38, both read directly this run): Carbon Form usage — proportional two-column rows, label-above-input, minority-only "(optional)" marking, helper text replaced by error text; its 32px vertical spacing NOT transferred (would overflow the 100dvh shell — documented exception). Adobe Spectrum Text field (Spectrum Hub; reached via the site's own search after the legacy /page/text-fields/ and /page/form/ URLs 404'd on the redesign) — top labels default/recommended, 1.5×-height minimum field width (the narrowed symbol column clears it ~2.2×), error text as 1–2 short complete sentences ending in periods (matches our copy), no filler help text for layout continuity. Side labels rejected per Spectrum (harm reflow/localization); Spectrum's S/M/L/XL scale not adopted (one consistent field size).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 41/41 passed (39 existing + 2 new: card `h3` "Draft settings" renders below the view h2 without duplicating/outranking it; Review draft and Edit draft buttons carry `btn-block` and no inline `style` attribute).
- `npm run build`: passed (production bundle built to `dist/`).

### Files changed

- `src/App.tsx` — `h3.launch-card-title` "Draft settings" added at the top of `.launch-card`; symbol field-group gets `field-short` class (hook for future refinements; the proportions come from the grid); inline styles removed from "Review draft" and "Edit draft" buttons in favor of `btn-block`.
- `src/styles.css` — `.launch-card-title` (14px/750); `.formgrid` grid columns `1fr 1fr` → `2fr 1fr` (proportional; full rows still span via `.full`), gap 12px → 10px, margin 14px → 12px; `.formgrid label` 11px → 12px; new `.btn-block { display:block; width:100% }` + `.draft-result .btn-block { margin-top:12px }`. The existing ≤680px media query still collapses `.formgrid` to one column, so proportional columns never squeeze a field on mobile.
- `src/App.test.tsx` — 2 new tests (card title anatomy; button geometry in CSS).
- `UI_UX_RESEARCH.md` — sessions 37–38 (mandatory per-component research) with the two direct reads and their transfer/not-transfer notes.
- `PROGRESS.md` — this entry.

### Next

- Verify CI on the promoted commit. Next UX candidates: Wallet status-list density alignment with the new guide task-list row rhythm; then Explore toolbar field-sizing consistency pass (both within the no-scroll shell).

### Promotion

- Direct commit `e892160` pushed to `main` (`cfec9e7..e892160`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI on `e892160` (feature): **success** (first attempt, no flake).
- CI on `a3243e5` (docs-only): first attempt **failed** with the known pre-existing slow-runner flake ("moves keyboard focus to the field when a summary link is activated" — the view-heading 60ms focus timer steals focus mid-typing on loaded CI runners; same race as run #8 and run #14, and this run's feature changes touch none of that code); the workflow rerun flaked a second time on the same test, then **succeeded** on the third attempt. Final CI on main green; no code changed by the reruns.
- Vercel: not touched (read-only; auto-deploys on Vercel's side).

## 2026-10-20 — Guide steps become an actionable task list (whole-row navigation)

- Starting state: `main` at `ac113d7` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the "Guide view content-density polish" item from run #13): the Guide view's four static step cards are replaced with an actionable task list — each step is now a full-row button that navigates to the view that does the work (Explore → 01, Launch → 02 and 03, Wallet → 04), with an honest status lozenge alongside each row ("Available" ×3, "Preview only" for the testnet step). The old cards were dead-end decoration restating what the app is; the new list is the Guide's actual job: a "from idea to launch draft" onboarding hub that jumps users to each stage with the target heading focused on arrival. Layout is now a single vertical list everywhere (the 4-col/2-col/1-col grid breakpoints are deleted) — 4 compact rows are strictly shorter than 4 cards, so the 100dvh no-scroll fit improves; `.guide-view` narrows from 860px to 720px for the list measure.
- Research (mandatory per-component; UI_UX_RESEARCH.md §35–36, fetched directly this run): GOV.UK Design System Task list component — whole row linked (research: users clicked statuses thinking they were links), name + single-sentence hint (no full stop, no links inside), `aria-describedby` from the task link to its status, sentence-case short names, tasks in any order; status-redesign-to-look-less-like-buttons finding NOT needed here since the row itself is the action. Carbon status-indicator pattern (search excerpts; limitation documented) — text label carries the meaning, never color-only. Not transferred: GOV.UK's Completed/Incomplete gating (this is an onboarding hub, not a multi-session service) and its visual tag style (app's `.lozenge` tones reused); Carbon's icon/stop-light vocabulary (no uptime to report). Limitations honestly recorded: Material Design's Steppers page now 404s (M3 retired steppers), the old service-manual task-list URL 404s too — the GOV.UK Design System components page is the page actually opened.
- Accessibility: rows are real `<button type="button">` elements with the existing `:focus-visible` treatment; `aria-describedby` ties each row to its status (GOV.UK pattern); step numbers are `aria-hidden` decoration with `<ol>` semantics supplying position; the chevron glyph is `aria-hidden`; navigation reuses `activate(target, true)` so focus moves to the target view's heading and the live region announces the switch; hint copy has no trailing period per GOV.UK's hint rule; statuses are never color-only (WCAG 1.4.1).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 39/39 passed twice consecutively (36 existing + 3 new guide tests: task-list renders 4 row buttons with honest statuses; clicking "Configure" navigates to the Launch view with heading focus; each row's `aria-describedby` resolves to its status tag).
- `npm run build`: passed (production bundle built to `dist/`).

### Files changed

- `src/App.tsx` — `guideSteps` data model (name/hint/target/status/tone); Guide `<ol>` renders full-row buttons wired to `activate(step.target, true)` with `aria-describedby` status ids.
- `src/styles.css` — `.guide-steps` vertical task-list styles (`.guide-step-row` full-row button, hover, number/body/lozenge/chevron); deleted the 4-col/2-col/1-col grid overrides; `.guide-view` max-width 860px → 720px; density tweaks retargeted at the row.
- `src/App.test.tsx` — 3 new tests (task-list anatomy + statuses, step navigation with heading focus, status describedby).
- `UI_UX_RESEARCH.md` — sessions 35–36 (mandatory per-component research) + new honest-limitations bullets (M2 steppers 404, old GOV.UK URL 404, Carbon via excerpts).
- `PROGRESS.md` — this entry.

### Next

- Verify CI on the promoted commit. Next UX candidate: Launch-view density polish (the last queued item) — the form grid's field spacing/typography, within the no-scroll shell.

### Promotion

- Direct commit `c172d1c` pushed to `main` (`ac113d7..c172d1c`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI on `c172d1c`: **success** (run 39398400012).
- Follow-up docs commit `147ebf8` first failed CI with the known pre-existing slow-runner flake (view-heading 60ms focus timer stole focus mid-typing in "moves keyboard focus to the field when a summary link is activated" — same race as run #8's failure); rerun of the same workflow: **success**. Final CI on main green; no code changed.
- Vercel: not touched (read-only; auto-deploys on Vercel's side).


## 2026-10-20 — Explore empty-state recovery pass: diagnosis copy + granular recovery actions

- Starting state: `main` at `f73f329` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree had one local-only docs edit (run #12's Promotion fill-in, folded into this run's commit); no open PRs; latest CI on main green.
- This hour's highest-value improvement: the Explore catalog empty state now follows the PatternFly "No results" empty-state pattern instead of the old generic "No matching assets" block. The heading is "No results found" (sentence case, no punctuation), and the body echoes back the user's actual search term and/or active category filter — e.g. `No sample assets match “Nebula” in the Trending category.` — so the miss is recognizable and diagnosable, followed by "Adjust your search or filters and try again." The single generic "Reset search and filters" button is replaced with granular recovery actions: "Clear search" (query only) and "Show all assets" (category filter only), up to two per the Atlassian CTA ceiling, each naming exactly what it undoes. Both recovery actions return keyboard focus to the search input since their own button unmounts. The heading is now a real `h3` (was `<strong>`); no second live region was added — the existing `aria-live="polite"` result count ("Showing 0 of N sample assets") already announces the state. All within the screen-fitted no-scroll shell, no layout-height change.
- Research (mandatory per-component; UI_UX_RESEARCH.md §32–34): PatternFly Empty state design guidelines (page opened directly) — the "No results" variant's DO/DON'T copy pairs (heading "No results found", body "Adjust your filters and try again.", stand-alone secondary buttons for filtering/search, sentence case, small variation inside tables); Atlassian Design empty-state guidance (page opened directly) — imperative one-to-two-word CTAs that complement the title, two-action ceiling, title/body non-redundancy; Carbon Design System empty-states (via search excerpts, limitation documented) — Nielsen's recognize/diagnose/recover, no dead ends, plain language. Not transferred: PatternFly's fa-search icon (toolbar already carries the signifier), Atlassian's celebratory tone layer (low-commitment recurring moment), any illustration (density).
- Accessibility: recovery buttons are real buttons with existing `:focus-visible` treatment; focus returns to the search input on recovery (no focus loss to `body`); state is text, never color-only; no new keyboard contracts; user input in the diagnosis is React-escaped.

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 36/36 passed (18 app + 7 search — 1 replaced, 4 new: diagnosis echo, clear-search recovery + focus, show-all recovery, full recovery via toolbar reset — + 6 sort + 5 no-scroll invariants).
- `npm run build`: passed (production bundle built to `dist/`).

### Files changed

- `src/App.tsx` — `searchInput` ref; `clearEmptySearch` / `clearEmptyFilter` recovery handlers with focus return; `renderEmptyState()` helper with contextual diagnosis copy and granular actions; empty-state block replaced with the helper; search input wired to the ref.
- `src/styles.css` — `.empty strong` → `.empty-title` (real `h3` styling); new `.empty-actions` button row.
- `src/App.search.test.tsx` — rewrote the stale "No matching assets"/"Reset search and filters" test; 4 new tests covering diagnosis echo, per-action recovery, and focus return.
- `UI_UX_RESEARCH.md` — sessions 32–34 (mandatory per-component research).

### Next

- Verify CI on the promoted commit. Next UX candidate: Guide view content-density polish (already has a short-viewport density pass; revisit for typographic hierarchy) or Launch-view density polish — both within the no-scroll shell.

### Promotion

- Direct commit `27735b3` pushed to `main` (`f73f329..27735b3`) after a fresh fetch; tree clean (run #12's local docs edit folded in), no concurrent work, no open PRs, no branch protections bypassed.
- CI run 39395026588 on `27735b3`: **success** (typecheck + 36 tests + build, 22s). Vercel: not touched (read-only; auto-deploys on Vercel's side).

## 2026-10-20 — Wallet honest-status redesign: connection-status report replaces fake connect buttons

- Starting state: `main` at `700f9cf` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement: the Wallet view is now a "Connection status" report instead of a fake "Connect wallet" page. The two provider buttons (MetaMask/WalletConnect) — which did nothing real and only updated a status note — are gone, and the header button is renamed from "Connect wallet" to "Wallet" since nothing ever connects. The view now lists five integration components (Wallet provider, MetaMask, WalletConnect, Network, Private keys) as rows with subtle Atlassian-style status lozenges — "Not connected", "Planned" ×2, "Not configured", "Not handled" — each with a one-line honest detail, plus a fixed `role="status"` notice: "No connection request will be sent. Real connections would require provider integration, chain configuration, and a security review — none of which this preview performs."
- Research (mandatory per-component; UI_UX_RESEARCH.md §30–31): Atlassian Statuspage component status list (support page opened directly) — component rows with status lozenges, text-labeled indicators, report-what-is-true-not-actions; operational vocabulary deliberately NOT transferred (a demo has no uptime to report). GitHub Docs "Reviewing your authorized OAuth apps" (search excerpts; its empty-state wording not visible — documented as a limitation, pattern only) — the review-list-of-actual-authorizations framing.
- Accessibility: states are never color-only (lozenge text carries meaning); rows are plain list items with no new keyboard contract; the view contains no form at all (Rule 1 trivially satisfied); heading focus management unchanged (`tabIndex={-1}` + focus on view activation).

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 33/33 passed (15 app — wallet test rewritten for the status-list design — + 6 sort + 4 search + 5 no-scroll invariants).
- `npm run build`: passed (production bundle built to `dist/`).
- Mid-run tooling incident: two `muse.edit` calls corrupted the module header of `src/App.tsx` (duplicated state declarations, lost `views` array close). Caught by `npm run typecheck` (TS2451 redeclare errors), repaired with a surgical rewrite of the header block, re-verified green. No other files were affected.

### Files changed

- `src/App.tsx` — removed `walletNotice` state + provider buttons; added module-level `walletStatuses` data; Wallet view now renders the status list with lozenges; header button renamed to "Wallet" (plain tab activation).
- `src/styles.css` — replaced `.wallet-grid`/`.walletopt`/`.walleticon` with `.status-list`/`.status-row`/`.lozenge` (muted + planned tones); short-viewport density adjustments updated.
- `src/App.test.tsx` — wallet test rewritten: status list has 5 rows, honest states present, no "Connect wallet" affordance anywhere, heading focus + tab-switch behavior.
- `UI_UX_RESEARCH.md` — sessions 30–31 (mandatory per-component research).

### Next

- Verify CI on the promoted commit. Next UX candidate: Guide view content density or Explore empty-state copy review — both within the no-scroll shell.

### Promotion

- Direct commit `f73f329` pushed to `main` (`700f9cf..f73f329`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI run 39391832805 on `f73f329`: **success** (typecheck + all tests + build, 24s). Vercel: not touched (read-only; auto-deploys on Vercel's side).

- Starting state: `main` at `310f188` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement: the Launch draft form's error summary now follows the GOV.UK error-summary pattern — it renders ABOVE the form fields (previously it sat below them, just before the submit button), and each summary link now moves keyboard focus to its field explicitly via the field refs. The old plain `href="#id"` anchors could not reliably do this in the no-scroll shell; the links keep their `href`s for semantics but their click handlers `preventDefault()` and focus the input. First-invalid-field focus on submit is unchanged (tested contract), so no behavior regresses; the summary's wording still matches the inline errors verbatim per the GOV.UK rule, `role="alert"` is preserved, and `aria-invalid`/`aria-describedby` associations are untouched.
- Research (mandatory per-component; UI_UX_RESEARCH.md §28–29): GOV.UK Error summary component (page opened directly) — summary at top of page, "There is a problem" heading, link each error to its field, move focus appropriately; focus-to-summary-on-submit deliberately NOT transferred (would fight the established first-invalid-field focus contract and its slow-runner race history). Carbon Forms usage — informative validation labels, summary-as-general-statement slot, keep-data-on-error; on-blur real-time validation not transferred (form validates on submit so fields can be filled in any order).
- Tests: 2 new tests in `src/App.test.tsx` — (1) the error summary precedes the form in DOM order, (2) activating the "Enter a total supply." summary link moves focus to the supply field. Existing summary tests (link hrefs, first-field focus, role="alert") all still pass unchanged.

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 33/33 passed, verified twice consecutively (first run showed the known pre-existing slow-runner flake once — 1 failure — then 33/33 twice; not caused by the change).
- `npm run build`: passed (production bundle built to `dist/`).

### Files changed

- `src/App.tsx` — `renderErrorSummary()` helper (summary block above the `<form>`), `renderErrorSummaryLink` link factory, `focusLaunchField` + `jumpToField` handlers; removed the old inline summary from inside the form.
- `src/App.test.tsx` — 2 new tests (summary placement, link focus).
- `UI_UX_RESEARCH.md` — sessions 28–29 (mandatory per-component research).
- `PROGRESS.md` — this entry.

### Next

- Wallet view honest-status redesign (it is the least polished view; keep it inline and clearly preview-only, no real connections).
- Continue no-scroll structural audits as views change; pixel-measured live audit still blocked at tooling level.

### Promotion

- Direct commit `4eb41a6` pushed to `main` (`310f188..4eb41a6`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI on `4eb41a6`: **success** (typecheck + 33 tests + build). Vercel: not touched (read-only; auto-deploys on Vercel's side).

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

- Direct commit `ad87ad6` pushed to `main` (`67ebc7b..ad87ad6`) after a fresh fetch; tree clean, no concurrent work, no open PRs, no branch protections bypassed.
- CI run 39385267773 on `ad87ad6`: **success** (typecheck + all tests + build, 26s). Vercel: not touched (read-only; auto-deploys on Vercel's side).

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

## 2026-10-20 — Asset-detail typography hierarchy review

- Starting state: `main` at `18178bb` (verified with `git fetch origin` + `git log --oneline -3 origin/main`); working tree clean; no open PRs; latest CI on main green.
- This hour's highest-value improvement (the "Asset-detail typography hierarchy review" item from run #16): the asset detail card now has a coherent type ladder. Title 24px → `clamp(24px, 3.4vw, 28px)`/1.15 (clear 8px gap above the 20px KPI values, which previously sat only 4px below with no weight distinction); detail kicker 10px → 11px/800/.1em; "About this listing" was an 11px uppercase label identical to the KPI field labels — now a 13px/700 sentence-case section title with a hairline divider above the about section; KPI values get an explicit 1.25 line-height (inherited the body's airy 1.55 before); about prose 13px → 14px/1.65; fineprint stays 11px/1.6. CSS-only change — no behavior, markup, or layout-geometry change beyond ~4px on desktop.
- Research (mandatory per-component; UI_UX_RESEARCH.md §41): Carbon type scale (page opened and read directly) + M3 type scale (via search excerpts — m3.material.io fetch timed out; Uniswap SPA returned no readable content; both recorded as limitations). Applied: discrete Carbon scale steps, deliberate size+weight pairing, semibold-for-headers-not-prose rule; M3 labelSmall 11/16 and bodyMedium 14/20 mappings.
- Accessibility fix found during review: the 10px KPI labels and 10px kicker in `--subtle` (#858792) were below WCAG 1.4.3 AA for small text (≈3.4:1 on white) — both moved to `--muted` (#696b75, ≈5.4:1), section title to `--text`; tiers also carry weight/case/divider distinctions, never size alone.

### Verification (real runs, Node)

- `npm run typecheck`: passed (`tsc --noEmit`, no errors).
- `npm test`: 43/43 passed on three consecutive runs. One earlier invocation in this run showed 1 failed (test name not captured — summary only), consistent with the previously documented view-heading focus-timer flake on CI/slow runners; could not be reproduced in the three subsequent full runs (3× 43/43), so no code change was made — recorded, not hidden.
- `npm run build`: passed (production bundle built to `dist/`).

### Files changed

- `src/styles.css` — detail type ladder (title clamp, kicker 11px, about section title + divider, stat line-heights, prose 14px, contrast fixes).
- `UI_UX_RESEARCH.md` — session 41 (mandatory per-component research).
- `PROGRESS.md` — this entry.

### Promotion

- Direct commit `91c08cc` pushed to `main` (`18178bb..91c08cc`) after a fresh fetch (tree clean, no concurrent work, no open PRs); CI run 39409345414 on `91c08cc`: **success** (typecheck + all tests + build, 25s); Vercel not touched (read-only).

### Next

- Record CI result on the promoted commit; next UX candidate: Launch-view draft-review card typography or the Explore empty-state copy/density pass.
