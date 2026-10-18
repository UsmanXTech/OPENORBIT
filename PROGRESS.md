# Engineering progress

## 2026-10-17 — React application foundation

Implemented in this milestone:

- Replaced the static HTML entry point with a Vite module entry.
- Added React + TypeScript application structure and typed sample asset data.
- Migrated search, category filtering, sorting, asset details, wallet preview, and launch-draft interactions.
- Added modal Escape handling, focus cycling, focus restoration, accessible labels, and reduced-motion/focus styles.
- Added five unit tests covering initial rendering, search, category filtering, launch-draft review, and wallet-preview safety messaging.
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
- Validation is committed on `automation/local-improvements`; dependency installation and CI execution still need confirmation.

## 2026-10-18 — CI test selector correction

- GitHub Actions run for `7b7978fe78cb2465d490952fd656332bfc3ab6bd`: TypeScript type-check passed; 2 of 6 UI tests failed because launch-draft tests queried a button name that omitted its visible arrow glyph.
- Updated both selectors to match the rendered accessible name, `Create launch draft ↗`.
- The production build was skipped after the failed test step. Re-run status is pending; do not treat tests or build as passing until CI confirms them.
- Dependency installation reported 3 audit findings; review package-level details before selecting safe dependency updates.
