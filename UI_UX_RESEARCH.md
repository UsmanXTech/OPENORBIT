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


## 2026-10-20 — Accessible launch-draft validation

### Real examples and guidance reviewed before implementation

- **W3C WAI — Validating Input:** https://www.w3.org/WAI/tutorials/forms/validation/  
  Explains required fields, custom validation, and the need to provide understandable feedback. Transfer: retain application-level validation because the form intentionally uses `noValidate`; do not rely only on browser attributes.
- **W3C WAI — User Notifications:** https://www.w3.org/WAI/tutorials/forms/notifications/  
  Recommends specific inline feedback, corrective instructions, programmatic association via `aria-describedby`, and moving focus to the first invalid control after submit. Transfer all four patterns; avoid a single generic message that forces users to guess which field is wrong.
- **Raydium official LaunchLab creation guide:** https://github.com/raydium-io/raydium-docs-v1/blob/main/user-flows/creating-a-launchlab-token.mdx  
  The documented flow asks creators to review parameters before approving an irreversible on-chain action. Transfer the explicit review boundary only. OPENORBIT remains a local draft and must not copy live signing, wallet, or deployment behavior.
- **W3C WCAG 2.2:** https://www.w3.org/TR/WCAG22/  
  Preserve visible keyboard focus, text-based error cues, and understandable status feedback. Error color is supplementary; each error remains readable text linked to its input.

### Design decision

The launch-draft form previously returned one generic error for three different validation failures. This adds field-level messages for token name, symbol, and total supply; marks invalid inputs with `aria-invalid`; links each message through `aria-describedby`; and moves focus to the first invalid field. Editing a field clears only that field's stale error. A concise alert summary remains for the overall submit failure.

### Acceptance criteria

- Empty submission identifies all required fields and focuses token name first.
- Invalid symbol and out-of-range supply show actionable field-specific guidance.
- Each invalid input exposes `aria-invalid="true"` and references its error text.
- Correcting a field clears its inline error without clearing unrelated errors.
- Valid input still produces only a local draft; no contract is generated, signed, or deployed.
- CI type-check, tests, and production build must pass before promotion; browser-only keyboard and narrow viewport checks remain separately reported.


## 2026-10-20 — Structured asset-detail dialog

### Real references reviewed before implementation

8. **W3C WAI-ARIA APG — Dialog (Modal) Pattern**
   https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
   - Patterns observed: on open, focus moves inside the dialog; Tab/Shift+Tab stay trapped; Escape closes; focus returns to the invoking element; a visible button that closes the dialog is strongly recommended; container has `role=dialog`, `aria-modal="true"`, `aria-labelledby` on the visible title; when content holds semantic structures (lists, paragraphs), initial focus may target a static element at the top so content is not announced as one unbroken string and not scrolled out of view.
   - What transfers: the existing focus trap, focus restoration, Escape handling, and the visible × close button were kept unchanged. A second explicit "Back to catalog" close button was added, matching the APG recommendation of a visible closing action. Initial focus remains on the close control — the dialog is short enough that content does not scroll out of view, so the APG's static-element condition does not apply.
   - What does not transfer: `aria-describedby` on the dialog container (APG advises omitting it when content has semantic structures like lists).
   - Why it suits OPENORBIT: the asset dialog is now structured and informational; keeping it a true modal with focus discipline keeps it keyboard- and screen-reader-friendly.
   - Accessibility/responsive implications: stats are exposed as a `<dl>` with `<dt>`/`<dd>` pairs (machine-readable labeled pairs); the modal already scrolls within `max-height: 85vh`; existing `focus-visible`, reduced-motion, and narrow-viewport styles are untouched.

9. **Uniswap Support — "What is the Token Details page?"**
   http://support.uniswap.org/hc/en-us/articles/9818052307341-What-is-the-Token-Details-page
   - Limitation recorded honestly: the live app page (https://app.uniswap.org/explore/tokens) is a JavaScript bundle and timed out on text fetch; the reference was read from Uniswap's official support documentation instead.
   - Patterns observed: a token detail page = identity header, price graph, a Stats section (TVL, market cap, FDV, 1-day volume), Transactions, Pools, and an Info section (description + links).
   - What transfers: structured sections — identity header (icon, name, symbol, badge), a labeled stats grid, an "About this listing" description section, and an honest no-live-data notice. Every figure is labeled "Sample".
   - What does not transfer: live price charts, transactions, pools, swap/buy CTAs, branding, or any implication that OPENORBIT has real market data.
   - Why it suits OPENORBIT: a catalog detail view benefits from quick-scan stats plus an about section — it matches the discovery mental model of a real product without copying its look or implying its capabilities.
   - Accessibility/responsive implications: clear heading hierarchy, definition-list stats, and the modal's existing responsive behavior.

## 2026-10-20 — Inline launch-draft form (form-popup → inline page conversion)

### Real references reviewed before implementation

10. **Carbon Design System — Form usage**
    https://www.carbondesignsystem.com/components/form/usage/
    - Patterns observed: a form is structured as header (title + description for context), form body (labels always visible, positioned above inputs; sentence-style capitalization), and footer (submit actions); persistent helper text under fields; placeholder is never a label replacement; error state must block submission until fixed; two-column forms collapse as a group.
    - What transfers: the inline form card now has a clear header ("Create launch draft" + "Draft settings are for preview only and are not submitted to a blockchain.") followed by the fields and a full-width "Review draft" action; labels stay visible above inputs; the description field is now marked "(optional)" instead of leaving ambiguity; error state blocks the draft review until fixed (unchanged logic).
    - What does not transfer: Carbon's tooltip-driven fluid-input style and product-specific token vocabulary — OPENORBIT keeps its existing design tokens.
    - Why it suits OPENORBIT: the form is now a first-class page section rather than a cramped dialog; the header/body/footer structure makes it scannable and honest about its draft-only status.
    - Accessibility/responsive implications: labels remain programmatically linked (`htmlFor`/`id`) and the existing `aria-invalid`/`aria-describedby` wiring is untouched; the two-column `formgrid` already collapses to one column under 680px; the form card uses a light surface on the dark launch panel so label contrast stays high.

11. **GOV.UK Design System — Error summary**
    https://design-system.service.gov.uk/components/error-summary/
    - Patterns observed: on validation failure, always show an error summary at the top of the form region with the heading "There is a problem", link each error to the field it relates to (href="#field-id"), and word summary errors exactly like the inline field errors; single-field questions link directly to the input.
    - What transfers: the inline form now shows an error summary with "There is a problem", an explanatory line, and a link list where each entry links to its field (`#token-name`, `#token-symbol`, `#token-supply`) with wording identical to the inline error messages. The summary keeps `role="alert"` so it is announced.
    - What does not transfer: GOV.UK's convention of moving keyboard focus to the summary container — OPENORBIT's standing behavior (and existing tests) focuses the first invalid field directly on failed submit, which also satisfies "land the user on the problem"; the summary links give the same jump-to-field capability as an additional path.
    - Why it suits OPENORBIT: without a modal trap, the failed submit now gives users two ways to recover — immediate focus on the first invalid field plus a scannable summary of everything that needs fixing.
    - Accessibility/responsive implications: links inside the alert are reachable by keyboard and announced with their destination context; the summary styles reuse the existing danger palette with visible `focus-visible` rings on the links; it reflows naturally inside the form card on narrow viewports.
