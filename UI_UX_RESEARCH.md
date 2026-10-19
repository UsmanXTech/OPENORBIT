# OPENORBIT UI/UX Research and Improvement Plan

_Last reviewed: 2026-10-19_

## Purpose

Use research and a concrete usability review before substantial UI changes. Treat competitor patterns as evidence to evaluate, not as designs to copy. Keep the product honest about its current demo-only state.

## Sources reviewed

1. **W3C — Web Content Accessibility Guidelines (WCAG) 2.2**  
   https://www.w3.org/TR/wcag/  
   Relevant criteria include visible keyboard focus, text labels and instructions, error identification and suggestions, predictable interactions, and minimum target sizing.
2. **W3C WAI — What's New in WCAG 2.2**  
   https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/  
   Useful explanations of focus visibility, focus not being obscured, and target-size requirements.
3. **OpenZeppelin Contracts Wizard**  
   https://wizard.openzeppelin.com/  
   A relevant smart-contract configuration reference point. OPENORBIT should keep any future configuration/review experience explicit about what is configured and what has not been generated, audited, or deployed.
4. **Solana launchpad UI template (public reference implementation)**  
   https://github.com/nirholas/solana-launchpad-ui  
   Documents common launchpad information architecture: discovery tabs, token details, creation form, trade/activity views, and mobile breakpoints. This is a pattern reference only; OPENORBIT must not imply these live features exist.

5. **Uniswap Explore — live app and official help guide**  
   https://app.uniswap.org/explore  
   https://support.uniswap.org/hc/en-us/articles/9818094509453-How-to-use-the-Uniswap-Explore-page  
   Reviewed the live route and official usage guide. The documented interface separates token, pool, and transaction discovery and supports explicit filtering/sorting. The live app is client-rendered, so interaction details here are based on the official guide rather than a DOM inspection. Transferable lesson: show how many results match the current view without changing the stable catalog total; do not imply OPENORBIT has live analytics or trading.
6. **Raydium LaunchLab — live create route and official flow guide**  
   https://raydium.io/launchpad/create/  
   https://github.com/raydium-io/raydium-docs-v1/blob/main/user-flows/creating-a-launchlab-token.mdx  
   Reviewed the live route and official walkthrough. The guide contrasts a minimal launch path with an advanced configurable path and calls for reviewing launch parameters before signing. Transferable lesson: make configuration and review boundaries explicit. Do not copy live-wallet or transaction affordances into the OPENORBIT preview.
7. **W3C — WCAG 2.2 Recommendation**  
   https://www.w3.org/TR/WCAG22/  
   Used as the baseline for focus visibility, understandable status messaging, form feedback, and operable controls. Color alone must not communicate connection state.

## Current-interface review

Reviewed the React UI in `src/App.tsx`, styles in `src/styles.css`, sample data in `src/data/assets.ts`, and interaction tests in `src/App.test.tsx`.

### What is already working well

- The app identifies itself as an early preview and labels market data as illustrative.
- Wallet and launch-draft actions are explicitly non-live.
- Asset search, filters, and sorting provide a basic discovery workflow.
- The modal implements Escape handling, focus cycling, and focus restoration.
- The launch form validates the supply limit in application logic and has regression coverage.
- CSS includes a visible keyboard-focus treatment and uses responsive sizing for major headings.

### Prioritized design findings

| Priority | Finding | UX risk | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | The green status dot is used next to network/testnet language even though the app is not connected and is a read-only preview. | Users may interpret a positive green status as a healthy live network connection. | Status copy and color/icon semantics distinguish “preview/demo” from “connected”; status never relies on color alone. |
| P1 | The “Listed assets” stat uses the currently filtered result count. | Filtering search results can make a marketplace-wide metric appear to change. | Rename it to “Matching assets” while filters are active, or keep the total stable and show result count separately. Add tests for the chosen behavior. |
| P1 | The main page combines navigation, search/filter controls, metrics, cards, and launch CTA in one long flow. | Users can lose context when narrowing the catalog, especially on small screens. | On mobile, controls remain readable and reachable; selected filter, result count, empty state, and clear-search action are easy to understand. |
| P1 | The launch form should make its review/confirmation boundary unmistakable. | Users may mistake a local draft for a generated contract or an actual launch. | Review summary states that nothing is generated, signed, or deployed; errors identify the field and how to fix it; no live action is implied. |
| P1 | Accessibility coverage is currently based on a small set of interaction tests. | Keyboard, screen-reader naming, contrast, and responsive regressions can go unnoticed. | Add focused tests for empty search results, keyboard modal behavior, field-level errors, and preview-state wording; manually verify narrow viewport and keyboard-only flow when a browser is available. |
| P2 | Visual styles are mostly compressed into dense CSS rules. | Future visual refinements may become inconsistent and harder to review. | Introduce a small, documented set of design tokens and reusable patterns when touching the stylesheet; avoid a risky full rewrite. |

## 2026-10-19 — Example-led review and first implementation

### Examples and decisions

- **Uniswap Explore:** the official guide documents separate discovery surfaces and useful filters/sort criteria. OPENORBIT now keeps the catalog-wide “Listed assets” count stable and shows a separate “Showing X of Y sample assets” message for the current search/filter view. This avoids presenting a filtered count as a total.
- **Raydium LaunchLab:** the official guide makes launch modes and irreversible settings explicit before the transaction approval step. OPENORBIT uses the pattern of clarity around state and review, not a live deployment CTA, because its launch form remains a local draft.
- **WCAG 2.2:** the green status dot and “Testnet preview” label could be interpreted as a healthy live network. The header now says “Preview mode”; the status card separately identifies the wallet as disconnected and chain integration as not configured. A neutral blue marker replaces the green success cue for preview status.

### Acceptance criteria for this change

- Preview status cannot be mistaken for an active testnet connection from copy or success-colored decoration.
- The catalog total remains stable while search results change.
- Users can see the matching result count and clear search/category filters in one action.
- Automated tests cover the stable total, count, reset behavior, and preview-state copy.

## Implementation sequence

1. Clarify preview/network status semantics and keep status understandable without color.
2. Correct marketplace metrics and improve search/filter/empty-state feedback.
3. Audit launch-draft form labels, field-level errors, and review summary.
4. Expand keyboard, accessibility, and responsive tests.
5. Consolidate repeated spacing, surface, border, and focus values into maintainable design tokens.
6. Re-check the full flow at desktop and mobile widths; record what was and was not verified.

## Definition of done for a UI/UX change

- The user problem and evidence are documented before implementation.
- Acceptance criteria are testable and scoped to the changed flow.
- UI remains honest about sample data and disabled live blockchain features.
- Keyboard focus, labels, errors, responsive behavior, and empty states are considered.
- Relevant tests, type-check, and production build pass in CI; if unavailable or failing, the limitation is recorded truthfully.
- The change is reviewed against the latest `main` before committing. Never deploy Vercel as part of this workflow.
