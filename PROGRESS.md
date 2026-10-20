# Engineering progress

## 2026-10-17 — React application foundation

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
