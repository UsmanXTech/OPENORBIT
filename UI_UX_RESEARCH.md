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


## 2026-10-20 — Premium visual redesign direction

### Real product examples reviewed before implementation

5. **Uniswap Explore — token discovery**  
   https://app.uniswap.org/explore/tokens  
   Observed patterns: clear product navigation, prominent search, distinct discovery categories, and structured tabular information for comparing assets. Transfer the clear information hierarchy and discovery-first controls; do not copy Uniswap branding, wallet flows, or imply that OPENORBIT has live prices, volume, or chain data.
6. **Raydium LaunchLab — token creation flow**  
   https://raydium.io/launchpad/create/  
   Observed pattern: creation is a dedicated task with explicit configuration steps rather than a generic call-to-action. Transfer the separation between browsing and preparing a launch draft; do not imply that OPENORBIT can create a token or submit a transaction.
7. **W3C WCAG 2.2**  
   https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html  
   Preserve visible focus, semantic labels, contrast, and clear feedback while refining the visual style.

### Design decision

The existing page relies on multiple large gradients, glowing decorative effects, dense rounded surfaces, and a dark blue palette that makes the interface feel more like a generic prototype than a finished product. The redesign uses a more disciplined editorial hierarchy, warm light workspace surfaces, ink-colored text, a single violet accent, consistent borders and radii, tighter data hierarchy, and a dark hero panel as a deliberate focal point. Existing responsive breakpoints, reduced-motion support, visible keyboard focus, and demo-only disclosures must remain intact.

### Acceptance criteria

- Establish a coherent design-token system and consistent surface, spacing, typography, button, input, card, and modal treatments.
- Keep navigation and primary actions clear at desktop and mobile widths.
- Use color and text together for state; never present a live connection or production network that is not configured.
- Keep all sample metrics explicitly identified as illustrative and all wallet/deployment actions non-live.
- Preserve keyboard focus, reduced-motion behavior, and readable form errors.
- Run typecheck, tests, and production build; record actual outcomes and do not claim unrun checks passed.
