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
- At initial scaffold time, CI had not yet been confirmed; see the later dated CI entries below for subsequent successful workflow runs.
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


## 2026-10-19 — Research-led preview-state and catalog feedback

- Reviewed the live Uniswap Explore route and its official help guide, the live Raydium LaunchLab creation route and official creation-flow guide, and the W3C WCAG 2.2 Recommendation before changing the interface.
- Changed the header from “Testnet preview” to “Preview mode”; separated wallet disconnection from the fact that chain integration is not configured; removed the green success cue from preview-state indicators.
- Kept “Listed assets” tied to the full sample catalog, added a separate live result count, and added a one-action reset for search and category filters.
- Added regression tests for stable totals, result-count updates, reset behavior, and preview-state wording.
- Verification: local dependency installation and test execution are unavailable in this tool environment. Check the GitHub Actions run for the new commit before treating the change as verified. No Vercel deployment was invoked.